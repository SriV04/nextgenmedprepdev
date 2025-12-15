'use client'

import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Check, Plus, X, Trash2 } from 'lucide-react';
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

interface CellKey {
  date: string;
  time: string;
}

export default function Step3_5InterviewDates({
  selectedUniversities,
  selectedPackage,
  availability,
  onAvailabilityChange,
  onProceedToNext
}: Step3_5InterviewDatesProps) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartCell, setDragStartCell] = useState<CellKey | null>(null);
  const [dragMode, setDragMode] = useState<'select' | 'deselect'>('select');
  const [hoveredCell, setHoveredCell] = useState<CellKey | null>(null);

  // useEffect must be called before any conditional returns
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      setDragStartCell(null);
    };
    
    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => document.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  if (!selectedPackage || selectedUniversities.length === 0) return null;

  // Time slots for the grid (9 AM to 6 PM)
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00',
    '17:00', '18:00', '19:00', '20:00'
  ];

  const totalSlots = availability?.length || 0;

  // Get the 7 days of the current week view
  const getWeekDays = (): Date[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + (weekOffset * 7));
    
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    
    return days;
  };

  const weekDays = getWeekDays();

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const formatDateHeader = (date: Date): string => {
    return date.toLocaleDateString('en-GB', { 
      weekday: 'short',
      day: 'numeric', 
      month: 'short'
    });
  };

  const formatWeekRange = (): string => {
    const firstDay = weekDays[0];
    const lastDay = weekDays[6];
    return `${firstDay.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - ${lastDay.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`;
  };

  const isPastDate = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Check if a specific date-time slot is selected
  const isCellSelected = (date: Date, time: string): boolean => {
    const dateStr = formatDate(date);
    const endHour = parseInt(time.split(':')[0]) + 1;
    const timeSlot = `${time} - ${String(endHour).padStart(2, '0')}:00`;
    
    return availability?.some(
      slot => slot.date === dateStr && slot.timeSlot === timeSlot
    ) || false;
  };

  // Handle cell click for selection/deselection
  const handleCellClick = (date: Date, time: string) => {
    if (isPastDate(date)) return;
    
    const dateStr = formatDate(date);
    const endHour = parseInt(time.split(':')[0]) + 1;
    const timeSlot = `${time} - ${String(endHour).padStart(2, '0')}:00`;
    
    const isSelected = isCellSelected(date, time);
    
    if (isSelected) {
      // Remove the slot
      const updatedAvailability = availability.filter(
        slot => !(slot.date === dateStr && slot.timeSlot === timeSlot)
      );
      onAvailabilityChange(updatedAvailability);
    } else {
      // Add the slot
      const newSlot: AvailabilitySlot = { date: dateStr, timeSlot };
      onAvailabilityChange([...availability, newSlot]);
    }
  };

  // Handle drag start
  const handleMouseDown = (date: Date, time: string) => {
    if (isPastDate(date)) return;
    
    const cellKey: CellKey = { date: formatDate(date), time };
    setDragStartCell(cellKey);
    setIsDragging(true);
    
    // Determine if we're selecting or deselecting based on current state
    const isSelected = isCellSelected(date, time);
    setDragMode(isSelected ? 'deselect' : 'select');
    
    // Apply the action immediately
    handleCellClick(date, time);
  };

  // Handle drag over cells
  const handleMouseEnter = (date: Date, time: string) => {
    if (!isDragging || isPastDate(date)) return;
    
    const isSelected = isCellSelected(date, time);
    
    // Only apply if it matches our drag mode
    if (dragMode === 'select' && !isSelected) {
      handleCellClick(date, time);
    } else if (dragMode === 'deselect' && isSelected) {
      handleCellClick(date, time);
    }
  };

  // Clear all availability
  const handleClearAll = () => {
    if (confirm('Clear all selected time slots?')) {
      onAvailabilityChange([]);
    }
  };

  // Select all slots in current week
  const handleSelectAllWeek = () => {
    const newSlots: AvailabilitySlot[] = [];
    
    weekDays.forEach(date => {
      if (!isPastDate(date)) {
        timeSlots.forEach(time => {
          const dateStr = formatDate(date);
          const endHour = parseInt(time.split(':')[0]) + 1;
          const timeSlot = `${time} - ${String(endHour).padStart(2, '0')}:00`;
          
          // Check if not already in availability
          const exists = availability.some(
            slot => slot.date === dateStr && slot.timeSlot === timeSlot
          );
          
          if (!exists) {
            newSlots.push({ date: dateStr, timeSlot });
          }
        });
      }
    });
    
    onAvailabilityChange([...availability, ...newSlots]);
  };

  // Navigate weeks
  const handlePreviousWeek = () => {
    if (weekOffset > 0) {
      setWeekOffset(weekOffset - 1);
    }
  };

  const handleNextWeek = () => {
    if (weekOffset < 3) { // Allow up to 4 weeks ahead
      setWeekOffset(weekOffset + 1);
    }
  };

  const handleThisWeek = () => {
    setWeekOffset(0);
  };

  // Handle skip - clear availability and proceed
  const handleSkip = () => {
    onAvailabilityChange([]);
    onProceedToNext();
  };

  return (
    <motion.div
      key="step3_5"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Share Your <span className="text-gradient-aurora">Availability</span>
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Click and drag to select when you're generally available. We'll reach out to schedule your mock interviews.
        </p>
        <p className="text-sm text-gray-400 mt-2">
          💡 You're not booking specific times yet - just sharing your general availability
        </p>
      </div>

      {/* Main Grid Container */}
      <div className="bg-black/40 rounded-xl border border-indigo-500/30 overflow-hidden">
        {/* Header with Navigation */}
        <div className="border-b border-indigo-500/30 px-6 py-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <CalendarIcon className="w-6 h-6" />
                Select Your Availability
              </h3>
              <span className="text-sm text-gray-400">
                {formatWeekRange()}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handlePreviousWeek}
                disabled={weekOffset === 0}
                className="p-2 rounded-lg bg-black/40 border border-gray-600 hover:border-indigo-500/50 hover:bg-indigo-500/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-5 h-5 text-gray-300" />
              </button>
              
              <button
                onClick={handleThisWeek}
                className="px-4 py-2 rounded-lg bg-black/40 border border-gray-600 hover:border-indigo-500/50 hover:bg-indigo-500/10 text-sm font-medium text-gray-300 transition-all"
              >
                This Week
              </button>
              
              <button
                onClick={handleNextWeek}
                disabled={weekOffset === 3}
                className="p-2 rounded-lg bg-black/40 border border-gray-600 hover:border-indigo-500/50 hover:bg-indigo-500/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-5 h-5 text-gray-300" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              <span className="font-medium text-indigo-400">{totalSlots} slots</span> selected
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleSelectAllWeek}
                className="px-3 py-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/50 hover:bg-indigo-500/30 text-xs font-medium text-indigo-300 transition-all flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Select All Week
              </button>
              
              {totalSlots > 0 && (
                <button
                  onClick={handleClearAll}
                  className="px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/50 hover:bg-red-500/30 text-xs font-medium text-red-300 transition-all flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Availability Grid */}
        <div className="p-4 overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header Row - Days of Week */}
            <div className="grid grid-cols-8 gap-1 mb-1">
              <div className="p-3 text-center">
                <Clock className="w-5 h-5 mx-auto text-gray-500" />
              </div>
              {weekDays.map((day, index) => {
                const isTodayDate = isToday(day);
                const isPast = isPastDate(day);
                const dateSlotCount = availability.filter(slot => slot.date === formatDate(day)).length;
                
                return (
                  <div
                    key={index}
                    className={`p-3 rounded-t-lg text-center border-b-2 ${
                      isPast
                        ? 'bg-gray-800/30 border-gray-700'
                        : isTodayDate
                        ? 'bg-purple-500/20 border-purple-500'
                        : dateSlotCount > 0
                        ? 'bg-green-500/10 border-green-500/50'
                        : 'bg-black/20 border-gray-700'
                    }`}
                  >
                    <div className={`text-xs font-semibold uppercase ${
                      isPast ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {day.toLocaleDateString('en-GB', { weekday: 'short' })}
                    </div>
                    <div className={`text-lg font-bold ${
                      isPast
                        ? 'text-gray-600'
                        : isTodayDate
                        ? 'text-purple-300'
                        : 'text-white'
                    }`}>
                      {day.getDate()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {day.toLocaleDateString('en-GB', { month: 'short' })}
                    </div>
                    {dateSlotCount > 0 && !isPast && (
                      <div className="mt-1">
                        <span className="text-xs font-medium text-green-400">
                          {dateSlotCount} slot{dateSlotCount > 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Time Slot Rows */}
            {timeSlots.map((time, timeIndex) => (
              <div key={time} className="grid grid-cols-8 gap-1 mb-1">
                {/* Time Label */}
                <div className="p-3 flex items-center justify-center bg-black/20 rounded-lg border border-gray-700">
                  <span className="text-sm font-semibold text-gray-300">{time}</span>
                </div>

                {/* Day Cells */}
                {weekDays.map((day, dayIndex) => {
                  const isPast = isPastDate(day);
                  const isSelected = isCellSelected(day, time);
                  const cellKey = `${formatDate(day)}-${time}`;
                  const isHovered = hoveredCell?.date === formatDate(day) && hoveredCell?.time === time;
                  
                  return (
                    <motion.button
                      key={cellKey}
                      onMouseDown={() => handleMouseDown(day, time)}
                      onMouseEnter={() => {
                        setHoveredCell({ date: formatDate(day), time });
                        handleMouseEnter(day, time);
                      }}
                      onMouseLeave={() => setHoveredCell(null)}
                      disabled={isPast}
                      className={`
                        p-3 rounded-lg border-2 transition-all select-none
                        ${isPast
                          ? 'bg-gray-800/20 border-gray-800 cursor-not-allowed opacity-40'
                          : isSelected
                          ? 'bg-gradient-to-br from-indigo-500/40 to-purple-500/40 border-indigo-400 shadow-md'
                          : isHovered && isDragging
                          ? 'bg-indigo-500/20 border-indigo-500/50'
                          : 'bg-black/40 border-gray-700 hover:border-indigo-500/50 hover:bg-indigo-500/10 cursor-pointer'
                        }
                      `}
                      whileHover={!isPast ? { scale: 1.05 } : {}}
                      whileTap={!isPast ? { scale: 0.95 } : {}}
                    >
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-full h-full flex items-center justify-center"
                        >
                          <Check className="w-5 h-5 text-white" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Footer with Legend */}
        <div className="border-t border-indigo-500/30 px-6 py-3 bg-gradient-to-r from-purple-500/5 to-indigo-500/5">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gradient-to-br from-indigo-500/40 to-purple-500/40 border-2 border-indigo-400" />
                <span>Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-purple-500/20 border-2 border-purple-500" />
                <span>Today</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gray-800/20 border-2 border-gray-800" />
                <span>Past</span>
              </div>
            </div>
            <div className="text-gray-500">
              💡 Click and drag to select multiple slots at once
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-center gap-4 mt-8">
        <motion.button
          key="skip-button"
          onClick={handleSkip}
          className="px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold transition-all shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          Skip for Now - We'll Contact You
        </motion.button>
        
        <AnimatePresence mode="wait">
          {totalSlots > 0 && (
            <motion.button
              key="submit-button"
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
                Submit & Continue
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