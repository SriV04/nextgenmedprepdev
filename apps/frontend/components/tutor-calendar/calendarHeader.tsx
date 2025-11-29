import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Plus } from 'lucide-react';
import { useTutorCalendar } from '../../contexts/TutorCalendarContext';
import { formatDate, formatDateHeader } from './utils/calendarUtils';

interface CalendarHeaderProps {
  onCreateInterview: () => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({ onCreateInterview }) => {
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

  return (
    <div className="border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {formatDateHeader(selectedDate)}
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDayChange(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Previous day"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => setSelectedDate(new Date())}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => handleDayChange(1)}
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
            onClick={onCreateInterview}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            Create Interview
          </button>
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
            {(isInterviewDetailsModalOpen && selectedInterviewDetails?.studentAvailability?.length) && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded"></div>
                  <span className="text-xs text-gray-600">Student Available</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-200 border-2 border-green-400 rounded"></div>
                  <span className="text-xs text-gray-600">Tutor & Student Match</span>
                </div>
              </div>
            )}
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
  );
};