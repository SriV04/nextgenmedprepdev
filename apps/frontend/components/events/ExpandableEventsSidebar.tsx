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

interface Conference {
  id: number;
  title: string;
  audience: string;
  description: string;
  details?: string;
  benefits: string[];
  successRate?: string;
  additionalInfo?: string[];
  cta?: string;
  color: string;
  icon: string;
  type: string;
}

interface ExpandableEventsSidebarProps {
  events: Event[];
  conferences: Conference[];
  selectedDate?: string;
}

const ExpandableEventsSidebar: React.FC<ExpandableEventsSidebarProps> = ({ 
  events, 
  conferences, 
  selectedDate 
}) => {
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getConferenceDetails = (eventType: string) => {
    return conferences.find(conf => conf.type === eventType);
  };

  const getEventsForSelectedDate = () => {
    if (!selectedDate) return events;
    return events.filter(event => event.date === selectedDate);
  };

  const filteredEvents = getEventsForSelectedDate();
  const displayTitle = selectedDate ? 
    `Events on ${formatDate(selectedDate)}` : 
    'Past Events';

  const toggleExpand = (eventId: number) => {
    setExpandedEvent(expandedEvent === eventId ? null : eventId);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">{displayTitle}</h2>
        {selectedDate && (
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium bg-blue-50 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors"
          >
            View All Events
          </button>
        )}
      </div>
      
      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No events scheduled for this date</p>
          </div>
        ) : (
          filteredEvents.map((event) => {
            const isExpanded = expandedEvent === event.id;
            const conferenceDetails = getConferenceDetails(event.type);
            
            return (
              <div 
                key={event.id} 
                className={`border-2 rounded-lg transition-all duration-300 ${
                  isExpanded ? 'border-blue-300 shadow-md' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {/* Event Header */}
                <div 
                  className="p-4 cursor-pointer"
                  onClick={() => toggleExpand(event.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">
                          {event.type === 'pathways' ? '🎯' : 
                           event.type === 'ucat' ? '📚' : 
                           event.type === 'interview' ? '🎤' : '🎓'}
                        </span>
                        <h3 className="font-semibold text-gray-900 text-sm md:text-base">
                          {event.title}
                        </h3>
                      </div>
                      <p className="text-xs md:text-sm text-gray-600 mb-2">{event.description}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs md:text-sm gap-2">
                        <span className="text-gray-500">{formatDate(event.date)} • {event.time}</span>
                        <span className="text-green-600 font-medium">{event.spots} spots left</span>
                      </div>
                    </div>
                    <button className="ml-2 p-1 hover:bg-gray-100 rounded">
                      <svg 
                        className={`w-5 h-5 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180' : ''
                        }`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && conferenceDetails && (
                  <div className="px-4 pb-4 border-t border-gray-100">
                    <div className="pt-4 space-y-4">
                      {/* Conference Description */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">
                          About This Conference
                        </h4>
                        <p className="text-gray-700 text-sm mb-2">{conferenceDetails.description}</p>
                        {conferenceDetails.details && (
                          <p className="text-gray-700 text-sm">{conferenceDetails.details}</p>
                        )}
                      </div>

                      {/* Audience */}
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="font-semibold text-blue-900 text-sm">{conferenceDetails.audience}</p>
                      </div>

                      {/* Benefits */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 text-sm md:text-base">
                          What You'll Learn:
                        </h4>
                        <ul className="space-y-2">
                          {conferenceDetails.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-gray-600 text-sm">
                              <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Success Rate */}
                      {conferenceDetails.successRate && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <p className="text-green-800 font-semibold text-sm">
                            {conferenceDetails.successRate}
                          </p>
                        </div>
                      )}

                      {/* Additional Info */}
                      {conferenceDetails.additionalInfo && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 text-sm md:text-base">
                            Additional Benefits:
                          </h4>
                          <ul className="space-y-2">
                            {conferenceDetails.additionalInfo.map((info, idx) => (
                              <li key={idx} className="text-gray-600 text-sm flex items-start gap-2">
                                <span className="text-blue-500 mt-0.5 flex-shrink-0">•</span>
                                <span>{info}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* CTA */}
                      {conferenceDetails.cta && (
                        <div className="bg-white p-3 rounded-lg border-l-4 border-blue-500">
                          <p className="font-semibold text-gray-900 text-sm">{conferenceDetails.cta}</p>
                        </div>
                      )}

                      {/* Book Conference Button */}
                      <div className="pt-4 border-t border-gray-100">
                        <button
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 text-center text-sm md:text-base"
                          onClick={() => window.location.href = `/event-pay`}
                        >
                          Book This Conference
                        </button>
                        <p className="text-xs text-gray-500 text-center mt-2">
                          Secure your spot • {event.spots} places remaining
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

export default ExpandableEventsSidebar;