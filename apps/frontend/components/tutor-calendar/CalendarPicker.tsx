import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarPickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  minDate?: Date;
  className?: string;
}

export const CalendarPicker: React.FC<CalendarPickerProps> = ({ 
  selectedDate, 
  onDateChange,
  minDate,
  className = ''
}) => {
  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();

  const handleMonthChange = (offset: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + offset);
    onDateChange(newDate);
  };

  const handleDateSelect = (year: number, month: number, day: number) => {
    const newDate = new Date(year, month, day);
    
    // Check if date is before minDate
    if (minDate && newDate < minDate) {
      return;
    }
    
    onDateChange(newDate);
  };

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

  const isDateDisabled = (day: number | null): boolean => {
    if (!day || !minDate) return false;
    
    const date = new Date(currentYear, currentMonth, day);
    return date < minDate;
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-xl p-4 ${className}`}>
      {/* Month/Year Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => handleMonthChange(-1)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          type="button"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="text-sm font-semibold text-gray-900">
          {selectedDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
        </div>
        <button
          onClick={() => handleMonthChange(1)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          type="button"
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
          const isDisabled = isDateDisabled(day);
          
          return (
            <button
              key={index}
              onClick={() => day && !isDisabled && handleDateSelect(currentYear, currentMonth, day)}
              disabled={!day || isDisabled}
              type="button"
              className={`
                h-8 flex items-center justify-center text-sm rounded transition-colors
                ${!day ? 'invisible' : ''}
                ${isDisabled ? 'text-gray-300 cursor-not-allowed' : ''}
                ${isSelected && !isDisabled ? 'bg-blue-600 text-white font-semibold' : ''}
                ${isToday && !isSelected && !isDisabled ? 'bg-blue-100 text-blue-600 font-semibold' : ''}
                ${!isSelected && !isToday && day && !isDisabled ? 'hover:bg-gray-100 text-gray-700' : ''}
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
          onClick={() => onDateChange(new Date())}
          type="button"
          className="flex-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors font-medium"
        >
          Today
        </button>
      </div>
    </div>
  );
};
