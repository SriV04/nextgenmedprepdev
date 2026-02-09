'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar, Clock, Plus, Trash2, Check, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTutorCalendar } from '../../contexts/TutorCalendarContext';
import type { DateAvailabilitySlot } from '../../types/tutor-calendar';
import { CalendarPicker } from './CalendarPicker';
import { motion, AnimatePresence } from 'framer-motion';

interface AvailabilityModalProps {
  mode?: 'default' | 'home';
}

const AvailabilityModal: React.FC<AvailabilityModalProps> = ({ mode = 'default' }) => {
  const {
    isAvailabilityModalOpen,
    currentUserId,
    tutors,
    closeAvailabilityModal,
    markSlotsAvailable,
    removeAvailability,
    refreshData,
    userRole
  } = useTutorCalendar();

  const isAdminOrManager = userRole === 'admin' || userRole === 'manager';
  const isHomeMode = mode === 'home';
  
  // State for selected tutor (for admins/managers in default mode)
  const [selectedTutorId, setSelectedTutorId] = useState<string | null>(null);
  
  // Get the tutor to manage (always current user in home mode, selected tutor for admins/managers in default mode)
  const managingTutorId = isHomeMode ? currentUserId : (isAdminOrManager ? selectedTutorId : currentUserId);
  const managingTutor = tutors.find(t => t.tutorId === managingTutorId);
  const tutorName = managingTutor?.tutorName || 'Your';

  // Week view state for home mode
  const [weekOffset, setWeekOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState<'select' | 'deselect'>('select');
  const [hoveredCell, setHoveredCell] = useState<{ date: string; hour: number } | null>(null);
  const [pendingChanges, setPendingChanges] = useState<Set<string>>(new Set());

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedHours, setSelectedHours] = useState<Set<number>>(new Set());
  const [existingSlots, setExistingSlots] = useState<DateAvailabilitySlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Initialize selected tutor for admins/managers in default mode only
  useEffect(() => {
    if (isAvailabilityModalOpen && !isHomeMode && isAdminOrManager && !selectedTutorId && tutors.length > 0) {
      setSelectedTutorId(tutors[0].tutorId);
    }
  }, [isAvailabilityModalOpen, isHomeMode, isAdminOrManager, selectedTutorId, tutors]);

  // Handle click outside to close date picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    };

    if (showDatePicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDatePicker]);

  // Load existing availability for selected date (default mode) or week (home mode)
  useEffect(() => {
    if (isAvailabilityModalOpen && managingTutor) {
      if (isHomeMode) {
        // Load week's worth of data for home mode
        const weekDays = getWeekDays();
        const allSlots: DateAvailabilitySlot[] = [];
        
        weekDays.forEach(day => {
          const dateString = formatDateString(day);
          const slots = managingTutor.schedule[dateString] || [];
          slots
            .filter(s => s.type === 'available')
            .forEach(s => {
              allSlots.push({
                id: s.id,
                date: dateString,
                hour_start: parseInt(s.startTime.split(':')[0], 10),
                hour_end: parseInt(s.endTime.split(':')[0], 10),
                isExisting: true
              });
            });
        });
        
        setExistingSlots(allSlots);
      } else {
        // Original single-day logic for default mode
        const dateString = selectedDate.toISOString().split('T')[0];
        const slots = managingTutor.schedule[dateString] || [];
        const dateSlots: DateAvailabilitySlot[] = slots
          .filter(s => s.type === 'available')
          .map(s => ({
            id: s.id,
            date: dateString,
            hour_start: parseInt(s.startTime.split(':')[0], 10),
            hour_end: parseInt(s.endTime.split(':')[0], 10),
            isExisting: true
          }));
        setExistingSlots(dateSlots);
      }
    } else {
      setExistingSlots([]);
    }
  }, [isAvailabilityModalOpen, selectedDate, weekOffset, managingTutor, isHomeMode]);

  const hours: number[] = Array.from({ length: 13 }, (_, i) => i + 9); // 9 AM to 9 PM

  // Helper functions for home mode
  const getWeekDays = (): Date[] => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + (weekOffset * 7));
    
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });
  };

  const formatDateString = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const formatWeekRange = (): string => {
    const weekDays = getWeekDays();
    const start = weekDays[0];
    const end = weekDays[6];
    return `${start.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`;
  };

  const isPastDate = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCellSelected = (date: Date, hour: number): boolean => {
    const dateString = formatDateString(date);
    const cellKey = `${dateString}-${hour}`;
    
    // Check if there's a pending change for this cell
    const hasAddPending = pendingChanges.has(`add-${cellKey}`);
    const hasRemovePending = pendingChanges.has(`remove-${cellKey}`);
    
    const existsInSlots = existingSlots.some(
      slot => slot.date === dateString && slot.hour_start === hour
    );
    
    // If pending add, show as selected
    // If pending remove, show as not selected
    // Otherwise show based on existing slots
    if (hasAddPending) return true;
    if (hasRemovePending) return false;
    return existsInSlots;
  };

  const getDateSlotCount = (date: Date): number => {
    const dateString = formatDateString(date);
    return existingSlots.filter(slot => slot.date === dateString).length;
  };

  const formatHour = (hour: number): string => {
    if (hour === 12) return '12:00 PM';
    if (hour === 0) return '12:00 AM';
    if (hour > 12) return `${hour - 12}:00 PM`;
    return `${hour}:00 AM`;
  };

  const toggleHour = (hour: number): void => {
    const newSelected = new Set(selectedHours);
    if (newSelected.has(hour)) {
      newSelected.delete(hour);
    } else {
      newSelected.add(hour);
    }
    setSelectedHours(newSelected);
  };

  // Home mode cell toggling with drag support
  const toggleCell = (date: Date, hour: number): void => {
    if (!managingTutorId) return;
    if (isPastDate(date)) return;

    const dateString = formatDateString(date);
    const cellKey = `${dateString}-${hour}`;
    const existingSlot = existingSlots.find(
      slot => slot.date === dateString && slot.hour_start === hour
    );

    // Track pending changes during drag
    const newPending = new Set(pendingChanges);
    
    if (existingSlot) {
      // Mark for removal
      newPending.add(`remove-${cellKey}`);
      newPending.delete(`add-${cellKey}`);
    } else {
      // Mark for addition
      newPending.add(`add-${cellKey}`);
      newPending.delete(`remove-${cellKey}`);
    }
    
    setPendingChanges(newPending);
  };

  const applyPendingChanges = async () => {
    if (pendingChanges.size === 0 || !managingTutorId) return;

    setIsLoading(true);
    try {
      const slotsToAdd: { tutorId: string; date: string; time: string }[] = [];
      const slotsToRemove: { tutorId: string; slotId: string }[] = [];

      pendingChanges.forEach(change => {
        // Parse: "add-2026-02-09-14" or "remove-2026-02-09-14"
        const actionEndIndex = change.indexOf('-');
        const action = change.substring(0, actionEndIndex);
        const rest = change.substring(actionEndIndex + 1);
        
        // Split rest by last dash to separate date from hour
        const lastDashIndex = rest.lastIndexOf('-');
        const dateString = rest.substring(0, lastDashIndex);
        const hourStr = rest.substring(lastDashIndex + 1);
        const hour = parseInt(hourStr);

        if (action === 'add') {
          slotsToAdd.push({
            tutorId: managingTutorId,
            date: dateString,
            time: `${String(hour).padStart(2, '0')}:00`
          });
        } else if (action === 'remove') {
          const slot = existingSlots.find(
            s => s.date === dateString && s.hour_start === hour
          );
          if (slot?.id) {
            slotsToRemove.push({
              tutorId: managingTutorId,
              slotId: slot.id
            });
          }
        }
      });

      // Execute changes silently (no alerts from context)
      const promises: Promise<any>[] = [];
      
      if (slotsToAdd.length > 0) {
        promises.push(
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}/api/v1/tutors/${managingTutorId}/availability/bulk`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              slots: slotsToAdd.map(({ date, time }) => {
                const hour = parseInt(time.split(':')[0], 10);
                return { date, hour_start: hour, hour_end: hour + 1, type: 'available' };
              })
            }),
          })
        );
      }

      if (slotsToRemove.length > 0) {
        slotsToRemove.forEach(({ slotId }) => {
          promises.push(
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}/api/v1/tutors/availability/${slotId}`, {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
            })
          );
        });
      }

      await Promise.all(promises);
      await refreshData();
      setPendingChanges(new Set());
    } catch (error) {
      console.error('Error applying changes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMouseDown = (date: Date, hour: number) => {
    if (isPastDate(date)) return;
    
    const isSelected = isCellSelected(date, hour);
    setIsDragging(true);
    setDragMode(isSelected ? 'deselect' : 'select');
    toggleCell(date, hour);
  };

  const handleMouseEnter = (date: Date, hour: number) => {
    // Only process if actively dragging (after initial click)
    if (!isDragging || isPastDate(date)) return;

    const isSelected = isCellSelected(date, hour);

    if (dragMode === 'select' && !isSelected) {
      toggleCell(date, hour);
    } else if (dragMode === 'deselect' && isSelected) {
      toggleCell(date, hour);
    }
  };

  // Global mouse up listener for drag
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging && isHomeMode) {
        setIsDragging(false);
        // Apply all pending changes when drag ends
        applyPendingChanges();
      } else {
        setIsDragging(false);
      }
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => document.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [isDragging, isHomeMode, pendingChanges, managingTutorId, existingSlots]);

  const isHourAvailable = (hour: number): DateAvailabilitySlot | undefined => {
    return existingSlots.find(slot => 
      slot.hour_start === hour && slot.hour_end === hour + 1
    );
  };

  const handleAddAvailability = async (): Promise<void> => {
    if (!managingTutorId || selectedHours.size === 0) {
      alert('Please select at least one hour to add availability.');
      return;
    }

    const dateString = selectedDate.toISOString().split('T')[0];

    setIsLoading(true);
    try {
      const slotsToAdd = Array.from(selectedHours).map(hour => ({
        tutorId: managingTutorId,
        date: dateString,
        time: `${String(hour).padStart(2, '0')}:00`
      }));

      await markSlotsAvailable(slotsToAdd);
      
      // Refresh to get updated data
      await refreshData();
      
      // Clear selection
      setSelectedHours(new Set());
    } catch (error) {
      console.error('Error adding availability:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveSlot = async (slot: DateAvailabilitySlot): Promise<void> => {
    if (!slot.id || !managingTutorId) return;

    if (isHomeMode) {
      // Skip confirmation in home mode for faster UX
      setIsLoading(true);
      try {
        await removeAvailability([{ tutorId: managingTutorId, slotId: slot.id }]);
        await refreshData();
      } catch (error) {
        console.error('Error removing availability:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Keep confirmation in default mode
      if (!confirm(`Remove availability for ${formatHour(slot.hour_start)}?`)) {
        return;
      }

      setIsLoading(true);
      try {
        await removeAvailability([{ tutorId: managingTutorId, slotId: slot.id }]);
        await refreshData();
      } catch (error) {
        console.error('Error removing availability:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleQuickSelect = (type: 'morning' | 'afternoon' | 'evening' | 'all' | 'clear'): void => {
    const newSelected = new Set<number>();
    
    switch (type) {
      case 'morning': // 9 AM - 12 PM
        [9, 10, 11].forEach(h => newSelected.add(h));
        break;
      case 'afternoon': // 12 PM - 5 PM
        [12, 13, 14, 15, 16].forEach(h => newSelected.add(h));
        break;
      case 'evening': // 5 PM - 9 PM
        [17, 18, 19, 20].forEach(h => newSelected.add(h));
        break;
      case 'all':
        hours.forEach(h => newSelected.add(h));
        break;
      case 'clear':
        break;
    }
    
    setSelectedHours(newSelected);
  };

  // Keyboard shortcuts
  useEffect(() => {
    if (!isAvailabilityModalOpen || !isHomeMode) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
          if (weekOffset > 0) setWeekOffset(prev => prev - 1);
          break;
        case 'ArrowRight':
          if (weekOffset < 3) setWeekOffset(prev => prev + 1);
          break;
        case 'h':
        case 'Home':
          setWeekOffset(0);
          break;
        case 'Escape':
          closeAvailabilityModal();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isAvailabilityModalOpen, isHomeMode, weekOffset, closeAvailabilityModal]);

  if (!isAvailabilityModalOpen) return null;

  if (!managingTutorId || !managingTutor) {
    return (
      <div className="fixed inset-0 z-[9999] overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={closeAvailabilityModal}></div>
          <div className="relative inline-block bg-white rounded-lg p-6 shadow-xl max-w-md z-[10000]">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Authentication Required</h3>
            <p className="text-gray-600 mb-4">You must be signed in as a tutor to manage availability.</p>
            <button
              onClick={closeAvailabilityModal}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render home mode
  if (isHomeMode) {
    const weekDays = getWeekDays();
    const totalSlots = existingSlots.length;

    return (
      <div className="fixed inset-0 z-[9999] overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen p-2 sm:p-4">
          {/* Background overlay */}
          <div
            className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
            onClick={closeAvailabilityModal}
          ></div>

          {/* Modal panel */}
          <div className="relative bg-white rounded-xl shadow-2xl transform transition-all w-full max-w-6xl max-h-[95vh] flex flex-col z-[10000]">
            {/* Header */}
            <div className="flex-shrink-0 border-b border-gray-200 px-4 sm:px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                    Your Availability
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    {formatWeekRange()} • {totalSlots} slot{totalSlots !== 1 ? 's' : ''} selected
                  </p>
                </div>
                <button
                  onClick={closeAvailabilityModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              {/* Week navigation */}
              <div className="flex items-center gap-2 mt-4">
                <button
                  onClick={() => setWeekOffset(prev => Math.max(0, prev - 1))}
                  disabled={weekOffset === 0}
                  className="p-2 rounded-lg bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                </button>

                <button
                  onClick={() => setWeekOffset(0)}
                  className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700 transition-all"
                >
                  This Week
                </button>

                <button
                  onClick={() => setWeekOffset(prev => Math.min(3, prev + 1))}
                  disabled={weekOffset === 3}
                  className="p-2 rounded-lg bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                </button>

                <div className="hidden sm:flex items-center gap-3 ml-auto text-xs text-gray-500">
                  <span>⌨️ Use ← → arrows to navigate</span>
                  <span>•</span>
                  <span>Press H for this week</span>
                </div>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 overflow-auto p-2 sm:p-4">
              <div className="min-w-[650px]">
                {/* Day headers - sticky on mobile */}
                <div className="sticky top-0 z-10 bg-white pb-2 grid grid-cols-8 gap-1 mb-2">
                  <div className="p-2 sm:p-3 text-center">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 mx-auto text-gray-400" />
                  </div>
                  {weekDays.map((day, index) => {
                    const isTodayDate = isToday(day);
                    const isPast = isPastDate(day);
                    const dateSlotCount = getDateSlotCount(day);

                    return (
                      <div
                        key={index}
                        className={`p-2 sm:p-3 rounded-lg text-center border-b-2 ${
                          isPast
                            ? 'bg-gray-50 border-gray-200'
                            : isTodayDate
                            ? 'bg-blue-50 border-blue-400'
                            : dateSlotCount > 0
                            ? 'bg-emerald-50 border-emerald-300'
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        <div className={`text-[10px] sm:text-xs font-semibold uppercase ${
                          isPast ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {day.toLocaleDateString('en-GB', { weekday: 'short' })}
                        </div>
                        <div className={`text-base sm:text-lg font-bold ${
                          isPast
                            ? 'text-gray-400'
                            : isTodayDate
                            ? 'text-blue-600'
                            : 'text-gray-900'
                        }`}>
                          {day.getDate()}
                        </div>
                        <div className="text-[10px] text-gray-500">
                          {day.toLocaleDateString('en-GB', { month: 'short' })}
                        </div>
                        {dateSlotCount > 0 && !isPast && (
                          <div className="mt-1">
                            <span className="text-[10px] sm:text-xs font-medium text-emerald-600">
                              {dateSlotCount}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Time slots */}
                {hours.map((hour) => (
                  <div key={hour} className="grid grid-cols-8 gap-1 mb-1">
                    <div className="sticky left-0 z-10 bg-white p-2 sm:p-3 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
                      <span className="text-xs sm:text-sm font-semibold text-gray-700">
                        {formatHour(hour).replace(':00', '')}
                      </span>
                    </div>

                    {weekDays.map((day, dayIndex) => {
                      const isPast = isPastDate(day);
                      const isSelected = isCellSelected(day, hour);
                      const cellKey = `${formatDateString(day)}-${hour}`;
                      const isHovered = hoveredCell?.date === formatDateString(day) && hoveredCell?.hour === hour;

                      return (
                        <motion.button
                          key={cellKey}
                          onMouseDown={() => handleMouseDown(day, hour)}
                          onMouseEnter={() => {
                            if (isDragging) {
                              setHoveredCell({ date: formatDateString(day), hour });
                            }
                            handleMouseEnter(day, hour);
                          }}
                          onMouseLeave={() => setHoveredCell(null)}
                          disabled={isPast || isLoading}
                          className={`
                            p-2 sm:p-3 rounded-lg transition-all select-none border-2
                            ${isPast
                              ? 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-50'
                              : isSelected
                              ? 'bg-blue-600 border-blue-600 shadow-md'
                              : isHovered && isDragging
                              ? 'bg-blue-100 border-blue-300'
                              : 'bg-white border-gray-200 hover:border-blue-200 cursor-pointer'
                            }
                          `}
                          whileHover={!isPast && !isLoading ? { scale: 1.02 } : {}}
                          whileTap={!isPast && !isLoading ? { scale: 0.98 } : {}}
                        >
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-full h-full flex items-center justify-center"
                            >
                              <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </motion.div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 border-t border-gray-200 px-4 sm:px-6 py-3 bg-gray-50">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-blue-600 border-2 border-blue-600" />
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-blue-50 border-2 border-blue-400" />
                    <span>Today</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-gray-100 border-2 border-gray-300" />
                    <span>Past</span>
                  </div>
                </div>
                <div className="text-center sm:text-right">
                  <span className="font-medium">💡 Tip:</span> Click and drag to quickly add or remove slots
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default mode render (existing logic)
  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={closeAvailabilityModal}
        ></div>

        {/* Modal panel */}
        <div className="relative inline-block align-bottom bg-white rounded-lg px-6 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full sm:p-6 z-[10000]">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900">Manage {isAdminOrManager ? 'Tutor' : 'Your'} Availability</h3>
              <p className="text-sm text-gray-500 mt-1">{tutorName}'s Schedule</p>
              
              {/* Tutor Selector for Admins/Managers in default mode */}
              {!isHomeMode && isAdminOrManager && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Select Tutor
                  </label>
                  <select
                    value={selectedTutorId || ''}
                    onChange={(e) => setSelectedTutorId(e.target.value)}
                    className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {tutors.map((tutor) => (
                      <option key={tutor.tutorId} value={tutor.tutorId}>
                        {tutor.tutorName}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <button
              onClick={closeAvailabilityModal}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Add New Availability */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" />
                Add Availability
              </h4>

              <div className="space-y-4">
                {/* Date Picker */}
                <div className="relative" ref={datePickerRef}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Select Date
                  </label>
                  <button
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    type="button"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between"
                  >
                    <span className="text-sm font-medium text-gray-900">
                      {selectedDate.toLocaleDateString('en-GB', { 
                        weekday: 'short',
                        day: 'numeric', 
                        month: 'long',
                        year: 'numeric' 
                      })}
                    </span>
                    <Calendar className="w-4 h-4 text-gray-400" />
                  </button>
                  
                  {/* Calendar Picker Dropdown */}
                  {showDatePicker && (
                    <div className="absolute mt-2 z-50 min-w-[280px]">
                      <CalendarPicker
                        selectedDate={selectedDate}
                        onDateChange={(date) => {
                          setSelectedDate(date);
                          setShowDatePicker(false);
                        }}
                        minDate={new Date()}
                      />
                    </div>
                  )}
                </div>

                {/* Quick Select Buttons */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quick Select
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleQuickSelect('morning')}
                      className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                    >
                      Morning (9-12)
                    </button>
                    <button
                      onClick={() => handleQuickSelect('afternoon')}
                      className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                    >
                      Afternoon (12-5)
                    </button>
                    <button
                      onClick={() => handleQuickSelect('evening')}
                      className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                    >
                      Evening (5-9)
                    </button>
                    <button
                      onClick={() => handleQuickSelect('all')}
                      className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                    >
                      All Day
                    </button>
                  </div>
                  {selectedHours.size > 0 && (
                    <button
                      onClick={() => handleQuickSelect('clear')}
                      className="mt-2 w-full px-3 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Clear Selection
                    </button>
                  )}
                </div>

                {/* Hour Selection Grid */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Select Hours (click to toggle)
                  </label>
                  <div className="grid grid-cols-3 gap-2 max-h-80 overflow-y-auto p-1">
                    {hours.map((hour) => {
                      const existing = isHourAvailable(hour);
                      const isSelected = selectedHours.has(hour);
                      
                      return (
                        <button
                          key={hour}
                          onClick={() => !existing && toggleHour(hour)}
                          disabled={!!existing}
                          className={`px-3 py-3 text-sm font-medium rounded-lg transition-all ${
                            existing
                              ? 'bg-green-100 text-green-800 border-2 border-green-300 cursor-not-allowed opacity-60'
                              : isSelected
                              ? 'bg-blue-600 text-white border-2 border-blue-700 shadow-md'
                              : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-blue-50 hover:border-blue-400'
                          }`}
                        >
                          {formatHour(hour)}
                          {existing && <Check className="w-3 h-3 inline ml-1" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Add Button */}
                <button
                  onClick={handleAddAvailability}
                  disabled={selectedHours.size === 0 || isLoading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  {isLoading ? 'Adding...' : `Add ${selectedHours.size} Hour${selectedHours.size !== 1 ? 's' : ''}`}
                </button>
              </div>
            </div>

            {/* Right: Current Availability */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-600" />
                Current Availability
                <span className="text-sm font-normal text-gray-600">
                  ({selectedDate.toLocaleDateString('en-GB', { 
                    weekday: 'short', 
                    day: 'numeric', 
                    month: 'short' 
                  })})
                </span>
              </h4>

              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {existingSlots.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium">No availability set for this date</p>
                    <p className="text-sm mt-1">Select hours and click "Add" to get started</p>
                  </div>
                ) : (
                  existingSlots.map((slot) => (
                    <div
                      key={slot.id}
                      className="flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200 hover:border-green-300 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Clock className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {formatHour(slot.hour_start)} - {formatHour(slot.hour_end)}
                          </div>
                          <div className="text-xs text-gray-500">1 hour slot</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveSlot(slot)}
                        disabled={isLoading}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Remove this availability"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <span className="font-medium">💡 Tip:</span> Green hours are already available. Select and add new hours to expand your schedule.
            </div>
            <button
              onClick={closeAvailabilityModal}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityModal;
