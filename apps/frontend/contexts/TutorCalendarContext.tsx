'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types
interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  type: 'available' | 'interview' | 'blocked';
  title?: string;
  bookingId?: string;
  student?: string;
  package?: string;
}

interface TutorSchedule {
  tutorId: string;
  tutorName: string;
  tutorEmail: string;
  avatar?: string;
  color: string;
  schedule: Record<string, TimeSlot[]>;
  availability: AvailabilitySlot[];
}

interface UnassignedInterview {
  id: string;
  studentName: string;
  studentEmail: string;
  package: string;
  universities: string;
  preferredTime?: string;
  createdAt: string;
}

interface AvailabilitySlot {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

interface TutorCalendarContextType {
  // State
  tutors: TutorSchedule[];
  unassignedInterviews: UnassignedInterview[];
  selectedDate: Date;
  selectedTutor: { tutorId: string; tutorName: string; tutorEmail: string } | null;
  isAvailabilityModalOpen: boolean;

  // Actions
  setSelectedDate: (date: Date) => void;
  assignInterview: (tutorId: string, date: string, time: string, interviewId: string) => void;
  markSlotsAvailable: (slots: { tutorId: string; date: string; time: string }[]) => void;
  openAvailabilityModal: (tutorId?: string) => void;
  closeAvailabilityModal: () => void;
  saveAvailability: (tutorId: string, availability: AvailabilitySlot[]) => void;
}

const TutorCalendarContext = createContext<TutorCalendarContextType | undefined>(undefined);

// Mock data
const initialTutors: TutorSchedule[] = [
  {
    tutorId: 'tutor-1',
    tutorName: 'Dr. Sarah Johnson',
    tutorEmail: 'sarah.johnson@nextgen.com',
    color: '#3B82F6',
    schedule: {
      '2025-11-11': [
        { id: 's1', startTime: '09:00', endTime: '10:00', type: 'available' },
        { id: 's2', startTime: '10:00', endTime: '11:00', type: 'interview', title: 'MMI Mock', student: 'John Smith', package: 'Core Package', bookingId: 'b1' },
        { id: 's3', startTime: '14:00', endTime: '15:00', type: 'available' },
      ],
      '2025-11-12': [
        { id: 's4', startTime: '09:00', endTime: '12:00', type: 'available' },
        { id: 's5', startTime: '15:00', endTime: '16:00', type: 'interview', title: 'Panel Interview', student: 'Emma Wilson', package: 'Premium', bookingId: 'b2' },
      ],
      '2025-11-13': [
        { id: 's6', startTime: '10:00', endTime: '12:00', type: 'available' },
        { id: 's7', startTime: '13:00', endTime: '14:00', type: 'blocked', title: 'Lunch Break' },
        { id: 's8', startTime: '14:00', endTime: '17:00', type: 'available' },
      ],
    },
    availability: [
      { id: 'av1', dayOfWeek: 1, startTime: '09:00', endTime: '12:00' },
      { id: 'av2', dayOfWeek: 1, startTime: '14:00', endTime: '17:00' },
      { id: 'av3', dayOfWeek: 3, startTime: '10:00', endTime: '16:00' },
    ]
  },
  {
    tutorId: 'tutor-2',
    tutorName: 'Prof. Michael Chen',
    tutorEmail: 'michael.chen@nextgen.com',
    color: '#10B981',
    schedule: {
      '2025-11-11': [
        { id: 's9', startTime: '11:00', endTime: '12:00', type: 'interview', title: 'Cambridge Prep', student: 'Oliver Brown', package: 'Essentials', bookingId: 'b3' },
        { id: 's10', startTime: '13:00', endTime: '16:00', type: 'available' },
      ],
      '2025-11-12': [
        { id: 's11', startTime: '09:00', endTime: '11:00', type: 'available' },
        { id: 's12', startTime: '14:00', endTime: '15:00', type: 'interview', title: 'Ethics Discussion', student: 'Sophia Davis', package: 'Core Package', bookingId: 'b4' },
      ],
      '2025-11-14': [
        { id: 's13', startTime: '09:00', endTime: '13:00', type: 'available' },
      ],
    },
    availability: [
      { id: 'av4', dayOfWeek: 1, startTime: '11:00', endTime: '16:00' },
      { id: 'av5', dayOfWeek: 2, startTime: '09:00', endTime: '15:00' },
      { id: 'av6', dayOfWeek: 4, startTime: '09:00', endTime: '13:00' },
    ]
  },
  {
    tutorId: 'tutor-3',
    tutorName: 'Dr. Emily Martinez',
    tutorEmail: 'emily.martinez@nextgen.com',
    color: '#8B5CF6',
    schedule: {
      '2025-11-11': [
        { id: 's14', startTime: '10:00', endTime: '13:00', type: 'available' },
      ],
      '2025-11-13': [
        { id: 's15', startTime: '09:00', endTime: '10:00', type: 'interview', title: 'Oxford Mock', student: 'James Taylor', package: 'Premium', bookingId: 'b5' },
        { id: 's16', startTime: '11:00', endTime: '14:00', type: 'available' },
      ],
      '2025-11-14': [
        { id: 's17', startTime: '14:00', endTime: '18:00', type: 'available' },
      ],
    },
    availability: [
      { id: 'av7', dayOfWeek: 1, startTime: '10:00', endTime: '13:00' },
      { id: 'av8', dayOfWeek: 3, startTime: '09:00', endTime: '14:00' },
      { id: 'av9', dayOfWeek: 4, startTime: '14:00', endTime: '18:00' },
    ]
  }
];

const initialUnassignedInterviews: UnassignedInterview[] = [
  {
    id: 'unassigned-1',
    studentName: 'Alice Thompson',
    studentEmail: 'alice.thompson@email.com',
    package: 'Core Package',
    universities: 'Cambridge, Oxford',
    preferredTime: 'Weekday mornings',
    createdAt: '2025-11-10T10:00:00Z'
  },
  {
    id: 'unassigned-2',
    studentName: 'Ben Anderson',
    studentEmail: 'ben.anderson@email.com',
    package: 'Premium Package',
    universities: 'Imperial, UCL, Kings',
    preferredTime: 'Afternoons',
    createdAt: '2025-11-09T14:30:00Z'
  },
  {
    id: 'unassigned-3',
    studentName: 'Charlotte Lee',
    studentEmail: 'charlotte.lee@email.com',
    package: 'Essentials',
    universities: 'Edinburgh, Manchester',
    createdAt: '2025-11-08T16:45:00Z'
  }
];

export const TutorCalendarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tutors, setTutors] = useState<TutorSchedule[]>(initialTutors);
  const [unassignedInterviews, setUnassignedInterviews] = useState<UnassignedInterview[]>(initialUnassignedInterviews);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTutor, setSelectedTutor] = useState<{ tutorId: string; tutorName: string; tutorEmail: string } | null>(null);
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);

  const assignInterview = (tutorId: string, date: string, time: string, interviewId: string) => {
    // Find the unassigned interview
    const interview = unassignedInterviews.find(i => i.id === interviewId);
    if (!interview) return;

    // Update tutors state - add the interview to the tutor's schedule
    setTutors(prevTutors => 
      prevTutors.map(tutor => {
        if (tutor.tutorId === tutorId) {
          const updatedSchedule = { ...tutor.schedule };
          const daySlots = updatedSchedule[date] || [];
          
          // Create new interview slot
          const newSlot: TimeSlot = {
            id: `slot-${Date.now()}`,
            startTime: time,
            endTime: `${parseInt(time.split(':')[0]) + 1}:00`,
            type: 'interview',
            title: `${interview.package} Interview`,
            student: interview.studentName,
            package: interview.package,
            bookingId: interview.id
          };

          // Add to schedule, replacing any existing slot at that time
          const filteredSlots = daySlots.filter(slot => slot.startTime !== time);
          updatedSchedule[date] = [...filteredSlots, newSlot].sort((a, b) => 
            a.startTime.localeCompare(b.startTime)
          );

          return {
            ...tutor,
            schedule: updatedSchedule
          };
        }
        return tutor;
      })
    );

    // Remove from unassigned interviews
    setUnassignedInterviews(prev => prev.filter(i => i.id !== interviewId));

    console.log(`Assigned ${interview.studentName} to ${tutorId} on ${date} at ${time}`);
  };

  const markSlotsAvailable = (slots: { tutorId: string; date: string; time: string }[]) => {
    setTutors(prevTutors => 
      prevTutors.map(tutor => {
        // Find slots for this tutor
        const tutorSlots = slots.filter(s => s.tutorId === tutor.tutorId);
        if (tutorSlots.length === 0) return tutor;

        const updatedSchedule = { ...tutor.schedule };
        
        tutorSlots.forEach(({ date, time }) => {
          const daySlots = updatedSchedule[date] || [];
          
          // Remove any existing slot at this time
          const filteredSlots = daySlots.filter(slot => slot.startTime !== time);
          
          // Add new available slot
          const newSlot: TimeSlot = {
            id: `slot-${Date.now()}-${time}`,
            startTime: time,
            endTime: `${parseInt(time.split(':')[0]) + 1}:00`,
            type: 'available'
          };
          
          updatedSchedule[date] = [...filteredSlots, newSlot].sort((a, b) => 
            a.startTime.localeCompare(b.startTime)
          );
        });

        return {
          ...tutor,
          schedule: updatedSchedule
        };
      })
    );

    console.log('Marked slots as available:', slots);
    alert(`✓ Marked ${slots.length} slot(s) as available`);
  };

  const openAvailabilityModal = (tutorId?: string) => {
    const targetTutorId = tutorId || tutors[0]?.tutorId;
    const tutor = tutors.find(t => t.tutorId === targetTutorId);
    
    if (tutor) {
      setSelectedTutor({
        tutorId: tutor.tutorId,
        tutorName: tutor.tutorName,
        tutorEmail: tutor.tutorEmail
      });
      setIsAvailabilityModalOpen(true);
    }
  };

  const closeAvailabilityModal = () => {
    setIsAvailabilityModalOpen(false);
    setSelectedTutor(null);
  };

  const saveAvailability = (tutorId: string, availability: AvailabilitySlot[]) => {
    console.log('Saving availability for', tutorId, availability);
    // Update tutor's availability in state
    setTutors(prevTutors =>
      prevTutors.map(tutor =>
        tutor.tutorId === tutorId
          ? { ...tutor, availability }
          : tutor
      )
    );
    alert(`✓ Saved availability for ${tutors.find(t => t.tutorId === tutorId)?.tutorName}`);
    // In production, this would also update the backend
  };

  const value: TutorCalendarContextType = {
    tutors,
    unassignedInterviews,
    selectedDate,
    selectedTutor,
    isAvailabilityModalOpen,
    setSelectedDate,
    assignInterview,
    markSlotsAvailable,
    openAvailabilityModal,
    closeAvailabilityModal,
    saveAvailability,
  };

  return (
    <TutorCalendarContext.Provider value={value}>
      {children}
    </TutorCalendarContext.Provider>
  );
};

export const useTutorCalendar = () => {
  const context = useContext(TutorCalendarContext);
  if (context === undefined) {
    throw new Error('useTutorCalendar must be used within a TutorCalendarProvider');
  }
  return context;
};
