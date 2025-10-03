"use client";

import React, { useState } from 'react';
import EventCalendar from './EventCalendar';
import ExpandableEventsSidebar from './ExpandableEventsSidebar';

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

interface EventsClientWrapperProps {
  events: Event[];
  conferences: Conference[];
}

const EventsClientWrapper: React.FC<EventsClientWrapperProps> = ({ events, conferences }) => {
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date || undefined);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
      {/* Calendar - Takes up 2/3 of the space */}
      <div className="lg:col-span-2">
        <EventCalendar 
          events={events}
          onDateSelect={handleDateSelect}
          selectedDate={selectedDate}
        />
      </div>
      
      {/* Events Sidebar - Takes up 1/3 of the space */}
      <div className="lg:col-span-1">
        <ExpandableEventsSidebar 
          events={events}
          conferences={conferences}
          selectedDate={selectedDate}
        />
      </div>
    </div>
  );
};

export default EventsClientWrapper;