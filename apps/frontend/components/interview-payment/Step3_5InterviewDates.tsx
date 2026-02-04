'use client'

import { motion, AnimatePresence } from 'framer-motion';
import React, { useMemo, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Check, Plus, Trash2 } from 'lucide-react';
import { ExtendedPackage } from '../../data/packages';

interface AvailabilitySlot {
  date: string;
  timeSlot: string;
}

interface TutorAvailabilitySlot {
  id: string;
  tutorId: string;
  tutorName?: string;
  date: string;
  hourStart: number;
  hourEnd: number;
}

interface Step3_5InterviewDatesProps {
  mode?: 'checkout' | 'dashboard';
  selectedUniversities?: string[];
  selectedPackage?: ExtendedPackage | null;
  availability?: AvailabilitySlot[];
  onAvailabilityChange?: (availability: AvailabilitySlot[]) => void;
  onProceedToNext?: () => void;
  bookingId?: string;
  tutorAvailability?: TutorAvailabilitySlot[];
  onConfirm?: (selection: {
    scheduledAt: string;
    tutorId?: string;
    availabilitySlotId?: string;
    tutorName?: string;
    availableTutorCount: number;
  }) => void;
}

interface CellKey {
  date: string;
  time: string;
}

interface AvailabilityCalendarProps {
  isDashboard: boolean;
  weekOffset: number;
  weekDays: Date[];
  timeSlots: string[];
  totalSlots: number;
  formatWeekRange: () => string;
  formatDate: (date: Date) => string;
  isPastDate: (date: Date) => boolean;
  isToday: (date: Date) => boolean;
  isCellSelected: (date: Date, time: string) => boolean;
  getDateSlotCount: (date: Date) => number;
  getCellAvailabilityCount: (date: Date, time: string) => number;
  isCellAvailable: (date: Date, time: string) => boolean;
  onCellClick: (date: Date, time: string) => void;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onThisWeek: () => void;
  onSelectAllWeek: () => void;
  onClearAll: () => void;
  showBulkActions: boolean;
}

