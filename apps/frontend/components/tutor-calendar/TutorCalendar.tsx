'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Check, X } from 'lucide-react';
import { useTutorCalendar } from '../../contexts/TutorCalendarContext';

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  type: 'available' | 'interview' | 'blocked';
  title?: string;
  bookingId?: string;
  student?: string;
  package?: string;
}

interface TutorSchedule {
  tutorId: string;
  tutorName: string;
  tutorEmail: string;
  avatar?: string;
  color: string;
  schedule: Record<string, TimeSlot[]>; // date -> slots
}

interface TutorCalendarProps {
  onSlotClick: (slot: TimeSlot, tutor: TutorSchedule) => void;
}

const TutorCalendar: React.FC<TutorCalendarProps> = ({
  onSlotClick
}) => {
  // Use context for state management
  const {
    tutors,
    selectedDate,
    setSelectedDate,
    assignInterview,
    markSlotsAvailable,
    openAvailabilityModal
  } = useTutorCalendar();
  const [draggedBooking, setDraggedBooking] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dragOverSlot, setDragOverSlot] = useState<string | null>(null);
  
  // Multi-selection state
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());
  const [selectionStartTutor, setSelectionStartTutor] = useState<string | null>(null);

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
  ];

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDateHeader = (date: Date) => {
    return date.toLocaleDateString('en-GB', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  const handleDragStart = (e: React.DragEvent, bookingId: string) => {
    setDraggedBooking(bookingId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, slotKey: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverSlot(slotKey);
  };

  const handleDragLeave = () => {
    setDragOverSlot(null);
  };

  const handleDropOnSlot = (e: React.DragEvent, tutorId: string, date: string, time: string) => {
    e.preventDefault();
    setDragOverSlot(null);
    
    // Try to get interview ID from dataTransfer (from UnassignedInterviews)
    const interviewId = e.dataTransfer.getData('interviewId');
    
    if (interviewId) {
      assignInterview(tutorId, date, time, interviewId);
    } else if (draggedBooking) {
      // Handle internal drag from within calendar
      assignInterview(tutorId, date, time, draggedBooking);
      setDraggedBooking(null);
    }
  };

  const getSlotForTime = (tutor: TutorSchedule, date: string, time: string): TimeSlot | undefined => {
    const daySlots = tutor.schedule[date] || [];
    return daySlots.find(slot => slot.startTime === time);
  };

  // Multi-selection handlers
  const handleMouseDown = (e: React.MouseEvent, tutorId: string, time: string, slot: TimeSlot | undefined) => {
    // Only start selection on empty slots or blocked slots
    if (!slot || slot.type === 'blocked' || slot.type === 'available') {
      e.preventDefault();
      setIsSelecting(true);
      setSelectionStartTutor(tutorId);
      const slotKey = `${tutorId}-${time}`;
      setSelectedSlots(new Set([slotKey]));
    }
  };

  const handleMouseEnter = (tutorId: string, time: string, slot: TimeSlot | undefined) => {
    if (isSelecting && tutorId === selectionStartTutor) {
      // Only select empty, blocked, or available slots
      if (!slot || slot.type === 'blocked' || slot.type === 'available') {
        const slotKey = `${tutorId}-${time}`;
        setSelectedSlots(prev => new Set([...prev, slotKey]));
      }
    }
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
  };

  const handleMarkAsAvailable = () => {
    if (selectedSlots.size === 0) return;

    const dateStr = formatDate(selectedDate);
    const slotsToMark = Array.from(selectedSlots).map(slotKey => {
      const lastDash = slotKey.lastIndexOf("-");
      const tutorId = slotKey.slice(0, lastDash);
      const time = slotKey.slice(lastDash + 1);
      return { tutorId, date: dateStr, time };
    });

    markSlotsAvailable(slotsToMark);
    
    // Clear selection
    setSelectedSlots(new Set());
    setSelectionStartTutor(null);
  };

  const handleClearSelection = () => {
    setSelectedSlots(new Set());
    setSelectionStartTutor(null);
  };

  // Add global mouse up listener
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isSelecting) {
        setIsSelecting(false);
      }
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [isSelecting]);

  const getSlotColor = (type: TimeSlot['type']) => {
    switch (type) {
      case 'available':
        return 'bg-green-100 border-green-300 hover:bg-green-200';
      case 'interview':
        return 'bg-blue-100 border-blue-300 hover:bg-blue-200';
      case 'blocked':
        return 'bg-gray-100 border-gray-300';
      default:
        return 'bg-white border-gray-200';
    }
  };

  const dateStr = formatDate(selectedDate);

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow">
      {/* Calendar Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {formatDateHeader(selectedDate)}
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePreviousDay}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Previous day"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={handleToday}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Today
              </button>
              <button
                onClick={handleNextDay}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Next day"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors ml-2"
                title="Select date"
              >
                <CalendarIcon className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
          
          {/* Legend and Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => openAvailabilityModal()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              <Clock className="w-4 h-4" />
              Manage Availability
            </button>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                <span className="text-gray-600">Available</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
                <span className="text-gray-600">Interview</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded"></div>
                <span className="text-gray-600">Blocked</span>
              </div>
            </div>
          </div>
        </div>

        {/* Date Picker Dropdown */}
        {showDatePicker && (
          <div className="absolute mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-20">
            <input
              type="date"
              value={formatDate(selectedDate)}
              onChange={(e) => {
                const newDate = new Date(e.target.value);
                setSelectedDate(newDate);
                setShowDatePicker(false);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}
      </div>

      {/* Selection Toolbar */}
      {selectedSlots.size > 0 && (
        <div className="bg-blue-600 text-white px-6 py-3 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <span className="font-medium">
              {selectedSlots.size} slot{selectedSlots.size > 1 ? 's' : ''} selected
            </span>
            <div className="h-4 w-px bg-blue-400"></div>
            <span className="text-sm text-blue-100">
              Drag to select multiple slots • Click to deselect
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAsAvailable}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium text-sm"
            >
              <Check className="w-4 h-4" />
              Mark as Available
            </button>
            <button
              onClick={handleClearSelection}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm"
            >
              <X className="w-4 h-4" />
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto" onMouseLeave={() => isSelecting && setIsSelecting(false)}>
        <div className="min-w-full">
          {/* Time Header */}
          <div className="sticky top-0 bg-gray-50 border-b-2 border-gray-300 z-10">
            <div className="flex">
              <div className="w-48 p-3 border-r border-gray-300 font-medium text-sm text-gray-700">
                Tutor
              </div>
              {timeSlots.map((time) => (
                <div
                  key={time}
                  className="flex-1 min-w-[100px] p-3 text-center border-r border-gray-200 font-medium text-sm text-gray-700"
                >
                  {time}
                </div>
              ))}
            </div>
          </div>

          {/* Tutor Rows */}
          {tutors.map((tutor) => {
            const daySlots = tutor.schedule[dateStr] || [];
            
            return (
              <div key={tutor.tutorId} className="flex border-b border-gray-200 hover:bg-gray-50 transition-colors">
                {/* Tutor Info Column */}
                <div className="w-48 p-4 border-r border-gray-300 bg-white">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
                      style={{ backgroundColor: tutor.color }}
                    >
                      {tutor.tutorName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-gray-900 truncate">{tutor.tutorName}</div>
                      <div className="text-xs text-gray-500 truncate">{tutor.tutorEmail}</div>
                    </div>
                  </div>
                </div>

                {/* Time Slot Columns */}
                {timeSlots.map((time) => {
                  const slot = daySlots.find(s => s.startTime === time);
                  const slotKey = `${tutor.tutorId}-${time}`;
                  const isDragOver = dragOverSlot === slotKey;
                  const isSelected = selectedSlots.has(slotKey);
                  const isSelectable = !slot || slot.type === 'blocked' || slot.type === 'available';

                  return (
                    <div
                      key={slotKey}
                      className={`flex-1 min-w-[100px] p-2 border-r border-gray-200 transition-all ${
                        isSelectable ? 'cursor-pointer' : 'cursor-default'
                      } ${
                        slot ? getSlotColor(slot.type) : 'bg-white hover:bg-gray-100'
                      } ${
                        isDragOver ? 'ring-2 ring-blue-500 ring-inset bg-blue-50' : ''
                      } ${
                        isSelected ? 'ring-4 ring-purple-500 ring-inset bg-purple-100' : ''
                      }`}
                      onClick={(e) => {
                        if (isSelected) {
                          // Deselect if already selected
                          setSelectedSlots(prev => {
                            const newSet = new Set(prev);
                            newSet.delete(slotKey);
                            return newSet;
                          });
                        } else if (slot && slot.type === 'interview') {
                          onSlotClick(slot, tutor);
                        }
                      }}
                      onMouseDown={(e) => handleMouseDown(e, tutor.tutorId, time, slot)}
                      onMouseEnter={() => handleMouseEnter(tutor.tutorId, time, slot)}
                      onDragOver={(e) => !isSelecting && handleDragOver(e, slotKey)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => !isSelecting && handleDropOnSlot(e, tutor.tutorId, dateStr, time)}
                    >
                      {slot ? (
                        <div 
                          className={`h-full p-2 rounded text-xs ${
                            slot.type === 'interview' ? 'border border-blue-400 bg-blue-50' : ''
                          }`}
                          draggable={slot.type === 'interview'}
                          onDragStart={(e) => slot.bookingId && handleDragStart(e, slot.bookingId)}
                        >
                          <div className="font-semibold truncate text-gray-900">{slot.title}</div>
                          {slot.student && (
                            <div className="text-gray-700 truncate mt-1">{slot.student}</div>
                          )}
                          {slot.package && (
                            <div className="text-gray-600 truncate mt-0.5 text-[10px]">{slot.package}</div>
                          )}
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          {isSelected ? (
                            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          ) : (
                            <div className="w-2 h-2 bg-gray-200 rounded-full opacity-0 group-hover:opacity-50"></div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TutorCalendar;
