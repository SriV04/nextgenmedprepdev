'use client';

import React, { useState, useEffect } from 'react';
import { X, Search, User, GraduationCap, Package, Plus } from 'lucide-react';

interface Booking {
  id: string;
  email: string;
  package: string;
  universities: string;
  field?: string;
}

interface University {
  id: string;
  name: string;
}

interface CreateInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateInterview: (data: {
    booking_id: string;
    university_id: string;
    scheduled_at: string;
    notes?: string;
  }) => Promise<void>;
}

export const CreateInterviewModal: React.FC<CreateInterviewModalProps> = ({
  isOpen,
  onClose,
  onCreateInterview
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';

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
      setBookings([]);
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
        setBookings(filtered.slice(0, 10)); // Limit to 10 results
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
      searchBookings(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedBooking || !selectedUniversity) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      // Use current timestamp as scheduled_at (will be updated when assigned to tutor)
      const scheduled_at = new Date().toISOString();
      
      await onCreateInterview({
        booking_id: selectedBooking.id,
        university_id: selectedUniversity.id,
        scheduled_at,
        notes: notes.trim() || undefined,
      });

      // Reset form
      setSelectedBooking(null);
      setSelectedUniversity(null);
      setNotes('');
      setSearchQuery('');
      onClose();
    } catch (error) {
      console.error('Error creating interview:', error);
      alert('Failed to create interview');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedBooking(null);
    setSelectedUniversity(null);
    setNotes('');
    setSearchQuery('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
          <div className="flex items-center justify-between">
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
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by student email..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={!!selectedBooking}
                />
              </div>

              {/* Selected Booking */}
              {selectedBooking && (
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-900">{selectedBooking.email}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBooking(null);
                        setSearchQuery('');
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><Package className="w-3 h-3 inline mr-1" />{selectedBooking.package}</p>
                    <p><GraduationCap className="w-3 h-3 inline mr-1" />{selectedBooking.universities}</p>
                    {selectedBooking.field && <p>Field: {selectedBooking.field}</p>}
                  </div>
                </div>
              )}

              {/* Search Results */}
              {!selectedBooking && searchQuery && bookings.length > 0 && (
                <div className="mt-2 border border-gray-200 rounded-lg max-h-64 overflow-y-auto">
                  {bookings.map((booking) => (
                    <button
                      key={booking.id}
                      type="button"
                      onClick={() => {
                        setSelectedBooking(booking);
                        setSearchQuery('');
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

              {!selectedBooking && searchQuery && !isSearching && bookings.length === 0 && (
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
                value={selectedUniversity?.id || ''}
                onChange={(e) => {
                  const uni = universities.find(u => u.id === e.target.value);
                  setSelectedUniversity(uni || null);
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
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Add any additional notes..."
              />
            </div>
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
            disabled={isLoading || !selectedBooking || !selectedUniversity}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Create Interview
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
