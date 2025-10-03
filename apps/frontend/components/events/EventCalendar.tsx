"use client";

import React, { useState } from 'react';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  type: string;
  description: string;
  spots: number;
}

interface EventCalendarProps {
  events: Event[];
  onDateSelect?: (date: string) => void;
  selectedDate?: string;
}

const EventCalendar: React.FC<EventCalendarProps> = ({ events, onDateSelect, selectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const getEventsForDate = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => event.date === dateStr);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const handleDateClick = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (onDateSelect) {
      onDateSelect(dateStr);
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];
    const today = new Date();
    const isCurrentMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear;

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div 
          key={`empty-${i}`} 
          className="h-16 md:h-20 lg:h-24 border border-transparent"
        ></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventsForDate(day);
      const hasEvents = dayEvents.length > 0;
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isSelected = selectedDate === dateStr;
      const isToday = isCurrentMonth && today.getDate() === day;
      const isPastDate = new Date(dateStr) < new Date(today.toDateString());
      
      days.push(
        <div 
          key={day} 
          className={`relative h-16 md:h-20 lg:h-24 flex flex-col items-center justify-center cursor-pointer border-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
            isPastDate 
              ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed hover:scale-100' 
              : hasEvents 
                ? 'hover:bg-blue-50 border-blue-200 hover:border-blue-400 hover:shadow-lg' 
                : 'hover:bg-gray-50 border-gray-200 hover:border-gray-400 hover:shadow-md'
          } ${
            isSelected ? 'bg-blue-100 border-blue-500 shadow-lg scale-105 ring-2 ring-blue-300' : 'border-gray-100'
          } ${
            isToday && !isPastDate ? 'ring-2 ring-orange-400 border-orange-300 bg-orange-50' : ''
          }`}
          onClick={() => !isPastDate && handleDateClick(day)}
        >
          <span className={`text-base md:text-lg lg:text-xl font-semibold mb-1 ${
            isPastDate 
              ? 'text-gray-400' 
              : hasEvents 
                ? 'text-blue-600' 
                : isToday 
                  ? 'text-orange-600' 
                  : 'text-gray-700'
          } ${
            isToday ? 'font-bold' : ''
          } ${
            isSelected ? 'text-blue-700' : ''
          }`}>
            {day}
          </span>
          
          {hasEvents && !isPastDate && (
            <div className="flex flex-wrap gap-1 justify-center max-w-full px-1">
              {dayEvents.slice(0, 4).map((event, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full ${
                    event.type === 'pathways' ? 'bg-blue-500' :
                    event.type === 'ucat' ? 'bg-green-500' :
                    event.type === 'interview' ? 'bg-purple-500' : 'bg-gray-500'
                  }`}
                />
              ))}
              {dayEvents.length > 4 && (
                <span className="text-xs font-medium text-gray-600 ml-1">+{dayEvents.length - 4}</span>
              )}
            </div>
          )}

          {hasEvents && !isPastDate && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {dayEvents.length}
            </div>
          )}

          {isToday && (
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 text-xs font-bold text-orange-600">
              Today
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 h-fit">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Event Calendar</h2>
          <p className="text-gray-600">Click on any date to view events or select a day</p>
        </div>
        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-3 hover:bg-white hover:shadow-md rounded-lg transition-all duration-200 group"
            aria-label="Previous month"
          >
            <svg className="w-6 h-6 text-gray-600 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="text-center">
            <h3 className="text-lg md:text-xl font-bold text-gray-800 min-w-[160px] md:min-w-[180px]">
              {monthNames[currentMonth]} {currentYear}
            </h3>
          </div>
          <button
            onClick={() => navigateMonth('next')}
            className="p-3 hover:bg-white hover:shadow-md rounded-lg transition-all duration-200 group"
            aria-label="Next month"
          >
            <svg className="w-6 h-6 text-gray-600 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Day Labels */}
      <div className="grid grid-cols-7 gap-2 md:gap-3 mb-3">
        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => (
          <div key={day} className="h-10 flex items-center justify-center">
            <span className="text-sm md:text-base font-bold text-gray-600">
              <span className="hidden md:inline">{day}</span>
              <span className="md:hidden">{day.slice(0, 3)}</span>
            </span>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 md:gap-3 mb-6">
        {renderCalendar()}
      </div>

      {/* Legend and Info */}
      <div className="space-y-4">
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm md:text-base">
          <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="font-medium text-blue-700">Pathways to Medicine</span>
          </div>
          <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="font-medium text-green-700">UCAT Crash Course</span>
          </div>
          <div className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-lg">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="font-medium text-purple-700">Interview Prep</span>
          </div>
        </div>

        {selectedDate ? (
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-700 font-semibold">
                  Selected: {new Date(selectedDate).toLocaleDateString('en-GB', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </p>
                <p className="text-blue-600 text-sm mt-1">View events in the sidebar →</p>
              </div>
              <button
                onClick={() => onDateSelect?.('')}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm underline"
              >
                Clear Selection
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600 font-medium">Select any date to filter events</p>
            <p className="text-gray-500 text-sm mt-1">Click on a calendar date to see what's happening that day</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCalendar;