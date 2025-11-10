'use client'

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { universities } from '@/data/universities';
import { ExtendedPackage } from '../../data/packages';
import { InterviewDate } from '../../app/interviews/payment/hooks/usePaymentForm';
import { 
  getUniversityInterviewDates, 
  getStandardTimeSlots, 
  formatDateForDisplay 
} from '@/utils/interviewDateUtils';

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
  const [selectedUniversity, setSelectedUniversity] = useState<string>(selectedUniversities[0] || '');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [showDatePicker, setShowDatePicker] = useState<string>(''); // University ID for which to show date picker
  
  useEffect(() => {
    if (selectedUniversities.length > 0 && !selectedUniversity) {
      setSelectedUniversity(selectedUniversities[0]);
    }
  }, [selectedUniversities, selectedUniversity]);

  if (!selectedPackage || selectedUniversities.length === 0) return null;

  const availableDates = getUniversityInterviewDates(selectedUniversity);
  const timeSlots = getStandardTimeSlots();
  const totalDates = getTotalDateCount();
  const maxDates = selectedPackage.interviews;

  const getUniversityName = (id: string) => {
    const university = universities.find(uni => uni.id === id);
    return university?.displayName || university?.name || '';
  };

  const handleAddDate = () => {
    if (!selectedDate || !selectedTimeSlot || !selectedUniversity) {
      return;
    }

    // Check if this exact date/time/university combination already exists
    const existingDate = interviewDates.find(
      date => date.universityId === selectedUniversity && 
              date.date === selectedDate && 
              date.timeSlot === selectedTimeSlot
    );

    if (existingDate) {
      alert('This date and time slot is already selected for this university.');
      return;
    }

    const success = onInterviewDateAdd(selectedUniversity, selectedDate, selectedTimeSlot);
    if (success) {
      setSelectedDate('');
      setSelectedTimeSlot('');
    } else {
      alert(`Maximum of ${maxDates} interview dates allowed.`);
    }
  };

  const getUniversityDates = (universityId: string): InterviewDate[] => {
    return interviewDates.filter(date => date.universityId === universityId);
  };

  const isDateTimeSlotTaken = (universityId: string, date: string, timeSlot: string): boolean => {
    return interviewDates.some(
      d => d.universityId === universityId && d.date === date && d.timeSlot === timeSlot
    );
  };

  return (
    <motion.div
      key="step3_5"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Schedule <span className="text-gradient-aurora">Interview Dates</span>
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-4">
          Select interview dates for your chosen universities
        </p>
        <div className="text-lg text-indigo-300">
          {totalDates} of {maxDates} interview dates selected
        </div>
      </div>

      {/* Progress Indicator */}
      <motion.div 
        className="mb-8 bg-black/40 rounded-lg p-4 border border-indigo-500/30"
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
            ✓ You can proceed with {totalDates} date{totalDates > 1 ? 's' : ''}, or add more up to {maxDates}.
          </motion.p>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Date Selection */}
        <div className="space-y-6">
          <div className="bg-black/40 rounded-lg p-6 border border-indigo-500/30">
            <h3 className="text-xl font-semibold mb-4 text-indigo-400">Add Interview Date</h3>
            
            {/* University Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                University
              </label>
              <select
                value={selectedUniversity}
                onChange={(e) => setSelectedUniversity(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
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

            {/* Date Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Date
              </label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              >
                <option value="">Select a date</option>
                {availableDates.slice(0, 30).map(date => ( // Show first 30 dates
                  <option key={date} value={date}>
                    {formatDateForDisplay(date)}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Slot Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Time Slot
              </label>
              <select
                value={selectedTimeSlot}
                onChange={(e) => setSelectedTimeSlot(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                disabled={!selectedDate}
              >
                <option value="">Select a time slot</option>
                {timeSlots.map(timeSlot => {
                  const isTaken = selectedDate && isDateTimeSlotTaken(selectedUniversity, selectedDate, timeSlot);
                  return (
                    <option 
                      key={timeSlot} 
                      value={timeSlot}
                      disabled={isTaken}
                    >
                      {timeSlot} {isTaken ? '(Already selected)' : ''}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Add Button */}
            <motion.button
              onClick={handleAddDate}
              disabled={!selectedDate || !selectedTimeSlot || !canAddDateForUniversity(selectedUniversity)}
              className={`w-full py-3 rounded-lg font-semibold transition-all ${
                selectedDate && selectedTimeSlot && canAddDateForUniversity(selectedUniversity)
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 shadow-lg shadow-indigo-500/25'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
              whileHover={selectedDate && selectedTimeSlot && canAddDateForUniversity(selectedUniversity) ? { scale: 1.02 } : {}}
              whileTap={selectedDate && selectedTimeSlot && canAddDateForUniversity(selectedUniversity) ? { scale: 0.98 } : {}}
            >
              {totalDates >= maxDates ? 'Maximum Dates Reached' : 'Add Interview Date'}
            </motion.button>

            {totalDates >= maxDates && (
              <p className="text-xs text-amber-400 mt-2 text-center">
                You've selected the maximum number of interview dates for your package.
              </p>
            )}
          </div>
        </div>

        {/* Right: Selected Dates Summary */}
        <div className="space-y-6">
          <div className="bg-black/40 rounded-lg p-6 border border-indigo-500/30">
            <h3 className="text-xl font-semibold mb-4 text-indigo-400">
              Selected Interview Dates ({totalDates})
            </h3>
            
            {totalDates === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <div className="text-4xl mb-2">📅</div>
                <p>No interview dates selected yet.</p>
                <p className="text-sm mt-1">Add dates using the form on the left.</p>
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
      </div>

      {/* Navigation */}
      <div className="flex justify-center">
        <AnimatePresence>
          {totalDates > 0 && (
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
                Continue to Contact Details
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

      {totalDates === 0 && (
        <motion.div 
          className="text-center text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p>Please select at least one interview date to continue.</p>
          <p className="text-sm mt-1">
            You can select up to {maxDates} interview dates total across all your chosen universities.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}