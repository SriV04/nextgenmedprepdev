'use client'

import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Check, Plus, X } from 'lucide-react';
import { universities } from '@/data/universities';
import { ExtendedPackage } from '../../data/packages';

interface AvailabilitySlot {
  date: string;
  timeSlot: string;
}

interface Step3_5InterviewDatesProps {
  selectedUniversities: string[];
  selectedPackage: ExtendedPackage | null;
  availability: AvailabilitySlot[];
  onAvailabilityChange: (availability: AvailabilitySlot[]) => void;
  onProceedToNext: () => void;
}

export default function Step3_5InterviewDates({
  selectedUniversities,
  selectedPackage,
  availability,
  onAvailabilityChange,
  onProceedToNext
}: Step3_5InterviewDatesProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartSlot, setDragStartSlot] = useState<string | null>(null);

  if (!selectedPackage || selectedUniversities.length === 0) return null;

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
  ];
  const totalSlots = availability?.length || 0;

  const getUniversityName = (id: string) => {
    const university = universities.find(uni => uni.id === id);
    return university?.displayName || university?.name || '';
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDateHeader = (date: Date) => {
    return date.toLocaleDateString('en-GB', { 
      weekday: 'short',
      day: 'numeric', 
      month: 'short'
    });
  };

  const formatMonthYear = (date: Date) => {
    const today = new Date();
    const twoWeeks = new Date(today);
    twoWeeks.setDate(today.getDate() + 14);
    return `Next 2 Weeks (${today.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - ${twoWeeks.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })})`;
  };

  // Calendar navigation (disabled for 2-week view)
  const handlePreviousMonth = () => {
    // Disabled - only showing next 2 weeks
  };

  const handleNextMonth = () => {
    // Disabled - only showing next 2 weeks
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  // Get calendar days for the next 2 weeks only
  const getCalendarDays = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Start from the beginning of the current week (Sunday)
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - today.getDay());
    
    // End 2 weeks from today
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 14);
    
    const days: Date[] = [];
    const currentDate = new Date(startDate);
    
    // Generate days until we've covered the range
    while (currentDate <= endDate || days.length < 21) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
      if (days.length >= 21) break; // Max 3 weeks displayed
    }
    
    return days;
  };

  // Check if date is in the past or beyond 2 weeks
  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const twoWeeksFromNow = new Date(today);
    twoWeeksFromNow.setDate(today.getDate() + 14);
    return date < today || date > twoWeeksFromNow;
  };

  // Check if date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Check if date is selected
  const isDateSelected = (date: Date) => {
    return selectedDate?.toDateString() === date.toDateString();
  };

  // Check if date is within the next 2 weeks (valid range)
  const isCurrentMonth = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const twoWeeksFromNow = new Date(today);
    twoWeeksFromNow.setDate(today.getDate() + 14);
    return date >= today && date <= twoWeeksFromNow;
  };

  // Handle date selection
  const handleDateClick = (date: Date) => {
    if (isPastDate(date)) return;
    setSelectedDate(date);
    setSelectedTimeSlots([]);
  };

  // Drag selection handlers
  const handleMouseDown = (time: string) => {
    setIsDragging(true);
    setDragStartSlot(time);
    toggleTimeSlot(time);
  };

  const handleMouseEnter = (time: string) => {
    if (isDragging) {
      toggleTimeSlot(time);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStartSlot(null);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      setDragStartSlot(null);
    };
    
    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => document.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  // Toggle time slot selection
  const toggleTimeSlot = (time: string) => {
    setSelectedTimeSlots(prev => {
      if (prev.includes(time)) {
        return prev.filter(t => t !== time);
      } else {
        return [...prev, time].sort();
      }
    });
  };

  // Add selected slots to availability
  const handleAddAvailability = () => {
    if (!selectedDate || selectedTimeSlots.length === 0) {
      alert('Please select a date and at least one time slot');
      return;
    }

    const dateStr = formatDate(selectedDate);
    const newSlots: AvailabilitySlot[] = selectedTimeSlots.map(time => {
      const endHour = parseInt(time.split(':')[0]) + (time.includes(':30') ? 1 : 1);
      const endMinute = time.includes(':30') ? '30' : '00';
      const timeSlot = `${time} - ${String(endHour).padStart(2, '0')}:${endMinute}`;
      
      return {
        date: dateStr,
        timeSlot
      };
    });

    // Filter out duplicates
    const updatedAvailability = [...(availability || [])];
    newSlots.forEach(newSlot => {
      const exists = updatedAvailability.some(
        slot => slot.date === newSlot.date && slot.timeSlot === newSlot.timeSlot
      );
      if (!exists) {
        updatedAvailability.push(newSlot);
      }
    });

    onAvailabilityChange(updatedAvailability);

    // Clear selection after adding
    setSelectedTimeSlots([]);
    setSelectedDate(null);
  };

  const calendarDays = getCalendarDays();

  return (
    <motion.div
      key="step3_5"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Share Your <span className="text-gradient-aurora">Availability</span>
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Select dates and drag through time slots to quickly mark your availability
        </p>
      </div>

      {/* Calendar View */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Calendar Section */}
          <motion.div 
            className="bg-black/40 rounded-xl border border-indigo-500/30 overflow-hidden"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* Calendar Header */}
            <div className="border-b border-indigo-500/30 px-6 py-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">
                  {formatMonthYear(currentMonth)}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToday}
                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:bg-indigo-500/20 rounded-lg transition-all"
                  >
                    Today
                  </button>
                </div>
              </div>

              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-1">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-xs font-semibold text-gray-400 py-2">
                    {day}
                  </div>
                ))}
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-4">
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, index) => {
                  const isPast = isPastDate(day);
                  const isSelected = isDateSelected(day);
                  const isTodayDate = isToday(day);
                  const inMonth = isCurrentMonth(day);

                  return (
                    <motion.button
                      key={index}
                      onClick={() => handleDateClick(day)}
                      disabled={isPast}
                      className={`
                        aspect-square rounded-lg p-2 text-sm font-medium transition-all relative
                        ${isPast ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
                        ${!inMonth ? 'text-gray-600' : 'text-gray-200'}
                        ${isSelected 
                          ? 'bg-indigo-500 text-white ring-2 ring-indigo-400 shadow-lg shadow-indigo-500/50' 
                          : isTodayDate
                          ? 'bg-purple-500/20 border-2 border-purple-400 text-purple-200'
                          : 'bg-black/40 border border-gray-600 hover:bg-indigo-500/10 hover:border-indigo-500/50'
                        }
                      `}
                      whileHover={!isPast ? { scale: 1.05 } : {}}
                      whileTap={!isPast ? { scale: 0.95 } : {}}
                    >
                      {day.getDate()}
                      {isTodayDate && !isSelected && (
                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-purple-400 rounded-full" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {selectedDate && (
              <motion.div 
                className="border-t border-indigo-500/30 px-6 py-4 bg-indigo-500/5"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="text-sm text-gray-300">
                  Selected: <span className="font-semibold text-white">{formatDateHeader(selectedDate)}</span>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Time Slots Section */}
          <motion.div 
            className="bg-black/40 rounded-xl border border-indigo-500/30 overflow-hidden"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="border-b border-indigo-500/30 px-6 py-4 bg-gradient-to-r from-purple-500/10 to-indigo-500/10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Select Time Slots</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {selectedDate ? 'Choose your available times' : 'Pick a date first'}
                  </p>
                </div>
                {selectedTimeSlots.length > 0 && (
                  <div className="bg-indigo-500/20 px-3 py-1 rounded-full">
                    <span className="text-sm font-semibold text-indigo-300">
                      {selectedTimeSlots.length} selected
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 max-h-[500px] overflow-y-auto">
              {!selectedDate ? (
                <div className="text-center py-12">
                  <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-gray-600 opacity-50" />
                  <p className="text-gray-400">Please select a date from the calendar</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {timeSlots.map((time) => {
                    const isSelected = selectedTimeSlots.includes(time);
                    
                    return (
                      <motion.button
                        key={time}
                        onMouseDown={() => handleMouseDown(time)}
                        onMouseEnter={() => handleMouseEnter(time)}
                        onMouseUp={handleMouseUp}
                        className={`
                          w-full p-4 rounded-lg border-2 transition-all flex items-center justify-between select-none
                          ${isSelected
                            ? 'bg-indigo-500/30 border-indigo-500 shadow-md shadow-indigo-500/20'
                            : 'bg-black/40 border-gray-600 hover:border-indigo-500/50 hover:bg-indigo-500/10'
                          }
                        `}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`
                            w-10 h-10 rounded-lg flex items-center justify-center
                            ${isSelected ? 'bg-indigo-500' : 'bg-gray-700'}
                          `}>
                            <Clock className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                          </div>
                          <span className={`font-medium ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                            {time}
                          </span>
                        </div>
                        
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center"
                          >
                            <Check className="w-4 h-4 text-white" />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {selectedTimeSlots.length > 0 && (
                <motion.button
                  onClick={handleAddAvailability}
                  className="w-full mt-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg shadow-green-500/25 flex items-center justify-center gap-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus className="w-5 h-5" />
                  Add {selectedTimeSlots.length} Slot{selectedTimeSlots.length > 1 ? 's' : ''}
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>

      {/* Navigation */}
      <div className="flex justify-center gap-4 mt-8">
        <AnimatePresence>
          <motion.button
            onClick={onProceedToNext}
            className="px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold transition-all shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Skip Availability Selection
          </motion.button>
          
          {totalSlots > 0 && (
            <motion.button
              onClick={onProceedToNext}
              className="px-12 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all shadow-xl shadow-indigo-500/25 overflow-hidden group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(99, 102, 241, 0.4)" }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-white/10 to-purple-600/0"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
              
              <span className="relative z-10 flex items-center gap-2">
                Submit & Continue ({totalSlots} slot{totalSlots > 1 ? 's' : ''})
                <motion.svg 
                  className="w-5 h-5"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </motion.svg>
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}