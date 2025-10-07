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
          className="h-20 md:h-24 lg:h-28 rounded-2xl bg-slate-50/30"
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
          className={`relative h-20 md:h-24 lg:h-28 flex flex-col items-center justify-center cursor-pointer rounded-2xl transition-all duration-300 transform backdrop-blur-sm border ${
            isPastDate 
              ? 'bg-slate-100/50 border-slate-200 text-slate-400 cursor-not-allowed opacity-60' 
              : hasEvents 
                ? 'hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 border-blue-200/50 hover:border-blue-300 hover:shadow-xl hover:scale-105 bg-white/80' 
                : 'hover:bg-gradient-to-br hover:from-white hover:to-slate-50 border-slate-200/50 hover:border-slate-300 hover:shadow-lg hover:scale-102 bg-white/60'
          } ${
            isSelected ? 'bg-gradient-to-br from-blue-100 to-purple-100 border-blue-400 shadow-xl scale-105 ring-2 ring-blue-400/30' : 'border-slate-200/50'
          } ${
            isToday && !isPastDate ? 'ring-2 ring-amber-400/50 border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg' : ''
          }`}
          onClick={() => !isPastDate && handleDateClick(day)}
        >
          <span className={`text-lg md:text-xl lg:text-2xl font-bold mb-1 ${
            isPastDate 
              ? 'text-slate-400' 
              : hasEvents 
                ? 'text-blue-600 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent' 
                : isToday 
                  ? 'text-amber-600 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent' 
                  : 'text-slate-700'
          } ${
            isToday ? 'font-extrabold' : ''
          } ${
            isSelected ? 'bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent' : ''
          }`}>
            {day}
          </span>
          
          {hasEvents && !isPastDate && (
            <div className="flex flex-wrap gap-1.5 justify-center max-w-full px-2">
              {dayEvents.slice(0, 3).map((event, idx) => (
                <div
                  key={idx}
                  className={`w-3 h-3 rounded-full shadow-sm ${
                    event.type === 'pathways' ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                    event.type === 'ucat' ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' :
                    event.type === 'interview' ? 'bg-gradient-to-r from-purple-400 to-purple-600' : 'bg-gradient-to-r from-slate-400 to-slate-600'
                  }`}
                />
              ))}
              {dayEvents.length > 3 && (
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-slate-400 to-slate-600 flex items-center justify-center">
                  <span className="text-white text-xs font-bold leading-none">+</span>
                </div>
              )}
            </div>
          )}

          {hasEvents && !isPastDate && (
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg border-2 border-white">
              {dayEvents.length}
            </div>
          )}

          {isToday && (
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg border border-white">
              Today
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="bg-gradient-to-br from-white via-slate-50 to-blue-50/30 rounded-3xl shadow-2xl border border-slate-200/50 backdrop-blur-sm p-6 md:p-8 h-fit">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-3">
            Event Calendar
          </h2>
          <p className="text-slate-600 font-medium">Discover upcoming events and book your sessions</p>
        </div>
        <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/50">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-3 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white rounded-xl transition-all duration-300 group hover:shadow-lg hover:scale-105"
            aria-label="Previous month"
          >
            <svg className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="text-center px-2">
            <h3 className="text-lg md:text-xl font-bold text-slate-700 min-w-[160px] md:min-w-[180px] bg-gradient-to-r from-slate-700 to-slate-800 bg-clip-text text-transparent">
              {monthNames[currentMonth]} {currentYear}
            </h3>
          </div>
          <button
            onClick={() => navigateMonth('next')}
            className="p-3 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white rounded-xl transition-all duration-300 group hover:shadow-lg hover:scale-105"
            aria-label="Next month"
          >
            <svg className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Day Labels */}
      <div className="grid grid-cols-7 gap-2 md:gap-3 mb-4">
        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => (
          <div key={day} className="h-12 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200/50 rounded-xl border border-slate-200/50">
            <span className="text-sm md:text-base font-bold text-slate-700 tracking-wide">
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