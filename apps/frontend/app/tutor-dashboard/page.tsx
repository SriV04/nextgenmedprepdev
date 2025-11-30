'use client';

import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Download, RefreshCw, Calendar as CalendarIcon, List, UserPlus, LogOut, User } from 'lucide-react';
import InterviewBookingModal from '../../components/InterviewBookingModal';
import TutorCalendar from '../../components/tutor-calendar/TutorCalendar';
import AvailabilityModal from '../../components/tutor-calendar/AvailabilityModal';
import InterviewDetailsModal from '../../components/tutor-calendar/InterviewDetailsModal';
import UnassignedInterviews from '../../components/tutor-calendar/UnassignedInterviews';
import CommitChangesBar from '../../components/tutor-calendar/CommitChangesBar';
import { TutorCalendarProvider, useTutorCalendar } from '../../contexts/TutorCalendarContext';
import { createClient } from '../../utils/supabase/client';
import { useRouter } from 'next/navigation';
import type { User as SupabaseUser } from '@supabase/supabase-js';

// Disable static generation for this page
export const dynamic = 'force-dynamic';

interface Booking {
  id: string;
  email: string;
  package: string;
  amount: number;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  status?: 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  created_at: string;
  preferred_time?: string;
  universities?: string;
  field?: 'medicine' | 'dentistry';
  phone?: string;
  notes?: string;
  file_path?: string;
  tutor_id?: string;
  start_time?: string;
  end_time?: string;
  complete?: boolean;
}

interface BookingStats {
  total: number;
  recent: number;
  byStatus: Record<string, number>;
  byPackage: Record<string, number>;
  totalRevenue: number;
}

