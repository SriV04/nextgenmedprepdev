'use client';

import React, { useState, useEffect } from 'react';
import { X, Search, User, GraduationCap, Package, Plus, Mail, Phone, FileText, Users } from 'lucide-react';

interface Booking {
  id: string;
  user_id: string;
  email: string;
  package: string;
  universities: string;
  field?: string;
}

interface University {
  id: string;
  name: string;
}

type ModalMode = 'existing' | 'new';

interface CreateInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateInterview: (data: {
    booking_id: string;
    student_id: string;
    university: string;
    notes?: string;
  }) => Promise<void>;
}

export const CreateInterviewModal: React.FC<CreateInterviewModalProps> = ({
  isOpen,
  onClose,
  onCreateInterview
}) => {
  const [mode, setMode] = useState<ModalMode>('existing');
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [universities, setUniversities] = useState<University[]>([]);

  // Existing booking form state
  const [existingBookingForm, setExistingBookingForm] = useState({
    searchQuery: '',
    bookings: [] as Booking[],
    selectedBooking: null as Booking | null,
    selectedUniversity: null as University | null,
    notes: '',
  });

  // New booking form state
  const [newBookingForm, setNewBookingForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    packageType: 'essentials_live',
    field: 'medicine' as 'medicine' | 'dentistry',
    selectedUniversities: [] as University[],
    interviewCount: 1,
    universitySearchQuery: '',
    notes: '',
    paidAmount: 0,
  });

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';

  // Validation functions
  const validateExistingBookingForm = (): boolean => {
    return !!(existingBookingForm.selectedBooking && existingBookingForm.selectedUniversity);
  };

  const validateNewBookingForm = (): boolean => {
    return !!(
      newBookingForm.fullName.trim() &&
      newBookingForm.email.trim() &&
      newBookingForm.selectedUniversities.length > 0
    );
  };

  const isFormValid = mode === 'existing' ? validateExistingBookingForm() : validateNewBookingForm();

  // Fetch universities on mount
  useEffect(() => {
    if (isOpen) {
      fetchUniversities();
    }
  }, [isOpen]);

  const fetchUniversities = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/v1/universities`);
      const data = await response.json();
      if (data.success) {
        setUniversities(data.data);
      }
    } catch (error) {
      console.error('Error fetching universities:', error);
    }
  };

  const searchBookings = async (query: string) => {
    if (!query.trim()) {
      setExistingBookingForm(prev => ({ ...prev, bookings: [] }));
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`${backendUrl}/api/v1/bookings/all`);
      const data = await response.json();
      if (data.success) {
        // Filter bookings client-side by email
        const filtered = data.data.filter((b: Booking) => 
          b.email.toLowerCase().includes(query.toLowerCase())
        );
        setExistingBookingForm(prev => ({ ...prev, bookings: filtered.slice(0, 10) }));
      }
    } catch (error) {
      console.error('Error searching bookings:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchBookings(existingBookingForm.searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [existingBookingForm.searchQuery]);

  // Helper function to create or get user
  const getOrCreateUser = async () => {
    const { email, fullName, phone } = newBookingForm;
    
    const getUserResponse = await fetch(`${backendUrl}/api/v1/users/email/${encodeURIComponent(email)}`);
    const getUserData = await getUserResponse.json();

    if (getUserData.success && getUserData.data) {
      console.log('Found existing user:', getUserData.data.id);
      return getUserData.data;
    }

    // Create new user
    const createUserResponse = await fetch(`${backendUrl}/api/v1/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.trim(),
        full_name: fullName.trim(),
        role: 'student',
        phone_number: phone.trim() || undefined,
      }),
    });

    const createUserData = await createUserResponse.json();
    if (!createUserData.success) {
      throw new Error(createUserData.message || 'Failed to create user');
    }
    console.log('Created new user:', createUserData.data.id);
    return createUserData.data;
  };

  // Helper function to create booking
  const createBooking = async (userId: string) => {
    const { email, packageType, field, phone, selectedUniversities, notes, paidAmount } = newBookingForm;
    const universitiesString = selectedUniversities.map(u => u.name).join(', ');
    
    const response = await fetch(`${backendUrl}/api/v1/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        email: email.trim(),
        package: packageType,
        universities: universitiesString,
        field: field,
        phone: phone.trim() || undefined,
        notes: notes.trim() || undefined,
        payment_status: paidAmount > 0 ? 'paid' : 'pending',
        amount: paidAmount,
      }),
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Failed to create booking');
    }
    console.log('Created booking:', data.data.id);
    return data.data;
  };

  // Helper function to create interviews
  const createInterviews = async (bookingId: string, studentId: string) => {
    const { selectedUniversities, interviewCount, notes } = newBookingForm;
    
    const interviewPromises = [];
    for (let i = 0; i < Math.min(interviewCount, selectedUniversities.length); i++) {
      interviewPromises.push(
        onCreateInterview({
          booking_id: bookingId,
          student_id: studentId,
          university: selectedUniversities[i].name,
          notes: notes.trim() || undefined,
        })
      );
    }

    await Promise.all(interviewPromises);
  };

  // Handle existing booking submission
  const handleExistingBookingSubmit = async () => {
    const { selectedBooking, selectedUniversity, notes } = existingBookingForm;
    
    if (!selectedBooking || !selectedUniversity) {
      alert('Please fill in all required fields');
      return;
    }
    
    await onCreateInterview({
      booking_id: selectedBooking.id,
      student_id: selectedBooking.user_id,
      university: selectedUniversity.name,
      notes: notes.trim() || undefined,
    });
  };

  // Handle new booking submission
  const handleNewBookingSubmit = async () => {
    if (!validateNewBookingForm()) {
      alert('Please fill in all required fields (Name, Email, Universities)');
      return;
    }

    const user = await getOrCreateUser();
    const booking = await createBooking(user.id);
    await createInterviews(booking.id, user.id);
    
    alert(`✓ Successfully created booking with ${newBookingForm.interviewCount} interview(s)!`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'existing') {
        await handleExistingBookingSubmit();
      } else {
        await handleNewBookingSubmit();
      }
      
      resetForm();
      onClose();
    } catch (error: any) {
      console.error('Error creating interview/booking:', error);
      alert(`Failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setExistingBookingForm({
      searchQuery: '',
      bookings: [],
      selectedBooking: null,
      selectedUniversity: null,
      notes: '',
    });
    
    setNewBookingForm({
      fullName: '',
      email: '',
      phone: '',
      packageType: 'essentials_live',
      field: 'medicine',
      selectedUniversities: [],
      interviewCount: 1,
      universitySearchQuery: '',
      notes: '',
      paidAmount: 0,
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleUniversityToggle = (uni: University) => {
    setNewBookingForm(prev => {
      const exists = prev.selectedUniversities.find(u => u.id === uni.id);
      
      if (exists) {
        return {
          ...prev,
          selectedUniversities: prev.selectedUniversities.filter(u => u.id !== uni.id),
        };
      }
      
      // Check if we've reached the interview limit
      if (prev.selectedUniversities.length >= prev.interviewCount) {
        alert(`You can only select up to ${prev.interviewCount} ${prev.interviewCount === 1 ? 'university' : 'universities'} based on the number of interviews.`);
        return prev;
      }
      
      return {
        ...prev,
        selectedUniversities: [...prev.selectedUniversities, uni],
      };
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Plus className="w-6 h-6" />
              <div>
                <h2 className="text-2xl font-bold">Create Interview</h2>
                <p className="text-green-100 text-sm">Add a new interview booking</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Mode Toggle */}
          <div className="flex gap-2 bg-white/10 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setMode('existing')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                mode === 'existing'
                  ? 'bg-white text-green-700'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Search className="w-4 h-4 inline mr-2" />
              Existing Booking
            </button>
            <button
              type="button"
              onClick={() => setMode('new')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                mode === 'new'
                  ? 'bg-white text-green-700'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              New Booking
            </button>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {mode === 'existing' ? (
              <>
                {/* Existing Booking Flow */}
                {/* Booking Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Student Booking *
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={existingBookingForm.searchQuery}
                      onChange={(e) => setExistingBookingForm(prev => ({ ...prev, searchQuery: e.target.value }))}
                      placeholder="Search by student email..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      disabled={!!existingBookingForm.selectedBooking}
                    />
                  </div>

                  {/* Selected Booking */}
                  {existingBookingForm.selectedBooking && (
                    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-gray-900">{existingBookingForm.selectedBooking.email}</p>
                        <button
                          type="button"
                          onClick={() => {
                            setExistingBookingForm(prev => ({
                              ...prev,
                              selectedBooking: null,
                              searchQuery: '',
                            }));
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><Package className="w-3 h-3 inline mr-1" />{existingBookingForm.selectedBooking.package}</p>
                        <p><GraduationCap className="w-3 h-3 inline mr-1" />{existingBookingForm.selectedBooking.universities}</p>
                        {existingBookingForm.selectedBooking.field && <p>Field: {existingBookingForm.selectedBooking.field}</p>}
                      </div>
                    </div>
                  )}

                  {/* Search Results */}
                  {!existingBookingForm.selectedBooking && existingBookingForm.searchQuery && existingBookingForm.bookings.length > 0 && (
                    <div className="mt-2 border border-gray-200 rounded-lg max-h-64 overflow-y-auto">
                      {existingBookingForm.bookings.map((booking) => (
                        <button
                          key={booking.id}
                          type="button"
                          onClick={() => {
                            setExistingBookingForm(prev => ({
                              ...prev,
                              selectedBooking: booking,
                              searchQuery: '',
                            }));
                          }}
                          className="w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0"
                        >
                          <p className="font-medium text-gray-900">{booking.email}</p>
                          <div className="text-sm text-gray-600 mt-1 space-y-0.5">
                            <p>Package: {booking.package}</p>
                            <p>Universities: {booking.universities}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {!existingBookingForm.selectedBooking && existingBookingForm.searchQuery && !isSearching && existingBookingForm.bookings.length === 0 && (
                    <p className="mt-2 text-sm text-gray-500">No bookings found</p>
                  )}
                </div>

                {/* University Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <GraduationCap className="w-4 h-4 inline mr-1" />
                    University *
                  </label>
                  <select
                    value={existingBookingForm.selectedUniversity?.id || ''}
                    onChange={(e) => {
                      const uni = universities.find(u => u.id === e.target.value);
                      setExistingBookingForm(prev => ({ ...prev, selectedUniversity: uni || null }));
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a university</option>
                    {universities.map((uni) => (
                      <option key={uni.id} value={uni.id}>
                        {uni.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={existingBookingForm.notes}
                    onChange={(e) => setExistingBookingForm(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Add any additional notes..."
                  />
                </div>
              </>
            ) : (
              <>
                {/* New Booking Flow */}
                {/* Student Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Student Information
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={newBookingForm.fullName}
                      onChange={(e) => setNewBookingForm(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder="John Doe"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email *
                    </label>
                    <input
                      type="email"
                      value={newBookingForm.email}
                      onChange={(e) => setNewBookingForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="student@example.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-1" />
                      Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      value={newBookingForm.phone}
                      onChange={(e) => setNewBookingForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+44 7XXX XXXXXX"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Booking Details */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Booking Details
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Package Type *
                    </label>
                    <select
                      value={newBookingForm.packageType}
                      onChange={(e) => {
                        const value = e.target.value;
                        const count = value.includes('essentials') ? 1 : value.includes('core') ? 3 : 4;
                        setNewBookingForm(prev => ({
                          ...prev,
                          packageType: value,
                          interviewCount: count,
                        }));
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="essentials_live">Essentials - Live (1 interview)</option>
                      <option value="core_live">Core - Live (3 interviews)</option>
                      <option value="premium_live">Premium - Live (4 interviews)</option>
                      <option value="essentials_generated">Essentials - Generated Questions</option>
                      <option value="core_generated">Core - Generated Questions</option>
                      <option value="premium_generated">Premium - Generated Questions</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Field *
                    </label>
                    <select
                      value={newBookingForm.field}
                      onChange={(e) => setNewBookingForm(prev => ({ ...prev, field: e.target.value as 'medicine' | 'dentistry' }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="medicine">Medicine</option>
                      <option value="dentistry">Dentistry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Interviews *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={newBookingForm.interviewCount}
                      onChange={(e) => {
                        const newCount = parseInt(e.target.value) || 1;
                        setNewBookingForm(prev => ({
                          ...prev,
                          interviewCount: newCount,
                          selectedUniversities: newCount < prev.selectedUniversities.length
                            ? prev.selectedUniversities.slice(0, newCount)
                            : prev.selectedUniversities,
                        }));
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      One interview will be created per university (up to this limit)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Paid Amount (£)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newBookingForm.paidAmount}
                      onChange={(e) => setNewBookingForm(prev => ({ ...prev, paidAmount: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Amount paid by the student. Set to 0 for unpaid/pending bookings.
                    </p>
                  </div>
                </div>

                {/* University Selection */}
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5" />
                      Universities *
                    </h3>
                    <span className="text-sm text-gray-600">
                      {newBookingForm.selectedUniversities.length} / {newBookingForm.interviewCount} selected
                    </span>
                  </div>
                  
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={newBookingForm.universitySearchQuery}
                      onChange={(e) => setNewBookingForm(prev => ({ ...prev, universitySearchQuery: e.target.value }))}
                      placeholder="Search universities..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    />
                  </div>
                  
                  <div className="max-h-64 overflow-y-auto border border-gray-300 rounded-lg p-4">
                    {universities.length === 0 ? (
                      <p className="text-sm text-gray-500">Loading universities...</p>
                    ) : (
                      <div className="space-y-2">
                        {universities
                          .filter((uni) =>
                            uni.name.toLowerCase().includes(newBookingForm.universitySearchQuery.toLowerCase())
                          )
                          .map((uni) => {
                            const isSelected = newBookingForm.selectedUniversities.some(u => u.id === uni.id);
                            const isDisabled = !isSelected && newBookingForm.selectedUniversities.length >= newBookingForm.interviewCount;
                            
                            return (
                              <label
                                key={uni.id}
                                className={`flex items-center gap-2 p-2 rounded ${
                                  isDisabled
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'hover:bg-gray-50 cursor-pointer'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleUniversityToggle(uni)}
                                  disabled={isDisabled}
                                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 disabled:opacity-50"
                                />
                                <span className="text-sm text-gray-700">{uni.name}</span>
                              </label>
                            );
                          })}
                      </div>
                    )}
                  </div>
                  
                  {newBookingForm.selectedUniversities.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {newBookingForm.selectedUniversities.map((uni) => (
                        <span
                          key={uni.id}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                        >
                          {uni.name}
                          <button
                            type="button"
                            onClick={() => handleUniversityToggle(uni)}
                            className="hover:text-green-900"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4 inline mr-1" />
                    Notes (Optional)
                  </label>
                  <textarea
                    value={newBookingForm.notes}
                    onChange={(e) => setNewBookingForm(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Add any additional notes..."
                  />
                </div>
              </>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="border-t bg-gray-50 px-6 py-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !isFormValid}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {mode === 'new' ? 'Creating Booking...' : 'Creating...'}
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                {mode === 'new' ? 'Create Full Booking' : 'Create Interview'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