function AvailabilityCalendar({
  isDashboard,
  weekOffset,
  weekDays,
  timeSlots,
  totalSlots,
  formatWeekRange,
  formatDate,
  isPastDate,
  isToday,
  isCellSelected,
  getDateSlotCount,
  getCellAvailabilityCount,
  isCellAvailable,
  onCellClick,
  onPreviousWeek,
  onNextWeek,
  onThisWeek,
  onSelectAllWeek,
  onClearAll,
  showBulkActions,
}: AvailabilityCalendarProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState<'select' | 'deselect'>('select');
  const [hoveredCell, setHoveredCell] = useState<CellKey | null>(null);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => document.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  const handleMouseDown = (date: Date, time: string) => {
    if (isDashboard) {
      onCellClick(date, time);
      return;
    }
    if (isPastDate(date)) return;

    const isSelected = isCellSelected(date, time);
    setIsDragging(true);
    setDragMode(isSelected ? 'deselect' : 'select');
    onCellClick(date, time);
  };

  const handleMouseEnter = (date: Date, time: string) => {
    if (isDashboard) return;
    if (!isDragging || isPastDate(date)) return;

    const isSelected = isCellSelected(date, time);

    if (dragMode === 'select' && !isSelected) {
      onCellClick(date, time);
    } else if (dragMode === 'deselect' && isSelected) {
      onCellClick(date, time);
    }
  };

  const containerClass = isDashboard
    ? 'bg-white rounded-xl border border-gray-200 overflow-hidden'
    : 'bg-black/40 rounded-xl border border-indigo-500/30 overflow-hidden';
  const headerClass = isDashboard
    ? 'border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-blue-50 to-white'
    : 'border-b border-indigo-500/30 px-6 py-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10';
  const titleTextClass = isDashboard ? 'text-gray-900' : 'text-white';
  const subtitleClass = isDashboard ? 'text-gray-500' : 'text-gray-400';
  const buttonBaseClass = isDashboard
    ? 'p-2 rounded-lg bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50'
    : 'p-2 rounded-lg bg-black/40 border border-gray-600 hover:border-indigo-500/50 hover:bg-indigo-500/10';
  const buttonDisabledClass = isDashboard
    ? 'disabled:opacity-40 disabled:cursor-not-allowed'
    : 'disabled:opacity-30 disabled:cursor-not-allowed';
  const headerStatClass = isDashboard ? 'text-gray-600' : 'text-gray-400';
  const headerStatEmphasisClass = isDashboard ? 'text-blue-600' : 'text-indigo-400';
  const bulkButtonClass = isDashboard
    ? 'px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 hover:bg-blue-100 text-xs font-medium text-blue-700 transition-all flex items-center gap-1'
    : 'px-3 py-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/50 hover:bg-indigo-500/30 text-xs font-medium text-indigo-300 transition-all flex items-center gap-1';
  const clearButtonClass = isDashboard
    ? 'px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 hover:bg-red-100 text-xs font-medium text-red-600 transition-all flex items-center gap-1'
    : 'px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/50 hover:bg-red-500/30 text-xs font-medium text-red-300 transition-all flex items-center gap-1';
  const timeLabelClass = isDashboard
    ? 'p-3 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200'
    : 'p-3 flex items-center justify-center bg-black/20 rounded-lg border border-gray-700';
  const timeTextClass = isDashboard ? 'text-gray-700' : 'text-gray-300';
  const legendContainerClass = isDashboard
    ? 'border-t border-gray-200 px-6 py-3 bg-gray-50'
    : 'border-t border-indigo-500/30 px-6 py-3 bg-gradient-to-r from-purple-500/5 to-indigo-500/5';
  const legendTextClass = isDashboard ? 'text-gray-500' : 'text-gray-400';
  const selectedLegendClass = isDashboard
    ? 'w-4 h-4 rounded bg-blue-100 border-2 border-blue-400'
    : 'w-4 h-4 rounded bg-gradient-to-br from-indigo-500/40 to-purple-500/40 border-2 border-indigo-400';
  const todayLegendClass = isDashboard
    ? 'w-4 h-4 rounded bg-blue-50 border-2 border-blue-300'
    : 'w-4 h-4 rounded bg-purple-500/20 border-2 border-purple-500';
  const pastLegendClass = isDashboard
    ? 'w-4 h-4 rounded bg-gray-100 border-2 border-gray-300'
    : 'w-4 h-4 rounded bg-gray-800/20 border-2 border-gray-800';

  return (
    <div className={containerClass}>
      <div className={headerClass}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <h3 className={`text-xl font-bold flex items-center gap-2 ${titleTextClass}`}>
              <CalendarIcon className="w-6 h-6" />
              {isDashboard ? 'Select a Time' : 'Select Your Availability'}
            </h3>
            <span className={`text-sm ${subtitleClass}`}>
              {formatWeekRange()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onPreviousWeek}
              disabled={weekOffset === 0}
              className={`${buttonBaseClass} ${buttonDisabledClass} transition-all`}
            >
              <ChevronLeft className={`w-5 h-5 ${isDashboard ? 'text-gray-600' : 'text-gray-300'}`} />
            </button>

            <button
              onClick={onThisWeek}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isDashboard
                  ? 'bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700'
                  : 'bg-black/40 border border-gray-600 hover:border-indigo-500/50 hover:bg-indigo-500/10 text-gray-300'
              }`}
            >
              This Week
            </button>

            <button
              onClick={onNextWeek}
              disabled={weekOffset === 3}
              className={`${buttonBaseClass} ${buttonDisabledClass} transition-all`}
            >
              <ChevronRight className={`w-5 h-5 ${isDashboard ? 'text-gray-600' : 'text-gray-300'}`} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className={`text-sm ${headerStatClass}`}>
            <span className={`font-medium ${headerStatEmphasisClass}`}>{totalSlots} slots</span>{' '}
            {isDashboard ? 'available' : 'selected'}
          </div>

          {showBulkActions && (
            <div className="flex items-center gap-2">
              <button
                onClick={onSelectAllWeek}
                className={bulkButtonClass}
              >
                <Plus className="w-3 h-3" />
                Select All Week
              </button>

              {totalSlots > 0 && (
                <button
                  onClick={onClearAll}
                  className={clearButtonClass}
                >
                  <Trash2 className="w-3 h-3" />
                  Clear All
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="p-4 overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-8 gap-1 mb-1">
              <div className="p-3 text-center">
                <Clock className={`w-5 h-5 mx-auto ${isDashboard ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
              {weekDays.map((day, index) => {
                const isTodayDate = isToday(day);
                const isPast = isPastDate(day);
                const dateSlotCount = getDateSlotCount(day);

                return (
                  <div
                    key={index}
                    className={`p-3 rounded-t-lg text-center border-b-2 ${
                      isDashboard
                        ? isPast
                          ? 'bg-gray-50 border-gray-200'
                          : isTodayDate
                          ? 'bg-blue-50 border-blue-300'
                          : dateSlotCount > 0
                          ? 'bg-emerald-50 border-emerald-200'
                          : 'bg-white border-gray-200'
                        : isPast
                        ? 'bg-gray-800/30 border-gray-700'
                        : isTodayDate
                        ? 'bg-purple-500/20 border-purple-500'
                        : dateSlotCount > 0
                        ? 'bg-green-500/10 border-green-500/50'
                        : 'bg-black/20 border-gray-700'
                    }`}
                  >
                    <div className={`text-xs font-semibold uppercase ${
                      isDashboard
                        ? isPast
                          ? 'text-gray-400'
                          : 'text-gray-500'
                        : isPast
                        ? 'text-gray-600'
                        : 'text-gray-400'
                    }`}>
                      {day.toLocaleDateString('en-GB', { weekday: 'short' })}
                    </div>
                    <div className={`text-lg font-bold ${
                      isDashboard
                        ? isPast
                          ? 'text-gray-400'
                          : isTodayDate
                          ? 'text-blue-600'
                          : 'text-gray-900'
                        : isPast
                        ? 'text-gray-600'
                        : isTodayDate
                        ? 'text-purple-300'
                        : 'text-white'
                    }`}>
                      {day.getDate()}
                    </div>
                    <div className={`text-xs ${isDashboard ? 'text-gray-500' : 'text-gray-500'}`}>
                      {day.toLocaleDateString('en-GB', { month: 'short' })}
                    </div>
                    {dateSlotCount > 0 && !isPast && (
                      <div className="mt-1">
                        <span className={`text-xs font-medium ${isDashboard ? 'text-emerald-600' : 'text-green-400'}`}>
                          {dateSlotCount} slot{dateSlotCount > 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {timeSlots.map((time) => (
              <div key={time} className="grid grid-cols-8 gap-1 mb-1">
                <div className={timeLabelClass}>
                  <span className={`text-sm font-semibold ${timeTextClass}`}>{time}</span>
                </div>

              {weekDays.map((day) => {
                const isPast = isPastDate(day);
                const isSelected = isCellSelected(day, time);
                const cellKey = `${formatDate(day)}-${time}`;
                const isHovered = hoveredCell?.date === formatDate(day) && hoveredCell?.time === time;
                const isAvailable = isCellAvailable(day, time);
                const availabilityCount = getCellAvailabilityCount(day, time);

                  const cellBaseClass = isDashboard
                    ? 'border border-gray-200 bg-white'
                    : 'border-2';

                  return (
                    <motion.button
                      key={cellKey}
                    onMouseDown={() => handleMouseDown(day, time)}
                    onMouseEnter={() => {
                      setHoveredCell({ date: formatDate(day), time });
                      handleMouseEnter(day, time);
                    }}
                    onMouseLeave={() => setHoveredCell(null)}
                    disabled={isPast || (isDashboard && !isAvailable)}
                      className={`
                      p-3 rounded-lg transition-all select-none
                      ${isDashboard ? 'border' : 'border-2'}
                      ${isPast
                        ? isDashboard
                          ? 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-50'
                          : 'bg-gray-800/20 border-gray-800 cursor-not-allowed opacity-40'
                        : isDashboard && !isAvailable
                        ? 'bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed'
                        : isSelected
                        ? isDashboard
                          ? 'bg-blue-600 border-blue-600 shadow-md'
                          : 'bg-gradient-to-br from-indigo-500/40 to-purple-500/40 border-indigo-400 shadow-md'
                        : isHovered && isDragging
                        ? isDashboard
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-indigo-500/20 border-indigo-500/50'
                        : isDashboard
                        ? 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer'
                        : 'bg-black/40 border-gray-700 hover:border-indigo-500/50 hover:bg-indigo-500/10 cursor-pointer'
                      }
                    `}
                    whileHover={!isPast && (!isDashboard || isAvailable) ? { scale: 1.05 } : {}}
                    whileTap={!isPast && (!isDashboard || isAvailable) ? { scale: 0.95 } : {}}
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
                    {!isSelected && !isPast && (!isDashboard || isAvailable) && (
                      <div className="text-[10px] text-gray-400">
                        Available
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className={legendContainerClass}>
        <div className={`flex items-center justify-between text-xs ${legendTextClass}`}>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={selectedLegendClass} />
              <span>Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={todayLegendClass} />
              <span>Today</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={pastLegendClass} />
              <span>Past</span>
            </div>
          </div>
          <div className={isDashboard ? 'text-gray-500' : 'text-gray-500'}>
            {isDashboard ? '💡 Select a highlighted slot to confirm or request' : '💡 Click and drag to select multiple slots at once'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Step3_5InterviewDates({
  mode = 'checkout',
  selectedUniversities,
  selectedPackage,
  availability,
  onAvailabilityChange,
  onProceedToNext,
  bookingId,
  tutorAvailability,
  onConfirm
}: Step3_5InterviewDatesProps) {
  const isDashboard = mode === 'dashboard';
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedCell, setSelectedCell] = useState<CellKey | null>(null);

  // Time slots for the grid (9 AM to 8 PM)
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00',
    '17:00', '18:00', '19:00', '20:00'
  ];

  const selectedAvailability = useMemo(() => availability || [], [availability]);
  const allTutorAvailability = useMemo(() => tutorAvailability || [], [tutorAvailability]);

  const availabilityByCell = useMemo(() => {
    const map = new Map<string, TutorAvailabilitySlot[]>();
    allTutorAvailability.forEach((slot) => {
      const key = `${slot.date}-${String(slot.hourStart).padStart(2, '0')}:00`;
      const existing = map.get(key) || [];
      existing.push(slot);
      map.set(key, existing);
    });
    return map;
  }, [allTutorAvailability]);

  const totalSlots = isDashboard
    ? availabilityByCell.size
    : selectedAvailability.length;

  if (!isDashboard && (!selectedPackage || !selectedUniversities || selectedUniversities.length === 0)) return null;

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
    if (isDashboard) {
      return !!selectedCell && selectedCell.date === formatDate(date) && selectedCell.time === time;
    }

    const dateStr = formatDate(date);
    const endHour = parseInt(time.split(':')[0]) + 1;
    const timeSlot = `${time} - ${String(endHour).padStart(2, '0')}:00`;

    return selectedAvailability.some(
      slot => slot.date === dateStr && slot.timeSlot === timeSlot
    ) || false;
  };

  // Handle cell click for selection/deselection
  const handleCellClick = (date: Date, time: string) => {
    if (isPastDate(date)) return;

    if (isDashboard) {
      // Allow any time to be selected - students can request any time
      // Even if no tutors are available, we still accept the request
      setSelectedCell({ date: formatDate(date), time });
      return;
    }

    const dateStr = formatDate(date);
    const endHour = parseInt(time.split(':')[0]) + 1;
    const timeSlot = `${time} - ${String(endHour).padStart(2, '0')}:00`;

    const isSelected = isCellSelected(date, time);

    if (isSelected) {
      const updatedAvailability = selectedAvailability.filter(
        slot => !(slot.date === dateStr && slot.timeSlot === timeSlot)
      );
      onAvailabilityChange?.(updatedAvailability);
    } else {
      const newSlot: AvailabilitySlot = { date: dateStr, timeSlot };
      onAvailabilityChange?.([...selectedAvailability, newSlot]);
    }
  };

  const handleClearAll = () => {
    if (confirm('Clear all selected time slots?')) {
      onAvailabilityChange?.([]);
    }
  };

  const handleSelectAllWeek = () => {
    const newSlots: AvailabilitySlot[] = [];

    weekDays.forEach(date => {
      if (!isPastDate(date)) {
        timeSlots.forEach(time => {
          const dateStr = formatDate(date);
          const endHour = parseInt(time.split(':')[0]) + 1;
          const timeSlot = `${time} - ${String(endHour).padStart(2, '0')}:00`;

          const exists = selectedAvailability.some(
            slot => slot.date === dateStr && slot.timeSlot === timeSlot
          );

          if (!exists) {
            newSlots.push({ date: dateStr, timeSlot });
          }
        });
      }
    });

    onAvailabilityChange?.([...selectedAvailability, ...newSlots]);
  };

  const handlePreviousWeek = () => {
    if (weekOffset > 0) {
      setWeekOffset(weekOffset - 1);
    }
  };

  const handleNextWeek = () => {
    if (weekOffset < 3) {
      setWeekOffset(weekOffset + 1);
    }
  };

  const handleThisWeek = () => {
    setWeekOffset(0);
  };

  const handleSkip = () => {
    onAvailabilityChange?.([]);
    onProceedToNext?.();
  };

  const selectedCellKey = selectedCell ? `${selectedCell.date}-${selectedCell.time}` : null;
  const selectedCellSlots = isDashboard && selectedCellKey
    ? availabilityByCell.get(selectedCellKey) || []
    : [];

  const handleConfirmSelection = () => {
    // Allow confirmation even if no tutors are available
    // All requests become pending interviews for Admin/Manager assignment
    if (!selectedCell || !onConfirm) return;
    const scheduledAt = new Date(`${selectedCell.date}T${selectedCell.time}:00`).toISOString();
    
    // Always create a pending request - never auto-assign
    // Tutor assignment is handled by Admins/Managers in the tutor dashboard
    onConfirm({
      scheduledAt,
      tutorId: undefined,
      availabilitySlotId: undefined,
      tutorName: undefined,
      availableTutorCount: selectedCellSlots.length,
    });
  };

  const getDateSlotCount = (date: Date) => {
    // In dashboard mode, count tutors with availability (informational only)
    // All slots are selectable regardless of tutor availability
    return isDashboard
      ? timeSlots.filter((time) => availabilityByCell.has(`${formatDate(date)}-${time}`)).length
      : selectedAvailability.filter(slot => slot.date === formatDate(date)).length;
  };

  const getCellAvailabilityCount = (date: Date, time: string) => {
    if (!isDashboard) return 0;
    const key = `${formatDate(date)}-${time}`;
    return availabilityByCell.get(key)?.length || 0;
  };

  const isCellAvailable = (date: Date, time: string) => {
    // In dashboard mode, allow any future time slot to be selected
    // Students can request any time - tutor matching is handled by Admin/Manager
    if (!isDashboard) return true;
    return true; // All slots are available for selection
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
      {!isDashboard && (
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
      )}

      <AvailabilityCalendar
        isDashboard={isDashboard}
        weekOffset={weekOffset}
        weekDays={weekDays}
        timeSlots={timeSlots}
        totalSlots={totalSlots}
        formatWeekRange={formatWeekRange}
        formatDate={formatDate}
        isPastDate={isPastDate}
        isToday={isToday}
        isCellSelected={isCellSelected}
        getDateSlotCount={getDateSlotCount}
        getCellAvailabilityCount={getCellAvailabilityCount}
        isCellAvailable={isCellAvailable}
        onCellClick={handleCellClick}
        onPreviousWeek={handlePreviousWeek}
        onNextWeek={handleNextWeek}
        onThisWeek={handleThisWeek}
        onSelectAllWeek={handleSelectAllWeek}
        onClearAll={handleClearAll}
        showBulkActions={!isDashboard}
      />

      {isDashboard ? (
        <div className="flex justify-center gap-4 mt-8">
          <motion.button
            key="confirm-button"
            onClick={handleConfirmSelection}
            disabled={!selectedCell}
            className="px-12 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all shadow-xl shadow-indigo-500/25 disabled:opacity-40 disabled:cursor-not-allowed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={selectedCell ? { scale: 1.05 } : {}}
            whileTap={selectedCell ? { scale: 0.98 } : {}}
          >
            Request Time
          </motion.button>
        </div>
      ) : (
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
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(99, 102, 241, 0.4)' }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-white/10 to-purple-600/0"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
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
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </motion.svg>
                </span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