function DashboardContent() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<BookingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isManager, setIsManager] = useState(false);

  // Tab management
  const [activeTab, setActiveTab] = useState<'bookings' | 'calendar'>('calendar');
  const [isBookingsUnlocked, setIsBookingsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Password for bookings tab (in production, this should be env variable or more secure)
  const BOOKINGS_PASSWORD = process.env.NEXT_PUBLIC_BOOKINGS_PASSWORD || 'admin123';

  // Use calendar context
  const { tutors, setCurrentUserId, openInterviewDetailsModal } = useTutorCalendar();
  
  const router = useRouter();
  const supabase = createClient();

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [packageFilter, setPackageFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';

  // Check authentication on mount and set current user
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login?redirectTo=/tutor-dashboard');
      } else {
        setUser(user);
        // Set the current user ID in the calendar context
        setCurrentUserId(user.id);
        
        // Fetch user role from the tutors table
        const { data: tutorData, error: tutorError } = await supabase
          .from('tutors')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (tutorData && !tutorError) {
          setUserRole(tutorData.role);
          setIsAdmin(tutorData.role === 'admin');
          setIsManager(tutorData.role === 'manager');
          console.log('Tutor role:', tutorData.role);
        } else {
          console.error('Error fetching tutor role:', tutorError);
          // Default to regular tutor if role not found
          setUserRole('tutor');
          setIsAdmin(false);
          setIsManager(false);
        }
      }
    };
    checkAuth();
  }, [router, supabase, setCurrentUserId]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  const handleBookingsTabClick = () => {
    if (!isBookingsUnlocked) {
      setShowPasswordDialog(true);
    } else {
      setActiveTab('bookings');
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === BOOKINGS_PASSWORD) {
      setIsBookingsUnlocked(true);
      setActiveTab('bookings');
      setShowPasswordDialog(false);
      setPasswordInput('');
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password. Please try again.');
      setPasswordInput('');
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch bookings and stats in parallel
      const [bookingsRes, statsRes] = await Promise.all([
        fetch(`${backendUrl}/api/v1/bookings/all`),
        fetch(`${backendUrl}/api/v1/bookings/stats`),
      ]);

      if (!bookingsRes.ok || !statsRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const bookingsData = await bookingsRes.json();
      const statsData = await statsRes.json();

      if (bookingsData.success) {
        setBookings(bookingsData.data);
      }

      if (statsData.success) {
        setStats(statsData.data);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching data');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      setUpdatingStatus(bookingId);
      const response = await fetch(`${backendUrl}/api/v1/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update booking');
      }

      const result = await response.json();
      if (result.success) {
        // Update local state
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status: status as any } : b))
        );
        // Refresh stats
        fetchData();
      }
    } catch (err: any) {
      alert('Failed to update booking: ' + err.message);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleRowClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleScheduleInterview = async (bookingId: string, interviewId: number, date: string, time: string, comments: string) => {
    try {
      // Combine date and time into start_time
      const startTime = `${date}T${time}:00`;
      
      // For core packages, we need to handle multiple interviews
      // For now, we'll store the interview info in the notes field
      const isCore = bookings.find(b => b.id === bookingId)?.package?.toLowerCase().includes('core');
      let noteText = comments;
      
      if (isCore) {
        noteText = `Interview ${interviewId} scheduled for ${date} at ${time}. ${comments || ''}`.trim();
      } else {
        noteText = comments ? `${comments} (Scheduled on ${new Date().toISOString()})` : `Scheduled on ${new Date().toISOString()}`;
      }
      
      const response = await fetch(`${backendUrl}/api/v1/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          start_time: startTime,
          notes: noteText,
          status: 'confirmed'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to schedule interview');
      }

      const result = await response.json();
      if (result.success) {
        // Update local state
        setBookings((prev) =>
          prev.map((b) => 
            b.id === bookingId 
              ? { 
                  ...b, 
                  start_time: startTime, 
                  status: 'confirmed' as any,
                  notes: noteText
                } 
              : b
          )
        );
        // Refresh stats
        fetchData();
        
        if (isCore) {
          alert(`Interview ${interviewId} scheduled successfully!`);
        } else {
          alert('Interview scheduled successfully!');
        }
      }
    } catch (err: any) {
      alert('Failed to schedule interview: ' + err.message);
    }
  };

  const downloadPersonalStatement = async (bookingId: string) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/v1/interview-bookings/${bookingId}/personal-statement`
      );

      if (!response.ok) {
        throw new Error('Failed to get download URL');
      }

      const result = await response.json();
      if (result.success && result.data.download_url) {
        window.open(result.data.download_url, '_blank');
      }
    } catch (err: any) {
      alert('Failed to download personal statement: ' + err.message);
    }
  };

  const handleSlotClick = (slot: any, tutor: any) => {
    if (slot.type === 'interview' && slot.interviewId) {
      // Open interview details modal for assigned interviews
      openInterviewDetailsModal(slot.interviewId);
    } else if (slot.type === 'interview' && slot.bookingId) {
      // Fallback: Find the booking and open modal
      const booking = bookings.find(b => b.id === slot.bookingId);
      if (booking) {
        setSelectedBooking(booking);
        setIsModalOpen(true);
      } else {
        alert(`Interview: ${slot.title}\nStudent: ${slot.student}\nPackage: ${slot.package}`);
      }
    } else if (slot.type === 'available') {
      alert(`Available slot for ${tutor.tutorName}\nTime: ${slot.startTime} - ${slot.endTime}`);
    }
  };

  const handleUnassignedInterviewClick = (interview: any) => {
    alert(`Interview Details:\nStudent: ${interview.studentName}\nPackage: ${interview.package}\nUniversities: ${interview.universities}`);
  };

  const filteredBookings = bookings.filter((booking) => {
    // Search filter - search in email and user name if available
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const emailMatch = booking.email?.toLowerCase().includes(query);
      // Search in notes for customer name if it exists
      const notesMatch = booking.notes?.toLowerCase().includes(query);
      if (!emailMatch && !notesMatch) return false;
    }

    // Customer filter - show all bookings by selected customer
    if (selectedCustomer && booking.email !== selectedCustomer) return false;

    // Status filter
    if (statusFilter !== 'all' && booking.status !== statusFilter) return false;
    
    // Payment filter
    if (paymentFilter !== 'all' && booking.payment_status !== paymentFilter) return false;
    
    // Package filter
    if (packageFilter !== 'all') {
      // Check if package starts with the filter
      if (!booking.package?.toLowerCase().includes(packageFilter.toLowerCase())) return false;
    }
    return true;
  });

  // Get unique customers for quick filter
  const uniqueCustomers = Array.from(new Set(bookings.map(b => b.email)))
    .sort()
    .map(email => ({
      email,
      count: bookings.filter(b => b.email === email).length
    }));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no_show':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-red-800 font-semibold text-lg mb-2">Error Loading Dashboard</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-2 sm:px-4 lg:px-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
              {isAdmin ? 'Admin Dashboard' : isManager ? 'Manager Dashboard' : 'Tutor Dashboard'}
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              {isAdmin ? 'Manage bookings, assign interviews, and view statistics' : 
               isManager ? 'Assign interviews and manage schedules' : 
               'View your calendar and scheduled interviews'}
            </p>
            {user && (
              <div className="flex items-center gap-2 mt-2 text-xs sm:text-sm text-gray-600 flex-wrap">
                <User className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="truncate">{user.email}</span>
                {userRole && (
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    isAdmin ? 'bg-purple-100 text-purple-800' : 
                    isManager ? 'bg-orange-100 text-orange-800' : 
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {userRole}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <button
              onClick={fetchData}
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-4 sm:mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-3 border-b-2 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
              activeTab === 'calendar'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            Calendar
          </button>
          <button
            onClick={handleBookingsTabClick}
            className={`flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-3 border-b-2 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
              activeTab === 'bookings'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <List className="w-4 h-4 sm:w-5 sm:h-5" />
            Bookings
            {!isBookingsUnlocked && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                🔒
              </span>
            )}
          </button>
        </div>

        {/* Statistics Cards */}
        {activeTab === 'bookings' && stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h3 className="text-xs sm:text-sm font-medium text-gray-500">Total Bookings</h3>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">{stats.total}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h3 className="text-xs sm:text-sm font-medium text-gray-500">Recent (7 days)</h3>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600 mt-1 sm:mt-2">{stats.recent}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h3 className="text-xs sm:text-sm font-medium text-gray-500">Total Revenue</h3>
              <p className="text-xl sm:text-3xl font-bold text-green-600 mt-1 sm:mt-2">
                {formatCurrency(stats.totalRevenue)}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h3 className="text-xs sm:text-sm font-medium text-gray-500">Completed</h3>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">
                {stats.byStatus.completed || 0}
              </p>
            </div>
          </div>
        )}

        {/* Bookings Tab Content */}
        {activeTab === 'bookings' && (
          <>
            {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Search & Filters</h3>
          
          {/* Search Bar */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search by Customer Email or Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedCustomer(null); // Clear customer filter when searching
                }}
                placeholder="Enter email or name..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Customer Filter */}
          {selectedCustomer && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-blue-900">
                  Viewing all bookings for: {selectedCustomer}
                </span>
                <span className="ml-2 text-sm text-blue-700">
                  ({filteredBookings.length} {filteredBookings.length === 1 ? 'booking' : 'bookings'})
                </span>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Clear
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no_show">No Show</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Status
              </label>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Payment Statuses</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Package Type</label>
              <select
                value={packageFilter}
                onChange={(e) => setPackageFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Packages</option>
                <option value="essentials">Essentials</option>
                <option value="core">Core</option>
                <option value="premium">Premium</option>
                <option value="career">Career Consultation</option>
                <option value="event">Event</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {filteredBookings.length} of {bookings.length} bookings
            </div>
            {(searchQuery || selectedCustomer || statusFilter !== 'all' || paymentFilter !== 'all' || packageFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCustomer(null);
                  setStatusFilter('all');
                  setPaymentFilter('all');
                  setPackageFilter('all');
                }}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Quick Customer Access */}
        {!selectedCustomer && !searchQuery && uniqueCustomers.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Customer Access</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
              {uniqueCustomers.slice(0, 12).map((customer) => (
                <button
                  key={customer.email}
                  onClick={() => setSelectedCustomer(customer.email)}
                  className="text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {customer.email}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {customer.count} {customer.count === 1 ? 'booking' : 'bookings'}
                  </div>
                </button>
              ))}
            </div>
            {uniqueCustomers.length > 12 && (
              <div className="mt-3 text-center text-sm text-gray-500">
                Showing 12 of {uniqueCustomers.length} customers. Use search to find more.
              </div>
            )}
          </div>
        )}

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Bookings</h3>
              <p className="text-sm text-gray-500">
                💡 Click on any row to view details, schedule interviews, or manage core package interviews
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Package
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      No bookings found matching the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <React.Fragment key={booking.id}>
                      <tr 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleRowClick(booking)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{booking.email}</div>
                          {!selectedCustomer && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent row click
                                setSelectedCustomer(booking.email);
                              }}
                              className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                            >
                              View all bookings →
                            </button>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="text-sm text-gray-900">{booking.package}</div>
                            {(booking.package?.toLowerCase().includes('live') || 
                              booking.package?.toLowerCase().includes('_live') ||
                              booking.package?.toLowerCase().includes('interview') ||
                              booking.package?.toLowerCase().includes('core')) && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                {booking.package?.toLowerCase().includes('core') ? 'Core' : 'Live'}
                              </span>
                            )}
                            {booking.package?.toLowerCase().includes('core') && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                3 Interviews
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            {formatCurrency(booking.amount)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(
                              booking.payment_status
                            )}`}
                          >
                            {booking.payment_status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                              booking.status
                            )}`}
                          >
                            {booking.status || 'pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(booking.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent row click
                              setExpandedBooking(
                                expandedBooking === booking.id ? null : booking.id
                              );
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            {expandedBooking === booking.id ? (
                              <ChevronUp className="w-5 h-5" />
                            ) : (
                              <ChevronDown className="w-5 h-5" />
                            )}
                          </button>
                        </td>
                      </tr>
                      {expandedBooking === booking.id && (
                        <tr>
                          <td colSpan={7} className="px-6 py-4 bg-gray-50">
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                    Booking Details
                                  </h4>
                                  <dl className="space-y-1">
                                    <div>
                                      <dt className="text-xs text-gray-500">Booking ID:</dt>
                                      <dd className="text-sm text-gray-900 font-mono">
                                        {booking.id}
                                      </dd>
                                    </div>
                                    {booking.field && (
                                      <div>
                                        <dt className="text-xs text-gray-500">Field:</dt>
                                        <dd className="text-sm text-gray-900 capitalize">
                                          {booking.field}
                                        </dd>
                                      </div>
                                    )}
                                    {booking.universities && (
                                      <div>
                                        <dt className="text-xs text-gray-500">Universities:</dt>
                                        <dd className="text-sm text-gray-900">
                                          {booking.universities}
                                        </dd>
                                      </div>
                                    )}
                                    {booking.phone && (
                                      <div>
                                        <dt className="text-xs text-gray-500">Phone:</dt>
                                        <dd className="text-sm text-gray-900">{booking.phone}</dd>
                                      </div>
                                    )}
                                    {booking.preferred_time && (
                                      <div>
                                        <dt className="text-xs text-gray-500">Preferred Time:</dt>
                                        <dd className="text-sm text-gray-900">
                                          {booking.preferred_time}
                                        </dd>
                                      </div>
                                    )}
                                    {booking.notes && (
                                      <div>
                                        <dt className="text-xs text-gray-500">Notes:</dt>
                                        <dd className="text-sm text-gray-900">{booking.notes}</dd>
                                      </div>
                                    )}
                                  </dl>
                                </div>
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                    Actions
                                  </h4>
                                  <div className="space-y-2">
                                    <div>
                                      <label className="block text-xs text-gray-500 mb-1">
                                        Update Status:
                                      </label>
                                      <select
                                        value={booking.status || ''}
                                        onChange={(e) =>
                                          updateBookingStatus(booking.id, e.target.value)
                                        }
                                        disabled={updatingStatus === booking.id}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                                      >
                                        <option value="">Select status</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                        <option value="no_show">No Show</option>
                                      </select>
                                    </div>
                                    {booking.file_path && (
                                      <button
                                        onClick={() => downloadPersonalStatement(booking.id)}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                      >
                                        <Download className="w-4 h-4" />
                                        Download Personal Statement
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

            {/* Interview Booking Modal */}
            <InterviewBookingModal
              isOpen={isModalOpen}
              onClose={() => {
                setIsModalOpen(false);
                setSelectedBooking(null);
              }}
              booking={selectedBooking}
              onSchedule={handleScheduleInterview}
            />
          </>
        )}

        {/* Calendar Tab Content */}
        {activeTab === 'calendar' && (
          <div className="flex flex-col gap-6">
            {/* Commit Changes Bar - Show for admins and managers */}
            {(isAdmin || isManager) && <CommitChangesBar />}

            {/* Unassigned Interviews - Show for admins and managers */}
            {(isAdmin || isManager) && (
              <UnassignedInterviews
                onInterviewClick={handleUnassignedInterviewClick}
              />
            )}

            {/* Calendar Grid - Full Width */}
            <TutorCalendar
              onSlotClick={handleSlotClick}
              isAdmin={isAdmin || isManager}
            />
          </div>
        )}

        {/* Availability Modal */}
        <AvailabilityModal />
        
        {/* Interview Details Modal */}
        <InterviewDetailsModal />

        {/* Password Dialog for Bookings Tab */}
        {showPasswordDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Protected Area</h2>
              <p className="text-gray-600 mb-6">Please enter the password to access the bookings tab.</p>
              
              <form onSubmit={handlePasswordSubmit}>
                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setPasswordError('');
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter password"
                    autoFocus
                  />
                  {passwordError && (
                    <p className="mt-2 text-sm text-red-600">{passwordError}</p>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordDialog(false);
                      setPasswordInput('');
                      setPasswordError('');
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Unlock
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <TutorCalendarProvider>
      <DashboardContent />
    </TutorCalendarProvider>
  );
}
