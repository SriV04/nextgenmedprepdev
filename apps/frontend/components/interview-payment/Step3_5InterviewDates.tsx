'use client'

import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Check } from 'lucide-react';
import { universities } from '@/data/universities';
import { ExtendedPackage } from '../../data/packages';
import { InterviewDate } from '../../app/interviews/payment/hooks/usePaymentForm';
import { 
  getUniversityInterviewDates, 
  getStandardTimeSlots, 
  formatDateForDisplay 
} from '@/utils/interviewDateUtils';
import { useTutorCalendar } from '../../contexts/TutorCalendarContext';

interface Step3_5InterviewDatesProps {
  selectedUniversities: string[];
  selectedPackage: ExtendedPackage | null;
  interviewDates: InterviewDate[];
  onInterviewDateAdd: (universityId: string, date: string, timeSlot: string) => boolean;
  onInterviewDateRemove: (universityId: string, date: string, timeSlot: string) => void;
  getUniversityDateCount: (universityId: string) => number;
  getTotalDateCount: () => number;
  canAddDateForUniversity: (universityId: string) => boolean;
  onProceedToNext: () => void;
}

export default function Step3_5InterviewDates({
  selectedUniversities,
  selectedPackage,
  interviewDates,
  onInterviewDateAdd,
  onInterviewDateRemove,
  getUniversityDateCount,
  getTotalDateCount,
  canAddDateForUniversity,
  onProceedToNext
}: Step3_5InterviewDatesProps) {
  const { tutors, selectedDate: contextDate, setSelectedDate: setContextDate } = useTutorCalendar();
  const [selectedUniversity, setSelectedUniversity] = useState<string>(selectedUniversities[0] || '');
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  
  useEffect(() => {
    if (selectedUniversities.length > 0 && !selectedUniversity) {
      setSelectedUniversity(selectedUniversities[0]);
    }
  }, [selectedUniversities, selectedUniversity]);

  if (!selectedPackage || selectedUniversities.length === 0) return null;

  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
  const totalDates = getTotalDateCount();
  const maxDates = selectedPackage.interviews;

  const getUniversityName = (id: string) => {
    const university = universities.find(uni => uni.id === id);
    return university?.displayName || university?.name || '';
  };

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
    const newDate = new Date(calendarDate);
    newDate.setDate(newDate.getDate() - 1);
    setCalendarDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(calendarDate);
    newDate.setDate(newDate.getDate() + 1);
    setCalendarDate(newDate);
  };

  const handleToday = () => {
    setCalendarDate(new Date());
  };

  // Calculate company-wide availability from all tutors
  const getCompanyAvailability = (dateStr: string): Set<string> => {
    const availableSlots = new Set<string>();
    
    tutors.forEach(tutor => {
      const daySlots = tutor.schedule[dateStr] || [];
      daySlots.forEach(slot => {
        if (slot.type === 'available') {
          availableSlots.add(slot.startTime);
        }
      });
    });
    
    return availableSlots;
  };

  // Check if a slot is already selected
  const isSlotSelected = (date: string, time: string): InterviewDate | undefined => {
    return interviewDates.find(d => d.date === date && d.timeSlot === `${time} - ${parseInt(time.split(':')[0]) + 1}:00`);
  };

  // Handle slot click
  const handleSlotClick = (date: string, time: string) => {
    const timeSlot = `${time} - ${parseInt(time.split(':')[0]) + 1}:00`;
    const existing = isSlotSelected(date, time);
    
    if (existing) {
      // Remove if already selected
      onInterviewDateRemove(existing.universityId, date, existing.timeSlot);
    } else {
      // Add if under limit
      if (totalDates >= maxDates) {
        alert(`Maximum of ${maxDates} interview dates allowed.`);
        return;
      }
      
      const success = onInterviewDateAdd(selectedUniversity, date, timeSlot);
      if (!success) {
        alert(`Maximum of ${maxDates} interview dates allowed.`);
      }
    }
  };

  const getUniversityDates = (universityId: string): InterviewDate[] => {
    return interviewDates.filter(date => date.universityId === universityId);
  };

  const dateStr = formatDate(calendarDate);
  const availableSlots = getCompanyAvailability(dateStr);

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
          Schedule <span className="text-gradient-aurora">Interview Dates</span>
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-4">
          Select interview dates from our available time slots
        </p>
        <div className="text-lg text-indigo-300">
          {totalDates} of {maxDates} interview dates selected
        </div>
      </div>

      {/* University and View Mode Selection */}
      <div className="bg-black/40 rounded-lg p-4 border border-indigo-500/30">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full md:w-auto">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select University for These Interview Dates
            </label>
            <select
              value={selectedUniversity}
              onChange={(e) => setSelectedUniversity(e.target.value)}
              className="w-full px-4 py-2 bg-black border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            >
              {selectedUniversities.map(universityId => (
                <option key={universityId} value={universityId}>
                  {getUniversityName(universityId)} 
                  {getUniversityDateCount(universityId) > 0 && 
                    ` (${getUniversityDateCount(universityId)} date${getUniversityDateCount(universityId) > 1 ? 's' : ''})`
                  }
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-black/40 text-gray-300 hover:bg-black/60'
              }`}
            >
              Calendar View
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-black/40 text-gray-300 hover:bg-black/60'
              }`}
            >
              List View
            </button>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <motion.div 
        className="bg-black/40 rounded-lg p-4 border border-indigo-500/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-300">Interview Dates Progress</span>
          <span className="text-sm text-indigo-400 font-semibold">
            {totalDates} of {maxDates}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div 
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(totalDates / maxDates) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        {totalDates >= 1 && (
          <motion.p 
            className="text-xs text-green-400 mt-2 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            ✓ You can proceed with {totalDates} date{totalDates > 1 ? 's' : ''}, or add more up to {maxDates}. You can also skip scheduling and do it later.
          </motion.p>
        )}
      </motion.div>

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="bg-black/40 rounded-lg border border-indigo-500/30 overflow-hidden">
          {/* Calendar Header */}
          <div className="border-b border-indigo-500/30 px-6 py-4 bg-black/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-semibold text-indigo-400">
                  {formatDateHeader(calendarDate)}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePreviousDay}
                    className="p-2 hover:bg-indigo-500/20 rounded-lg transition-colors"
                    title="Previous day"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-400" />
                  </button>
                  <button
                    onClick={handleToday}
                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:bg-indigo-500/20 rounded-lg transition-colors"
                  >
                    Today
                  </button>
                  <button
                    onClick={handleNextDay}
                    className="p-2 hover:bg-indigo-500/20 rounded-lg transition-colors"
                    title="Next day"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                  <button
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className="p-2 hover:bg-indigo-500/20 rounded-lg transition-colors ml-2"
                    title="Select date"
                  >
                    <CalendarIcon className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
              
              {/* Legend */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500/30 border border-green-500 rounded"></div>
                  <span className="text-gray-300">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-indigo-500 border border-indigo-600 rounded"></div>
                  <span className="text-gray-300">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-700 border border-gray-600 rounded"></div>
                  <span className="text-gray-300">Unavailable</span>
                </div>
              </div>
            </div>

            {/* Date Picker Dropdown */}
            {showDatePicker && (
              <div className="absolute mt-2 bg-black border border-indigo-500/50 rounded-lg shadow-lg p-4 z-20">
                <input
                  type="date"
                  value={formatDate(calendarDate)}
                  onChange={(e) => {
                    const newDate = new Date(e.target.value);
                    setCalendarDate(newDate);
                    setShowDatePicker(false);
                  }}
                  className="px-3 py-2 bg-black border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            )}
          </div>

          {/* Calendar Grid */}
          <div className="overflow-auto max-h-[500px]">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 p-6">
              {timeSlots.map((time) => {
                const isAvailable = availableSlots.has(time);
                const selected = isSlotSelected(dateStr, time);
                const isDisabled = !isAvailable || (totalDates >= maxDates && !selected);

                return (
                  <motion.button
                    key={time}
                    onClick={() => isAvailable && handleSlotClick(dateStr, time)}
                    disabled={isDisabled}
                    className={`p-4 rounded-lg border-2 transition-all relative ${
                      selected
                        ? 'bg-indigo-500/30 border-indigo-500 ring-2 ring-indigo-400'
                        : isAvailable
                        ? 'bg-green-500/10 border-green-500/50 hover:bg-green-500/20 hover:border-green-500'
                        : 'bg-gray-800/50 border-gray-700 cursor-not-allowed opacity-50'
                    }`}
                    whileHover={isAvailable ? { scale: 1.05 } : {}}
                    whileTap={isAvailable ? { scale: 0.95 } : {}}
                  >
                    {selected && (
                      <div className="absolute top-1 right-1">
                        <Check className="w-4 h-4 text-indigo-400" />
                      </div>
                    )}
                    <div className="flex flex-col items-center gap-2">
                      <Clock className={`w-5 h-5 ${selected ? 'text-indigo-400' : isAvailable ? 'text-green-400' : 'text-gray-600'}`} />
                      <span className={`text-sm font-medium ${selected ? 'text-white' : isAvailable ? 'text-gray-200' : 'text-gray-600'}`}>
                        {time}
                      </span>
                      {isAvailable && !selected && (
                        <span className="text-xs text-green-400">Available</span>
                      )}
                      {selected && (
                        <span className="text-xs text-indigo-400">
                          {getUniversityName(selected.universityId)}
                        </span>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {availableSlots.size === 0 && (
              <div className="text-center py-12 text-gray-400">
                <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No available time slots on this date.</p>
                <p className="text-sm mt-1">Try selecting a different date.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* List View - Selected Dates Summary */}
      {viewMode === 'list' && (
        <div className="space-y-6">
          <div className="bg-black/40 rounded-lg p-6 border border-indigo-500/30">
            <h3 className="text-xl font-semibold mb-4 text-indigo-400">
              Selected Interview Dates ({totalDates})
            </h3>
            
            {totalDates === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <div className="text-4xl mb-2">📅</div>
                <p>No interview dates selected yet.</p>
                <p className="text-sm mt-1">Use the calendar view to select available time slots.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {selectedUniversities.map(universityId => {
                  const universityDates = getUniversityDates(universityId);
                  if (universityDates.length === 0) return null;

                  return (
                    <motion.div
                      key={universityId}
                      className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <h4 className="font-semibold text-white mb-3">
                        {getUniversityName(universityId)}
                        <span className="text-sm text-gray-400 ml-2">
                          ({universityDates.length} date{universityDates.length > 1 ? 's' : ''})
                        </span>
                      </h4>
                      
                      <div className="space-y-2">
                        {universityDates.map((date, index) => (
                          <motion.div
                            key={`${date.universityId}-${date.date}-${date.timeSlot}`}
                            className="flex items-center justify-between bg-black/40 rounded p-3 border border-gray-600"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div>
                              <div className="text-white font-medium">
                                {formatDateForDisplay(date.date)}
                              </div>
                              <div className="text-sm text-gray-400">
                                {date.timeSlot}
                              </div>
                            </div>
                            <motion.button
                              onClick={() => onInterviewDateRemove(date.universityId, date.date, date.timeSlot)}
                              className="text-red-400 hover:text-red-300 transition-colors p-1"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </motion.button>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex flex-col items-center gap-4 mt-8">
        <AnimatePresence>
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
              {totalDates > 0 ? 'Continue to Contact Details' : 'Skip and Continue'}
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
        </AnimatePresence>

        <motion.div 
          className="text-center text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {totalDates === 0 ? (
            <>
              <p>You can schedule interviews now or skip and schedule them later.</p>
              <p className="text-sm mt-1">
                Browse the calendar to see our available time slots (up to {maxDates} interviews).
              </p>
            </>
          ) : (
            <p className="text-sm">
              {totalDates === maxDates ? 'Maximum interviews selected' : `You can add ${maxDates - totalDates} more interview${maxDates - totalDates > 1 ? 's' : ''}`}
            </p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}