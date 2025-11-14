'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  type: 'available' | 'interview' | 'blocked';
  title?: string;
  bookingId?: string;
  interviewId?: string;
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
  loading: boolean;
  error: string | null;

  // Actions
  setSelectedDate: (date: Date) => void;
  assignInterview: (tutorId: string, date: string, time: string, interviewId: string) => Promise<void>;
  markSlotsAvailable: (slots: { tutorId: string; date: string; time: string }[]) => Promise<void>;
  openAvailabilityModal: (tutorId?: string) => void;
  closeAvailabilityModal: () => void;
  saveAvailability: (tutorId: string, availability: AvailabilitySlot[]) => Promise<void>;
  refreshData: () => Promise<void>;
}

const TutorCalendarContext = createContext<TutorCalendarContextType | undefined>(undefined);

// Helper function to generate tutor colors
const getTutorColor = (index: number): string => {
  const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4'];
  return colors[index % colors.length];
};

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
  const [tutors, setTutors] = useState<TutorSchedule[]>([]);
  const [unassignedInterviews, setUnassignedInterviews] = useState<UnassignedInterview[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTutor, setSelectedTutor] = useState<{ tutorId: string; tutorName: string; tutorEmail: string } | null>(null);
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';

  // Fetch data from backend
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Calculate date range (current week)
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 13); // 2 weeks

      const startDate = startOfWeek.toISOString().split('T')[0];
      const endDate = endOfWeek.toISOString().split('T')[0];

      // Fetch tutors with availability
      const tutorsRes = await fetch(
        `${backendUrl}/api/v1/tutors/with-availability?start_date=${startDate}&end_date=${endDate}`
      );
      const tutorsData = await tutorsRes.json();

      if (tutorsData.success) {
        // Transform backend data to frontend format
        const transformedTutors: TutorSchedule[] = tutorsData.data.map((tutor: any, index: number) => {
          const schedule: Record<string, TimeSlot[]> = {};

          // Group availability by date
          tutor.availability?.forEach((slot: any) => {
            const dateStr = slot.date;
            if (!schedule[dateStr]) {
              schedule[dateStr] = [];
            }

            const timeSlot: TimeSlot = {
              id: slot.id,
              startTime: `${String(slot.hour_start).padStart(2, '0')}:00`,
              endTime: `${String(slot.hour_end).padStart(2, '0')}:00`,
              type: slot.type || 'available',
            };

            // Add interview details if exists
            if (slot.interview && slot.interview.booking) {
              timeSlot.interviewId = slot.interview.id;
              timeSlot.title = `${slot.interview.booking.package} Interview`;
              timeSlot.student = slot.interview.booking.email;
              timeSlot.package = slot.interview.booking.package;
              timeSlot.bookingId = slot.interview.booking.id;
            }

            schedule[dateStr].push(timeSlot);
          });

          // Sort slots within each day
          Object.keys(schedule).forEach(date => {
            schedule[date].sort((a, b) => a.startTime.localeCompare(b.startTime));
          });

          return {
            tutorId: tutor.id,
            tutorName: tutor.name,
            tutorEmail: tutor.email,
            color: getTutorColor(index),
            schedule,
            availability: [], // Computed availability patterns if needed
          };
        });

        setTutors(transformedTutors);
      }

      // Fetch unassigned interviews
      const interviewsRes = await fetch(`${backendUrl}/api/v1/interviews/unassigned`);
      const interviewsData = await interviewsRes.json();

      if (interviewsData.success) {
        console.log('Fetched unassigned interviews:', interviewsData.data);
        const transformedInterviews: UnassignedInterview[] = interviewsData.data.map((interview: any) => ({
          id: interview.id,
          studentName: interview.booking?.email?.split('@')[0] || 'Student',
          studentEmail: interview.booking?.email || '',
          package: interview.booking?.package || '',
          universities: interview.university || '',
          preferredTime: interview.booking?.preferred_time,
          createdAt: interview.booking?.created_at || interview.created_at,
        }));

        setUnassignedInterviews(transformedInterviews);
      }
    } catch (err: any) {
      console.error('Error fetching calendar data:', err);
      setError(err.message || 'Failed to load calendar data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const assignInterview = async (tutorId: string, date: string, time: string, interviewId: string) => {
    try {
      // Find the unassigned interview
      const interview = unassignedInterviews.find(i => i.id === interviewId);
      if (!interview) {
        alert('Interview not found');
        return;
      }

      // Find the tutor
      const tutor = tutors.find(t => t.tutorId === tutorId);
      if (!tutor) {
        alert('Tutor not found');
        return;
      }

      // Check if the time slot is available
      const daySlots = tutor.schedule[date] || [];
      const hour = parseInt(time.split(':')[0], 10);
      
      const availableSlot = daySlots.find(slot => {
        const slotHour = parseInt(slot.startTime.split(':')[0], 10);
        return slot.type === 'available' && slotHour === hour;
      });

      if (!availableSlot) {
        alert(`Time slot ${time} is not available for ${tutor.tutorName} on ${date}. Please select an available slot.`);
        return;
      }

      // Create scheduled_at timestamp
      const scheduledAt = `${date}T${time}:00Z`;

      console.log(`Assigning interview ${interviewId} to tutor ${tutorId} at ${scheduledAt}, slot ID: ${availableSlot.id}`);

      // Call backend to assign interview with availability slot ID
      const response = await fetch(`${backendUrl}/api/v1/interviews/${interviewId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tutor_id: tutorId,
          scheduled_at: scheduledAt,
          availability_slot_id: availableSlot.id,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to assign interview');
      }

      // Refresh data to get updated state from database
      await fetchData();

      console.log(`Successfully assigned ${interview.studentName} to ${tutor.tutorName} on ${date} at ${time}`);
      alert(`✓ Interview assigned to ${tutor.tutorName}`);
    } catch (err: any) {
      console.error('Error assigning interview:', err);
      alert(`Failed to assign interview: ${err.message}`);
    }
  };

  const markSlotsAvailable = async (slots: { tutorId: string; date: string; time: string }[]) => {
    try {
      // Group slots by tutor

      const slotsByTutor = slots.reduce((acc, slot) => {
        if (!acc[slot.tutorId]) {
          acc[slot.tutorId] = [];
        }
        acc[slot.tutorId].push(slot);
        return acc;
      }, {} as Record<string, typeof slots>);

      // Add availability for each tutor
      for (const [tutorId, tutorSlots] of Object.entries(slotsByTutor)) {
        const slotsData = tutorSlots.map(({ date, time }) => {
          const hour = parseInt(time.split(':')[0], 10);
          return {
            date,
            hour_start: hour,
            hour_end: hour + 1,
            type: 'available' as const,
          };
        });

        console.log('Marking slots available for tutor:', tutorId, slotsData);

        const response = await fetch(`${backendUrl}/api/v1/tutors/${tutorId}/availability/bulk`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ slots: slotsData }),
        });

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || 'Failed to mark slots as available');
        }
      }

      // Refresh data
      await fetchData();

      console.log('Marked slots as available:', slots);
      alert(`✓ Marked ${slots.length} slot(s) as available`);
    } catch (err: any) {
      console.error('Error marking slots available:', err);
      alert(`Failed to mark slots as available: ${err.message}`);
    }
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

  const saveAvailability = async (tutorId: string, availability: AvailabilitySlot[]) => {
    try {
      console.log('Saving availability for', tutorId, availability);
      
      // Transform availability slots to bulk format
      // This would need to be expanded based on your UI for setting recurring availability
      // For now, this is a placeholder for the pattern
      const tutorName = tutors.find(t => t.tutorId === tutorId)?.tutorName;
      
      // Update local state optimistically
      setTutors(prevTutors =>
        prevTutors.map(tutor =>
          tutor.tutorId === tutorId
            ? { ...tutor, availability }
            : tutor
        )
      );
      
      alert(`✓ Saved availability for ${tutorName}`);
      
      // Note: Backend sync would happen here for recurring patterns
      // The actual slots are created when markSlotsAvailable is called
    } catch (err: any) {
      console.error('Error saving availability:', err);
      alert(`Failed to save availability: ${err.message}`);
    }
  };

  const refreshData = async () => {
    await fetchData();
  };

  const value: TutorCalendarContextType = {
    tutors,
    unassignedInterviews,
    selectedDate,
    selectedTutor,
    isAvailabilityModalOpen,
    loading,
    error,
    setSelectedDate,
    assignInterview,
    markSlotsAvailable,
    openAvailabilityModal,
    closeAvailabilityModal,
    saveAvailability,
    refreshData,
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
