'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, Clock, BookOpen, CheckCircle, XCircle, LogOut, User, Mail, Phone, Edit, X } from 'lucide-react';
import { createClient } from '../../utils/supabase/client';
import { useRouter } from 'next/navigation';
import type { User as SupabaseUser } from '@supabase/supabase-js';

// Disable static generation for this page
export const dynamic = 'force-dynamic';

interface Interview {
  id: string;
  booking_id?: string;
  scheduled_at: string | null;
  completed: boolean;
  student_feedback?: string;
  notes?: string;
  tutor?: {
    id: string;
    name: string;
    email: string;
  };
  university?: {
    id: string;
    name: string;
  };
  booking?: {
    package: string;
    payment_status: string;
    universities?: string;
    field?: string;
    created_at: string;
  };
}

interface Booking {
  id: string;
  package: string;
  payment_status: string;
  status: string;
  universities?: string;
  field?: string;
  created_at: string;
  preferred_time?: string;
  notes?: string;
}

interface AvailabilitySlot {
  id?: string;
  date: string;
  hour_start: number;
  hour_end: number;
  notes?: string;
}

function StudentDashboardContent() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userRecord, setUserRecord] = useState<any>(null);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'interviews' | 'availability' | 'profile'>('overview');
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  
  // Modal states
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUniversity, setEditingUniversity] = useState('');
  const [savingUniversity, setSavingUniversity] = useState(false);

  // Availability form state
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
  const [newDate, setNewDate] = useState('');
  const [newStartHour, setNewStartHour] = useState(9);
  const [newEndHour, setNewEndHour] = useState(17);
  const [availabilityNotes, setAvailabilityNotes] = useState('');
  const [submittingAvailability, setSubmittingAvailability] = useState(false);
  
  const router = useRouter();
  const supabase = createClient();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';

  // Fetch user data from backend
  const fetchUserData = async (userEmail: string) => {
    try {
      setDataLoading(true);

      const response = await fetch(`${backendUrl}/api/v1/students/email/${encodeURIComponent(userEmail)}/dashboard`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch dashboard data');
      }

      const { user: userData, bookings: bookingsData, interviews: interviewsData, availability: availabilityData } = result.data;

      setUserRecord(userData);
      setBookings(bookingsData || []);

      // Transform interviews data
      const transformedInterviews = (interviewsData || []).map((interview: any) => ({
        id: interview.id,
        booking_id: interview.booking_id,
        scheduled_at: interview.scheduled_at,
        completed: interview.completed,
        student_feedback: interview.student_feedback,
        notes: interview.notes,
        tutor: interview.tutor ? {
          id: interview.tutor.id,
          name: interview.tutor.name || interview.tutor.email,
          email: interview.tutor.email,
        } : undefined,
        booking: interview.booking,
      }));
      setInterviews(transformedInterviews);

      // Set availability slots
      if (availabilityData && availabilityData.length > 0) {
        setAvailabilitySlots(availabilityData.map((slot: any) => ({
          id: slot.id,
          date: slot.date,
          hour_start: slot.hour_start,
          hour_end: slot.hour_end,
          notes: slot.notes,
        })));
      }

    } catch (error) {
      console.error('Error fetching user data:', error);
      alert('Failed to load dashboard data');
    } finally {
      setDataLoading(false);
      setLoading(false);
    }
  };

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login?redirectTo=/student-dashboard');
      } else {
        setUser(user);
        await fetchUserData(user.email!);
      }
    };
    checkAuth();
  }, [router, supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  const handleOpenInterviewModal = (interview: Interview) => {
    setSelectedInterview(interview);
    setEditingUniversity(interview.booking?.universities || '');
    setIsModalOpen(true);
  };

  const handleUpdateUniversity = async () => {
    if (!selectedInterview?.booking_id) return;

    try {
      setSavingUniversity(true);
      
      const response = await fetch(`${backendUrl}/api/v1/students/bookings/${selectedInterview.booking_id}/university`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ university: editingUniversity }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to update university');
      }

      // Refresh data
      if (user) {
        await fetchUserData(user.id);
      }
      setIsModalOpen(false);
      alert('University preference updated successfully!');
    } catch (error: any) {
      console.error('Error updating university:', error);
      alert(error.message || 'Failed to update university preference');
    } finally {
      setSavingUniversity(false);
    }
  };

  const handleAddAvailabilitySlot = () => {
    if (!newDate) {
      alert('Please select a date');
      return;
    }
    if (newStartHour >= newEndHour) {
      alert('End time must be after start time');
      return;
    }

    setAvailabilitySlots([
      ...availabilitySlots,
      {
        date: newDate,
        hour_start: newStartHour,
        hour_end: newEndHour,
      },
    ]);
    setNewDate('');
    setNewStartHour(9);
    setNewEndHour(17);
  };

  const handleRemoveAvailabilitySlot = (index: number) => {
    setAvailabilitySlots(availabilitySlots.filter((_, i) => i !== index));
  };

  const handleSubmitAvailability = async () => {
    if (!userRecord || availabilitySlots.length === 0) {
      alert('Please add at least one availability slot');
      return;
    }

    try {
      setSubmittingAvailability(true);

      const response = await fetch(`${backendUrl}/api/v1/users/${userRecord.id}/availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slots: availabilitySlots,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to submit availability');
      }

      alert('Availability submitted successfully!');
      setAvailabilitySlots([]);
      setNewDate('');
      setAvailabilityNotes('');
      
      // Refresh data to show updated availability
      await fetchUserData(user!.email!);
    } catch (error: any) {
      console.error('Error submitting availability:', error);
      alert(error.message || 'Failed to submit availability');
    } finally {
      setSubmittingAvailability(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const upcomingInterviews = interviews.filter(i => !i.completed && i.scheduled_at);
  const completedInterviews = interviews.filter(i => i.completed);
  const unscheduledBookings = bookings.filter(b => 
    !interviews.some(i => i.booking_id === b.id)
  );

  // Get user display name
  const userName = userRecord?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student';
  const userEmail = userRecord?.email || user?.email || '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
              <p className="mt-1 text-sm text-gray-600">
                Welcome back, {userName}!
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm text-gray-500">Signed in as</p>
                <p className="text-sm font-medium text-gray-900">{userEmail}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="mt-6 flex gap-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('interviews')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'interviews'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Interviews
            </button>
            <button
              onClick={() => setActiveTab('availability')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'availability'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Availability
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'profile'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Profile
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Upcoming Interviews</p>
                    <p className="text-3xl font-bold text-gray-900">{upcomingInterviews.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Completed Interviews</p>
                    <p className="text-3xl font-bold text-gray-900">{completedInterviews.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <BookOpen className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Bookings</p>
                    <p className="text-3xl font-bold text-gray-900">{bookings.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Interviews */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Upcoming Interviews</h2>
              </div>
              <div className="p-6">
                {upcomingInterviews.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No upcoming interviews scheduled</p>
                    {unscheduledBookings.length > 0 && (
                      <p className="text-sm text-gray-500 mt-2">
                        You have {unscheduledBookings.length} booking(s) waiting to be scheduled
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingInterviews.map((interview) => (
                      <div
                        key={interview.id}
                        onClick={() => handleOpenInterviewModal(interview)}
                        className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
                      >
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <Calendar className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {interview.booking?.package || 'Interview Session'}
                              </h3>
                              {interview.tutor && (
                                <p className="text-sm text-gray-600 mt-1">with {interview.tutor.name}</p>
                              )}
                              {interview.booking?.universities && (
                                <p className="text-sm text-gray-600">Universities: {interview.booking.universities}</p>
                              )}
                            </div>
                            <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                              Upcoming
                            </span>
                          </div>
                          {interview.scheduled_at && (
                            <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(interview.scheduled_at).toLocaleDateString('en-GB', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {new Date(interview.scheduled_at).toLocaleTimeString('en-GB', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </div>
                            </div>
                          )}
                          {interview.notes && (
                            <p className="mt-2 text-sm text-gray-600 italic">{interview.notes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Unscheduled Bookings */}
            {unscheduledBookings.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Pending Bookings</h2>
                  <p className="text-sm text-gray-600 mt-1">These bookings are waiting to be scheduled</p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {unscheduledBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="p-3 bg-yellow-50 rounded-lg">
                          <Clock className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{booking.package}</h3>
                          {booking.universities && (
                            <p className="text-sm text-gray-600 mt-1">Target: {booking.universities}</p>
                          )}
                          <p className="text-sm text-gray-500 mt-2">
                            Booked on {new Date(booking.created_at).toLocaleDateString('en-GB')}
                          </p>
                        </div>
                        <span className="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
                          Pending
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={() => setActiveTab('availability')}
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-left"
                >
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Submit Availability</p>
                    <p className="text-sm text-gray-600">Let us know when you're free</p>
                  </div>
                </button>
                <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all text-left">
                  <BookOpen className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">View Resources</p>
                    <p className="text-sm text-gray-600">Access preparation materials</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Interviews Tab */}
        {activeTab === 'interviews' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">All Interviews</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tutor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {interviews.map((interview) => (
                      <tr key={interview.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleOpenInterviewModal(interview)}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {interview.scheduled_at ? (
                            <>
                              <div className="text-sm text-gray-900">
                                {new Date(interview.scheduled_at).toLocaleDateString('en-GB', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </div>
                              <div className="text-sm text-gray-500">
                                {new Date(interview.scheduled_at).toLocaleTimeString('en-GB', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </div>
                            </>
                          ) : (
                            <span className="text-sm text-gray-500">Not scheduled</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">
                            {interview.booking?.package || 'Mock Interview'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {interview.tutor?.name || 'Not assigned'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              interview.completed
                                ? 'bg-blue-100 text-blue-800'
                                : interview.scheduled_at
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {interview.completed ? 'Completed' : interview.scheduled_at ? 'Scheduled' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600 max-w-xs truncate">
                            {interview.notes || '-'}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && userRecord && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-blue-100 rounded-full">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{userRecord.full_name}</h2>
                  <p className="text-sm text-gray-600">
                    Member since {new Date(userRecord.created_at).toLocaleDateString('en-GB', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{userRecord.email}</p>
                  </div>
                </div>

                {userRecord.phone_number && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium text-gray-900">{userRecord.phone_number}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <button className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Account Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Statistics</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total Interviews</p>
                  <p className="text-2xl font-bold text-gray-900">{interviews.length}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Completed Interviews</p>
                  <p className="text-2xl font-bold text-gray-900">{completedInterviews.length}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Interview Details Modal */}
      {isModalOpen && selectedInterview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Interview Details</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Interview Info */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Package</p>
                  <p className="text-lg font-medium text-gray-900">
                    {selectedInterview.booking?.package || 'N/A'}
                  </p>
                </div>

                {selectedInterview.scheduled_at && (
                  <div>
                    <p className="text-sm text-gray-600">Scheduled Time</p>
                    <p className="text-lg font-medium text-gray-900">
                      {new Date(selectedInterview.scheduled_at).toLocaleString('en-GB', {
                        dateStyle: 'full',
                        timeStyle: 'short',
                      })}
                    </p>
                  </div>
                )}

                {selectedInterview.tutor && (
                  <div>
                    <p className="text-sm text-gray-600">Tutor</p>
                    <p className="text-lg font-medium text-gray-900">{selectedInterview.tutor.name}</p>
                    <p className="text-sm text-gray-500">{selectedInterview.tutor.email}</p>
                  </div>
                )}

                {/* Editable University Field */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Target University</label>
                  <input
                    type="text"
                    value={editingUniversity}
                    onChange={(e) => setEditingUniversity(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter university name"
                  />
                </div>

                {selectedInterview.notes && (
                  <div>
                    <p className="text-sm text-gray-600">Notes</p>
                    <p className="text-gray-900">{selectedInterview.notes}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span
                    className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                      selectedInterview.completed
                        ? 'bg-blue-100 text-blue-800'
                        : selectedInterview.scheduled_at
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {selectedInterview.completed ? 'Completed' : selectedInterview.scheduled_at ? 'Scheduled' : 'Pending'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateUniversity}
                  disabled={savingUniversity}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                >
                  {savingUniversity ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StudentDashboard() {
  return <StudentDashboardContent />;
}
