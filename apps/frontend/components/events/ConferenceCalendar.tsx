"use client";

import React, { useState } from 'react';
import CalendlyPopup from '../CalendlyPopup';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  type: string;
  description: string;
  fullDescription: string;
  benefits: string[];
  spots: number;
  icon: string;
  color: string;
}

interface ConferenceCalendarProps {
  upcomingEvents: Event[];
}

const ConferenceCalendar: React.FC<ConferenceCalendarProps> = ({ upcomingEvents }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [expandedConference, setExpandedConference] = useState<number | null>(null);

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short'
    });
  };

  const getEventsForDate = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return upcomingEvents.filter(event => event.date === dateStr);
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

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 md:h-32 lg:h-36"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const events = getEventsForDate(day);
      const hasEvents = events.length > 0;
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isSelected = selectedDate === dateStr;
      
      days.push(
        <div 
          key={day} 
          className={`relative h-24 md:h-32 lg:h-36 border border-gray-100 p-1 md:p-2 cursor-pointer hover:bg-gray-50 transition-colors ${
            isSelected ? 'bg-blue-50 border-blue-300' : ''
          } ${hasEvents ? 'bg-gradient-to-br from-white to-blue-25' : ''}`}
          onClick={() => setSelectedDate(hasEvents ? dateStr : null)}
        >
          <span className={`text-sm md:text-base font-medium ${
            hasEvents ? 'text-blue-700' : 'text-gray-700'
          } ${isSelected ? 'text-blue-800' : ''}`}>
            {day}
          </span>
          
          {hasEvents && (
            <div className="mt-1 space-y-1">
              {events.slice(0, 2).map((event, idx) => (
                <div key={idx} className={`text-xs p-1 rounded text-white truncate ${
                  event.type === 'pathways' ? 'bg-blue-500' :
                  event.type === 'ucat' ? 'bg-green-500' : 'bg-purple-500'
                }`}>
                  <div className="font-semibold">{event.icon} {event.title.split(' ')[0]}</div>
                  <div className="opacity-90">{event.time.split(' ')[0]}</div>
                </div>
              ))}
              {events.length > 2 && (
                <div className="text-xs text-gray-600">+{events.length - 2} more</div>
              )}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <section id="calendar" className="py-8 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Interactive Conference Calendar</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Click on any conference date to see detailed information and book your spot
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Large Interactive Calendar */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">Conference Calendar</h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigateMonth('prev')}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h4 className="text-xl font-semibold min-w-[180px] text-center">
                    {monthNames[currentMonth]} {currentYear}
                  </h4>
                  <button
                    onClick={() => navigateMonth('next')}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Calendar Grid Header */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                  <div key={day} className="h-12 flex items-center justify-center bg-gray-50 rounded-lg">
                    <span className="text-sm font-semibold text-gray-700">{day.slice(0, 3)}</span>
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {renderCalendar()}
              </div>

              <div className="mt-6 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-gray-600">Pathways Conference</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-gray-600">UCAT Crash Course</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded"></div>
                  <span className="text-gray-600">Interview Conference</span>
                </div>
              </div>
            </div>
          </div>

          {/* Available Conferences Sidebar */}
          <div className="bg-gray-50 rounded-xl shadow-xl border border-gray-200 p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Available Conferences</h3>
            
            {/* Selected Date Details */}
            {selectedDate && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">
                  Selected: {new Date(selectedDate).toLocaleDateString('en-GB', { 
                    weekday: 'long',
                    day: 'numeric', 
                    month: 'long' 
                  })}
                </h4>
                {getEventsForDate(new Date(selectedDate).getDate()).map((event) => (
                  <div key={event.id} className="text-sm text-blue-800">
                    <span className="font-medium">{event.title}</span> - {event.time}
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {upcomingEvents.map((event) => (
                <div key={event.id} className={`border rounded-lg transition-all duration-300 ${event.color} hover:shadow-lg`}>
                  <div 
                    className="p-4 cursor-pointer"
                    onClick={() => setExpandedConference(expandedConference === event.id ? null : event.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{event.icon}</span>
                        <h4 className="font-semibold text-gray-900 text-sm">{event.title}</h4>
                      </div>
                      <span className="text-xs text-gray-500">{formatDate(event.date)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{event.time}</span>
                      <span className="text-green-600 font-medium">{event.spots} spots left</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <svg 
                        className={`w-4 h-4 transition-transform ${expandedConference === event.id ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      <span className="text-xs text-gray-500">Click to expand</span>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {expandedConference === event.id && (
                    <div className="px-4 pb-4 border-t border-gray-200/50 bg-white/50">
                      <div className="pt-4">
                        <p className="text-sm text-gray-700 mb-4">{event.fullDescription}</p>
                        
                        <div className="mb-4">
                          <h5 className="font-semibold text-gray-900 text-sm mb-2">What you'll learn:</h5>
                          <ul className="space-y-1">
                            {event.benefits.map((benefit, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                                <span className="text-green-500 mt-0.5">✓</span>
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <CalendlyPopup 
                          url="https://calendly.com/sri-nextgenmedprep/30min"
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 text-center text-sm"
                          prefill={{
                            name: "Potential Student"
                          }}
                          utm={{
                            utmCampaign: 'conferences-expanded',
                            utmSource: 'website',
                            utmMedium: 'conference-details'
                          }}
                        >
                          Book This Conference
                        </CalendlyPopup>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConferenceCalendar;