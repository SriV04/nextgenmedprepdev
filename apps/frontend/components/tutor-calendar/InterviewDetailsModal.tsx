'use client';

import React, { useState, useMemo } from 'react';
import { X, User, Mail, GraduationCap, Calendar, Clock, Phone, FileText, MapPin, CheckCircle, AlertTriangle, Trash2, XCircle, Video } from 'lucide-react';
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
    assignInterview,
    cancelInterview,
    deleteInterview,
    userRole
  } = useTutorCalendar();
  
  // Only Admins and Managers can assign tutors to pending interviews
  const canAssignTutors = userRole === 'admin' || userRole === 'manager';
  
  const [selectedSlot, setSelectedSlot] = useState<AvailabilityMatch | null>(null);
  const [selectedTutor, setSelectedTutor] = useState<TutorMatch | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  
  // Custom booking state
  const [showCustomBooking, setShowCustomBooking] = useState(false);
  const [customDate, setCustomDate] = useState('');
  const [customTime, setCustomTime] = useState('09:00');
  const [customTutorId, setCustomTutorId] = useState('');

  // Cancellation state
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellationNotes, setCancellationNotes] = useState('');

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
    if (!canAssignTutors) return;
    setSelectedTutor(tutor);
    setShowConfirmation(true);
  };

  // Handle booking confirmation
  const handleConfirmBooking = async () => {
    if (!selectedSlot || !selectedTutor || !canAssignTutors) return;
    
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

  // Handle cancel (unassign)
  const handleCancelInterview = async () => {
    try {
      await cancelInterview(selectedInterviewDetails.id, cancellationNotes);
      setShowCancelModal(false);
      setCancellationNotes('');
      closeInterviewDetailsModal();
    } catch (error) {
      console.error('Error cancelling interview:', error);
    }
  };

  // Handle delete
  const handleDeleteInterview = async () => {
    if (!confirm('Are you sure you want to delete this interview? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteInterview(selectedInterviewDetails.id);
      closeInterviewDetailsModal();
    } catch (error) {
      console.error('Error deleting interview:', error);
    }
  };

  // Handle custom booking
  const handleCustomBooking = async () => {
    if (!canAssignTutors) return;
    if (!customDate || !customTime || !customTutorId) {
      alert('Please fill in all custom booking fields');
      return;
    }

    setIsBooking(true);
    try {
      await assignInterview(
        customTutorId,
        customDate,
        customTime,
        selectedInterviewDetails.id
      );
      
      // Reset custom booking state
      setShowCustomBooking(false);
      setCustomDate('');
      setCustomTime('09:00');
      setCustomTutorId('');
      closeInterviewDetailsModal();
    } catch (error) {
      console.error('Error with custom booking:', error);
    } finally {
      setIsBooking(false);
    }
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
          {/* Show assigned interview details if already scheduled */}
          {selectedInterviewDetails.tutorId && selectedInterviewDetails.scheduledAt && (
            <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-bold text-green-900">Interview Scheduled</h3>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Tutor</p>
                    <p className="font-semibold text-gray-900">{selectedInterviewDetails.tutorName}</p>
                    <p className="text-xs text-gray-600">{selectedInterviewDetails.tutorEmail}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Scheduled Date & Time</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(selectedInterviewDetails.scheduledAt).toLocaleDateString('en-GB', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                    <p className="text-sm text-gray-700">
                      {new Date(selectedInterviewDetails.scheduledAt).toLocaleTimeString('en-GB', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
              
              {selectedInterviewDetails.zoomJoinUrl && (
                <div className="mt-3 pt-3 border-t border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Video className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">Zoom Meeting</span>
                  </div>
                  <a
                    href={selectedInterviewDetails.zoomJoinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 underline break-all"
                  >
                    {selectedInterviewDetails.zoomJoinUrl}
                  </a>
                  {selectedInterviewDetails.zoomHostEmail && (
                    <div className="mt-2 text-xs text-gray-600">
                      <span className="font-medium">Host Account:</span> {selectedInterviewDetails.zoomHostEmail}
                    </div>
                  )}
                </div>
              )}
              
              <div className="mt-4 pt-3 border-t border-green-200 flex gap-2">
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="flex items-center gap-2 px-4 py-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
                >
                  <XCircle className="w-4 h-4" />
                  Cancel & Unassign Interview
                </button>
                <span className="text-xs text-gray-600 flex items-center">
                  This will remove the assignment and allow rescheduling
                </span>
              </div>
            </div>
          )}

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

          {/* Student Availability & Booking - Only show if not already assigned */}
          {!selectedInterviewDetails.tutorId && (
            <>
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

          {/* Custom Booking Section */}
          <div className="mt-6">
            <button
              onClick={() => setShowCustomBooking(!showCustomBooking)}
              className="w-full flex items-center justify-between px-4 py-3 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-purple-900">Custom Booking</span>
              </div>
              <span className="text-purple-600 text-sm">
                {showCustomBooking ? 'Hide' : 'Show'}
              </span>
            </button>

            {showCustomBooking && (
              <div className="mt-3 p-4 bg-purple-50 border border-purple-200 rounded-lg space-y-4">
                <p className="text-sm text-purple-800 mb-3">
                  Manually book an interview with a custom date, time, and tutor selection.
                </p>

                {/* Custom Date and Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Date *
                    </label>
                    <input
                      type="date"
                      value={customDate}
                      onChange={(e) => setCustomDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Time (HH:MM) *
                    </label>
                    <input
                      type="time"
                      value={customTime}
                      onChange={(e) => setCustomTime(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Custom Tutor Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <User className="w-4 h-4 inline mr-1" />
                    Select Tutor *
                  </label>
                  <select
                    value={customTutorId}
                    onChange={(e) => setCustomTutorId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Choose a tutor</option>
                    {tutors.map(tutor => (
                      <option key={tutor.tutorId} value={tutor.tutorId}>
                        {tutor.tutorName} ({tutor.tutorEmail})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Custom Book Button */}
                <button
                  onClick={handleCustomBooking}
                  disabled={isBooking || !customDate || !customTime || !customTutorId}
                  className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {isBooking ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Booking...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Book Custom Interview
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
            </>
          )}

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
            <div className="flex items-center gap-3">
              <button
                onClick={handleDeleteInterview}
                disabled={isBooking}
                className="flex items-center gap-2 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete Interview
              </button>
              <div className="text-sm text-gray-600">
                {availabilityMatches.length > 0 && (
                  <span>
                    {availabilityMatches.length} available slot{availabilityMatches.length !== 1 ? 's' : ''} found
                  </span>
                )}
              </div>
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

      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50 rounded-xl">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
            <div className="bg-orange-600 text-white p-4 rounded-t-lg">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <XCircle className="w-6 h-6" />
                Cancel Interview
              </h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-sm text-orange-800 mb-2">
                  <strong>Warning:</strong> This will:
                </p>
                <ul className="text-sm text-orange-700 space-y-1 ml-4 list-disc">
                  <li>Unassign the tutor from this interview</li>
                  <li>Remove the Zoom meeting</li>
                  <li>Send cancellation emails to the student and tutor</li>
                  <li>Return the interview to unassigned status</li>
                </ul>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4 inline mr-1" />
                  Cancellation Notes (Optional)
                </label>
                <textarea
                  value={cancellationNotes}
                  onChange={(e) => setCancellationNotes(e.target.value)}
                  placeholder="Provide a reason for cancellation (will be included in the email to the student)..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  These notes will be included in the cancellation email sent to the student.
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-6 pt-0">
              <button
                onClick={handleCancelInterview}
                disabled={isBooking}
                className="flex-1 bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isBooking ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5" />
                    Confirm Cancellation
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancellationNotes('');
                }}
                disabled={isBooking}
                className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewDetailsModal;
