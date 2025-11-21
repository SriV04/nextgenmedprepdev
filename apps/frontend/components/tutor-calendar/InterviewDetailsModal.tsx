'use client';

import React from 'react';
import { X, User, Mail, GraduationCap, Calendar, Clock, Phone, FileText, MapPin } from 'lucide-react';
import { useTutorCalendar } from '../../contexts/TutorCalendarContext';

const InterviewDetailsModal: React.FC = () => {
  const { isInterviewDetailsModalOpen, selectedInterviewDetails, closeInterviewDetailsModal } = useTutorCalendar();

  if (!isInterviewDetailsModalOpen || !selectedInterviewDetails) return null;

  const { studentAvailability } = selectedInterviewDetails;

  // Group availability by date
  const availabilityByDate = studentAvailability.reduce((acc, slot) => {
    if (!acc[slot.date]) {
      acc[slot.date] = [];
    }
    acc[slot.date].push(slot);
    return acc;
  }, {} as Record<string, typeof studentAvailability>);

  // Sort dates
  const sortedDates = Object.keys(availabilityByDate).sort();

  // Get day name from day of week number
  const getDayName = (dayOfWeek: number): string => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayOfWeek];
  };

  // Format time
  const formatTime = (hour: number): string => {
    return `${String(hour).padStart(2, '0')}:00`;
  };

  // Format date
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">Interview Details</h2>
              <p className="text-blue-100 text-sm">Complete student information and availability</p>
            </div>
            <button
              onClick={closeInterviewDetailsModal}
              className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Student Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Student Information</h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium text-gray-900">{selectedInterviewDetails.studentName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{selectedInterviewDetails.studentEmail}</p>
                  </div>
                </div>

                {selectedInterviewDetails.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium text-gray-900">{selectedInterviewDetails.phone}</p>
                    </div>
                  </div>
                )}

                {selectedInterviewDetails.field && (
                  <div className="flex items-start gap-3">
                    <GraduationCap className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Field</p>
                      <p className="font-medium text-gray-900 capitalize">{selectedInterviewDetails.field}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Booking Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Booking Details</h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <GraduationCap className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Package</p>
                    <p className="font-medium text-gray-900">{selectedInterviewDetails.package}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Universities</p>
                    <p className="font-medium text-gray-900">{selectedInterviewDetails.universities}</p>
                  </div>
                </div>

                {selectedInterviewDetails.preferredTime && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Preferred Time</p>
                      <p className="font-medium text-gray-900">{selectedInterviewDetails.preferredTime}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="font-medium text-gray-900">
                      {new Date(selectedInterviewDetails.createdAt).toLocaleDateString('en-GB', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                {selectedInterviewDetails.notes && (
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Notes</p>
                      <p className="font-medium text-gray-900">{selectedInterviewDetails.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Student Availability */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">
              Student Availability
            </h3>
            
            {studentAvailability.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No availability slots provided</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedDates.map(date => {
                  const slots = availabilityByDate[date];
                  const dayOfWeek = slots[0]?.dayOfWeek;
                  
                  return (
                    <div key={date} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                      <div className="flex items-center gap-3 mb-3">
                        <Calendar className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="font-semibold text-gray-900">{formatDate(date)}</p>
                          <p className="text-sm text-gray-600">{getDayName(dayOfWeek)}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {slots
                          .sort((a, b) => a.hourStart - b.hourStart)
                          .map(slot => (
                            <div
                              key={slot.id}
                              className="flex items-center gap-2 bg-white px-3 py-2 rounded-md border border-green-300 shadow-sm"
                            >
                              <Clock className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium text-gray-900">
                                {formatTime(slot.hourStart)} - {formatTime(slot.hourEnd)}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 px-6 py-4">
          <div className="flex justify-end gap-3">
            <button
              onClick={closeInterviewDetailsModal}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewDetailsModal;
