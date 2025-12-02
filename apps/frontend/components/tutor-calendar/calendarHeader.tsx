import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Plus } from 'lucide-react';
import { useTutorCalendar } from '../../contexts/TutorCalendarContext';
import { formatDate, formatDateHeader } from './utils/calendarUtils';

interface CalendarHeaderProps {
  onCreateInterview: () => void;
  isAdmin?: boolean;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({ onCreateInterview, isAdmin = false }) => {
  const { 
    selectedDate, 
    setSelectedDate, 
    openAvailabilityModal,
    selectedInterviewDetails,
    isInterviewDetailsModalOpen
  } = useTutorCalendar();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDayChange = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const handleCalendarDateChange = (year: number, month: number, day: number) => {
    const newDate = new Date(year, month, day);
    setSelectedDate(newDate);
    setShowDatePicker(false);
  };

  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();

  // Generate calendar grid for current month
  const generateCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  return (
    <div className="border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4 relative">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
        <div className="flex items-center justify-between lg:justify-start gap-3 sm:gap-4 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 whitespace-nowrap min-w-[200px] sm:min-w-[300px]">
            {formatDateHeader(selectedDate)}
          </h3>
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <button
              onClick={() => handleDayChange(-1)}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              title="Previous day"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>
            <button
              onClick={() => setSelectedDate(new Date())}
              className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors whitespace-nowrap flex-shrink-0 min-w-[60px]"
            >
              Today
            </button>
            <button
              onClick={() => handleDayChange(1)}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              title="Next day"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors ml-1 sm:ml-2 flex-shrink-0"
              title="Select date"
            >
              <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>
          </div>
        </div>
        
        {/* Legend and Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 lg:gap-4">
          <div className="flex gap-2 sm:gap-3">
            {isAdmin && (
              <button
                onClick={onCreateInterview}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-xs sm:text-sm"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Create Interview</span>
                <span className="sm:hidden">Create</span>
              </button>
            )}
            <button
              onClick={() => openAvailabilityModal()}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-xs sm:text-sm"
            >
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Manage Availability</span>
              <span className="sm:hidden">Availability</span>
            </button>
          </div>
          <div className="hidden xl:flex items-center gap-2 text-xs sm:text-sm flex-wrap">
            <div className="flex items-center gap-1 whitespace-nowrap">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-100 border border-green-300 rounded"></div>
              <span className="text-gray-600">Available</span>
            </div>
            <div className="flex items-center gap-1 whitespace-nowrap">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-100 border border-blue-300 rounded"></div>
              <span className="text-gray-600">Interview</span>
            </div>
            <div className="flex items-center gap-1 whitespace-nowrap">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-100 border border-gray-300 rounded"></div>
              <span className="text-gray-600">Blocked</span>
            </div>
            {(isInterviewDetailsModalOpen && selectedInterviewDetails?.studentAvailability?.length) && (
              <>
                <div className="flex items-center gap-1 whitespace-nowrap">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-100 border border-yellow-300 rounded"></div>
                  <span className="text-gray-600">Student Avail</span>
                </div>
                <div className="flex items-center gap-1 whitespace-nowrap">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-200 border-2 border-green-400 rounded"></div>
                  <span className="text-gray-600">Match</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Calendar Picker Dropdown */}
      {showDatePicker && (
        <div className="absolute mt-2 bg-white border border-gray-200 rounded-lg shadow-xl p-4 z-50 min-w-[280px]">
          {/* Month/Year Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setMonth(newDate.getMonth() - 1);
                setSelectedDate(newDate);
              }}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="text-sm font-semibold text-gray-900">
              {selectedDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
            </div>
            <button
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setMonth(newDate.getMonth() + 1);
                setSelectedDate(newDate);
              }}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {generateCalendarDays().map((day, index) => {
              const isToday = day === new Date().getDate() && 
                             currentMonth === new Date().getMonth() && 
                             currentYear === new Date().getFullYear();
              const isSelected = day === selectedDate.getDate() && 
                                currentMonth === selectedDate.getMonth() && 
                                currentYear === selectedDate.getFullYear();
              
              return (
                <button
                  key={index}
                  onClick={() => day && handleCalendarDateChange(currentYear, currentMonth, day)}
                  disabled={!day}
                  className={`
                    h-8 flex items-center justify-center text-sm rounded transition-colors
                    ${!day ? 'invisible' : ''}
                    ${isSelected ? 'bg-blue-600 text-white font-semibold' : ''}
                    ${isToday && !isSelected ? 'bg-blue-100 text-blue-600 font-semibold' : ''}
                    ${!isSelected && !isToday && day ? 'hover:bg-gray-100 text-gray-700' : ''}
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="mt-4 pt-3 border-t border-gray-200 flex gap-2">
            <button
              onClick={() => {
                setSelectedDate(new Date());
                setShowDatePicker(false);
              }}
              className="flex-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors font-medium"
            >
              Today
            </button>
            <button
              onClick={() => setShowDatePicker(false)}
              className="flex-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};