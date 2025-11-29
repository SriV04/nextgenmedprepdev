'use client';

import React, { useState, useMemo } from 'react';
import { X, User, Mail, GraduationCap, Calendar, Clock, Phone, FileText, MapPin, CheckCircle, AlertTriangle } from 'lucide-react';
import { useTutorCalendar } from '../../contexts/TutorCalendarContext';

interface TutorMatch {
  tutorId: string;
  tutorName: string;
  tutorEmail: string;
  color: string;
}

interface AvailabilityMatch {
  date: string;
  time: string;
  hourStart: number;
  hourEnd: number;
  dayOfWeek: number;
  availabilitySlotId: string;
  tutors: TutorMatch[];
}

const InterviewDetailsModal: React.FC = () => {
  const { 
    isInterviewDetailsModalOpen, 
    selectedInterviewDetails, 
    closeInterviewDetailsModal,
    tutors,
    assignInterview
  } = useTutorCalendar();
  
  const [selectedSlot, setSelectedSlot] = useState<AvailabilityMatch | null>(null);
  const [selectedTutor, setSelectedTutor] = useState<TutorMatch | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  // Find matching tutors for each student availability slot
  const availabilityMatches = useMemo<AvailabilityMatch[]>(() => {
    if (!selectedInterviewDetails?.studentAvailability || selectedInterviewDetails.studentAvailability.length === 0) {
      return [];
    }
    
    const { studentAvailability } = selectedInterviewDetails;
    const matches: AvailabilityMatch[] = [];
    
    studentAvailability.forEach(studentSlot => {
      const matchingTutors: TutorMatch[] = [];
      
      tutors.forEach(tutor => {
        const daySlots = tutor.schedule[studentSlot.date] || [];
        const hasMatchingSlot = daySlots.some(tutorSlot => {
          if (tutorSlot.type !== 'available') return false;
          
          const tutorHour = parseInt(tutorSlot.startTime.split(':')[0], 10);
          return tutorHour >= studentSlot.hourStart && tutorHour < studentSlot.hourEnd;
        });
        
        if (hasMatchingSlot) {
          matchingTutors.push({
            tutorId: tutor.tutorId,
            tutorName: tutor.tutorName,
            tutorEmail: tutor.tutorEmail,
            color: tutor.color,
          });
        }
      });
      
      // Create a match for each hour in the student's availability, even if no tutors match
      for (let hour = studentSlot.hourStart; hour < studentSlot.hourEnd; hour++) {
        matches.push({
          date: studentSlot.date,
          time: `${String(hour).padStart(2, '0')}:00`,
          hourStart: hour,
          hourEnd: hour + 1,
          dayOfWeek: studentSlot.dayOfWeek,
          availabilitySlotId: studentSlot.id,
          tutors: matchingTutors,
        });
      }
    });
    
    return matches.sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.hourStart - b.hourStart;
    });
  }, [selectedInterviewDetails?.studentAvailability, tutors]);

  // Group availability matches by date
  const availabilityByDate = useMemo(() => {
    return availabilityMatches.reduce((acc, match) => {
      if (!acc[match.date]) {
        acc[match.date] = [];
      }
      acc[match.date].push(match);
      return acc;
    }, {} as Record<string, AvailabilityMatch[]>);
  }, [availabilityMatches]);

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

  // Handle slot click
  const handleSlotClick = (match: AvailabilityMatch) => {
    setSelectedSlot(match);
    setSelectedTutor(null);
    setShowConfirmation(false);
  };

  // Handle tutor selection
  const handleTutorSelect = (tutor: TutorMatch) => {
    setSelectedTutor(tutor);
    setShowConfirmation(true);
  };

  // Handle booking confirmation
  const handleConfirmBooking = async () => {
    if (!selectedSlot || !selectedTutor) return;
    
    setIsBooking(true);
    try {
      // Stage the assignment (no backend call yet)
      await assignInterview(
        selectedTutor.tutorId,
        selectedSlot.date,
        selectedSlot.time,
        selectedInterviewDetails.id
      );
      
      // Reset state and close modal
      setSelectedSlot(null);
      setSelectedTutor(null);
      setShowConfirmation(false);
      closeInterviewDetailsModal();
    } catch (error) {
      console.error('Error staging interview:', error);
    } finally {
      setIsBooking(false);
    }
  };

  // Handle cancel
  const handleCancelSelection = () => {
    setSelectedSlot(null);
    setSelectedTutor(null);
    setShowConfirmation(false);
  };

  // Early return AFTER all hooks
  if (!isInterviewDetailsModalOpen || !selectedInterviewDetails) return null;

  const { studentAvailability } = selectedInterviewDetails;

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

          {/* Student Availability & Booking */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">
              Book Interview
            </h3>
            
            {availabilityMatches.length === 0 ? (
              <div className="text-center py-8 bg-yellow-50 rounded-lg border border-yellow-200">
                <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                <p className="text-yellow-800 font-medium">No availability provided</p>
                <p className="text-yellow-600 text-sm mt-1">
                  Student hasn't provided availability slots yet
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Click on a time slot</strong> to see available tutors and book the interview.
                  </p>
                </div>

                {sortedDates.map(date => {
                  const matches = availabilityByDate[date];
                  const dayOfWeek = matches[0]?.dayOfWeek;
                  
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
                        {matches.map((match, idx) => {
                          const isSelected = selectedSlot?.date === match.date && 
                                           selectedSlot?.time === match.time;
                          const hasTutors = match.tutors.length > 0;
                          
                          return (
                            <button
                              key={`${match.date}-${match.time}-${idx}`}
                              onClick={() => handleSlotClick(match)}
                              disabled={!hasTutors}
                              className={`flex items-center gap-2 px-3 py-2 rounded-md border shadow-sm transition-all ${
                                isSelected
                                  ? 'bg-blue-600 border-blue-700 text-white ring-2 ring-blue-300'
                                  : hasTutors
                                  ? 'bg-white border-green-300 hover:border-green-400 hover:bg-green-50'
                                  : 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-60'
                              }`}
                            >
                              <Clock className={`w-4 h-4 ${isSelected ? 'text-white' : hasTutors ? 'text-green-600' : 'text-gray-400'}`} />
                              <span className={`text-sm font-medium ${isSelected ? 'text-white' : hasTutors ? 'text-gray-900' : 'text-gray-500'}`}>
                                {formatTime(match.hourStart)} - {formatTime(match.hourEnd)}
                              </span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                isSelected 
                                  ? 'bg-blue-500 text-white' 
                                  : hasTutors
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-200 text-gray-500'
                              }`}>
                                {hasTutors ? `${match.tutors.length} tutor${match.tutors.length > 1 ? 's' : ''}` : 'No tutors'}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Tutor Selection */}
          {selectedSlot && !showConfirmation && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Select a Tutor for {formatDate(selectedSlot.date)} at {selectedSlot.time}
              </h4>
              
              {selectedSlot.tutors.length === 0 ? (
                <div className="text-center py-6 bg-white rounded-lg border border-gray-200">
                  <AlertTriangle className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">No tutors available at this time</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedSlot.tutors.map(tutor => (
                    <button
                      key={tutor.tutorId}
                      onClick={() => handleTutorSelect(tutor)}
                      className="flex items-center gap-3 p-3 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:shadow-md transition-all text-left"
                    >
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: tutor.color }}
                      >
                        {tutor.tutorName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{tutor.tutorName}</p>
                        <p className="text-xs text-gray-600">{tutor.tutorEmail}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              
              <button
                onClick={handleCancelSelection}
                className="mt-3 w-full py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Confirmation */}
          {showConfirmation && selectedSlot && selectedTutor && (
            <div className="mt-6 bg-green-50 border-2 border-green-300 rounded-lg p-4">
              <div className="flex items-start gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-1">Confirm Booking</h4>
                  <p className="text-sm text-gray-700">
                    Please review the booking details before confirming.
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 mb-4 border border-green-200">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500">Student</p>
                    <p className="font-medium text-gray-900">{selectedInterviewDetails.studentName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{selectedInterviewDetails.studentEmail}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Date</p>
                    <p className="font-medium text-gray-900">{formatDate(selectedSlot.date)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Time</p>
                    <p className="font-medium text-gray-900">
                      {formatTime(selectedSlot.hourStart)} - {formatTime(selectedSlot.hourEnd)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Tutor</p>
                    <p className="font-medium text-gray-900">{selectedTutor.tutorName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Package</p>
                    <p className="font-medium text-gray-900">{selectedInterviewDetails.package}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleConfirmBooking}
                  disabled={isBooking}
                  className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {isBooking ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Booking...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Confirm Booking
                    </>
                  )}
                </button>
                <button
                  onClick={handleCancelSelection}
                  disabled={isBooking}
                  className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {availabilityMatches.length > 0 && (
                <span>
                  {availabilityMatches.length} available slot{availabilityMatches.length !== 1 ? 's' : ''} found
                </span>
              )}
            </div>
            <button
              onClick={closeInterviewDetailsModal}
              disabled={isBooking}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
