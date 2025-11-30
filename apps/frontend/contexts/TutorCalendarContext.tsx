'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type {
  TutorSchedule,
  UnassignedInterview,
  InterviewDetails,
  AvailabilitySlot,
  PendingChange,
  TutorCalendarContextType,
  TimeSlot,
  StudentAvailabilitySlot,
  TutorInfo,
  BackendTutorData,
  BackendAvailabilitySlot,
  BackendInterviewData,
} from '../types/tutor-calendar';

const TutorCalendarContext = createContext<TutorCalendarContextType | undefined>(undefined);

// Helper function to generate tutor colors
const getTutorColor = (index: number): string => {
  const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4'];
  return colors[index % colors.length];
};

export const TutorCalendarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tutors, setTutors] = useState<TutorSchedule[]>([]);
  const [unassignedInterviews, setUnassignedInterviews] = useState<UnassignedInterview[]>([]);
  const [interviewsDataMap, setInterviewsDataMap] = useState<Map<string, BackendInterviewData>>(new Map());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTutor, setSelectedTutor] = useState<TutorInfo | null>(null);
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const [isInterviewDetailsModalOpen, setIsInterviewDetailsModalOpen] = useState(false);
  const [selectedInterviewDetails, setSelectedInterviewDetails] = useState<InterviewDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingChanges, setPendingChanges] = useState<PendingChange[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';
  const hasPendingChanges = pendingChanges.length > 0;

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
        const transformedTutors: TutorSchedule[] = tutorsData.data.map((tutor: BackendTutorData, index: number) => {
          const schedule: Record<string, TimeSlot[]> = {};

          // Group availability by date
          tutor.availability?.forEach((slot: BackendAvailabilitySlot) => {
            const dateStr = slot.date;
            if (!schedule[dateStr]) {
              schedule[dateStr] = [];
            }

            const timeSlot: TimeSlot = {
              id: slot.id,
              startTime: `${String(slot.hour_start).padStart(2, '0')}:00`,
              endTime: `${String(slot.hour_end).padStart(2, '0')}:00`,
              type: (slot.type as 'available' | 'interview' | 'blocked') || 'available',
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
            availability: [],
          };
        });

        setTutors(transformedTutors);
      }

      // Fetch unassigned interviews
      const interviewsRes = await fetch(`${backendUrl}/api/v1/interviews/unassigned`);
      const interviewsData = await interviewsRes.json();

      if (interviewsData.success) {
        console.log('Fetched unassigned interviews:', interviewsData.data);
        
        // Store full interview data in map for easy lookup
        const dataMap = new Map<string, BackendInterviewData>();
        const transformedInterviews: UnassignedInterview[] = interviewsData.data.map((interview: BackendInterviewData) => {
          dataMap.set(interview.id, interview);
          
          return {
            id: interview.id,
            studentId: interview.student_id,
            studentName: interview.booking?.email?.split('@')[0] || 'Student',
            studentEmail: interview.booking?.email || '',
            package: interview.booking?.package || '',
            universities: interview.university || interview.booking?.universities || '',
            preferredTime: interview.booking?.preferred_time,
            createdAt: interview.booking?.created_at || interview.created_at,
            field: interview.booking?.field,
            phone: interview.booking?.phone,
            notes: interview.booking?.notes || interview.notes,
          };
        });

        setInterviewsDataMap(dataMap);
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

      // Check if this interview is already in pending changes
      const existingChange = pendingChanges.find(c => c.interviewId === interviewId);
      if (existingChange) {
        alert('This interview is already scheduled in pending changes');
        return;
      }

      // Stage the change without backend call
      const newChange: PendingChange = {
        id: `${interviewId}-${Date.now()}`,
        type: 'assignment',
        interviewId,
        tutorId,
        tutorName: tutor.tutorName,
        date,
        time,
        studentName: interview.studentName,
        studentEmail: interview.studentEmail,
      };
      setPendingChanges(prev => [...prev, newChange]);

      // Update UI optimistically - add interview slot to tutor's schedule
      setTutors(prevTutors => prevTutors.map(t => {
        if (t.tutorId !== tutorId) return t;
        
        const updatedSchedule = { ...t.schedule };
        const daySlots = [...(updatedSchedule[date] || [])];
        
        // Find and update the available slot to interview
        const slotIndex = daySlots.findIndex(s => s.id === availableSlot.id);
        if (slotIndex !== -1) {
          daySlots[slotIndex] = {
            ...daySlots[slotIndex],
            type: 'interview',
            title: interview.studentName,
            student: interview.studentName,
            package: interview.package,
            interviewId: interviewId,
            isPending: true, // Mark as pending commit
          };
        }
        
        updatedSchedule[date] = daySlots;
        return { ...t, schedule: updatedSchedule };
      }));

      // Remove from unassigned interviews list
      setUnassignedInterviews(prev => prev.filter(i => i.id !== interviewId));

      console.log(`Staged assignment: ${interview.studentName} to ${tutor.tutorName} on ${date} at ${time}`);
    } catch (err: any) {
      console.error('Error staging interview assignment:', err);
      alert(`Failed to stage interview: ${err.message}`);
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

  const removeAvailability = async (slots: { tutorId: string; slotId: string }[]) => {
    try {
      // Delete each availability slot
      for (const { slotId } of slots) {
        console.log('Deleting availability slot:', slotId);

        const response = await fetch(`${backendUrl}/api/v1/tutors/availability/${slotId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || 'Failed to remove availability');
        }
      }

      // Refresh data
      await fetchData();

      console.log('Removed availability slots:', slots);
      alert(`✓ Removed ${slots.length} availability slot(s)`);
    } catch (err: any) {
      console.error('Error removing availability:', err);
      alert(`Failed to remove availability: ${err.message}`);
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

  const openInterviewDetailsModal = async (interviewId: string) => {
    try {
      setLoading(true);
      
      let interview: BackendInterviewData;

      console.log('Opening interview details for:', interviewId);
      
      // Check if we have the data in our local map first
      const cachedInterview = interviewsDataMap.get(interviewId);
      
      if (cachedInterview) {
        console.log('Using cached interview data');
        interview = cachedInterview;
      } else {
        console.log('Fetching interview details from backend');
        // Fetch full interview details from backend
        const interviewRes = await fetch(`${backendUrl}/api/v1/interviews/${interviewId}`);
        const interviewResData = await interviewRes.json();

        const bookingRes = await fetch(`${backendUrl}/api/v1/bookings/${interviewResData.data.booking_id}`);
        const bookingResData = await bookingRes.json();

        
        
        if (!interviewResData.success) {
          throw new Error('Failed to fetch interview details');
        }
        
        interview = {...interviewResData.data, booking: bookingResData.data};

        console.log('Fetched interview data:', interview);
        
        // Cache it for future use
        setInterviewsDataMap(prev => new Map(prev).set(interviewId, interview));
      }
      
      // Fetch student availability if student_id exists
      let studentAvailability: StudentAvailabilitySlot[] = [];
      if (interview.student_id) {
        const availRes = await fetch(
          `${backendUrl}/api/v1/students/${interview.student_id}/availability`
        );
        const availData = await availRes.json();
        
        if (availData.success && availData.data) {
          studentAvailability = availData.data.map((slot: any) => ({
            id: slot.id,
            date: slot.date,
            dayOfWeek: slot.day_of_week,
            hourStart: slot.hour_start,
            hourEnd: slot.hour_end,
            type: slot.type,
          }));
        }
      }

      // Transform to InterviewDetails format
      const details: InterviewDetails = {
        id: interview.id,
        studentId: interview.student_id || '',
        studentName: interview.booking?.email?.split('@')[0] || interview.booking?.email || 'Unknown Student',
        studentEmail: interview.booking?.email || 'No email provided',
        package: interview.booking?.package || 'No package',
        universities: interview.university || interview.booking?.universities || 'No university specified',
        preferredTime: interview.booking?.preferred_time,
        createdAt: interview.created_at || new Date().toISOString(),
        field: interview.booking?.field,
        phone: interview.booking?.phone,
        notes: interview.notes || interview.booking?.notes,
        studentAvailability,
        tutorId: interview.tutor_id,
        tutorName: interview.tutor?.name,
        tutorEmail: interview.tutor?.email,
        scheduledAt: interview.scheduled_at,
        zoomJoinUrl: interview.zoom_join_url,
      };

      setSelectedInterviewDetails(details);
      setIsInterviewDetailsModalOpen(true);
    } catch (err: any) {
      console.error('Error fetching interview details:', err);
      alert(`Failed to load interview details: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const closeInterviewDetailsModal = () => {
    setIsInterviewDetailsModalOpen(false);
    setSelectedInterviewDetails(null);
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

  const commitChanges = async () => {
    if (pendingChanges.length === 0) {
      alert('No pending changes to commit');
      return;
    }

    try {
      setLoading(true);

      // Execute all pending assignments
      for (const change of pendingChanges) {
        // Find the tutor to get the availability slot ID
        const tutor = tutors.find(t => t.tutorId === change.tutorId);
        if (!tutor) continue;

        const daySlots = tutor.schedule[change.date] || [];
        const hour = parseInt(change.time.split(':')[0], 10);
        
        const availableSlot = daySlots.find(slot => {
          const slotHour = parseInt(slot.startTime.split(':')[0], 10);
          return slotHour === hour && (slot.type === 'available' || slot.interviewId === change.interviewId);
        });

        if (!availableSlot) {
          throw new Error(`Slot not found for ${change.tutorName} at ${change.time}`);
        }

        const scheduledAt = `${change.date}T${change.time}:00Z`;

        // Call backend to assign interview
        const assignResponse = await fetch(`${backendUrl}/api/v1/interviews/${change.interviewId}/assign`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tutor_id: change.tutorId,
            scheduled_at: scheduledAt,
            availability_slot_id: availableSlot.id,
          }),
        });

        const assignResult = await assignResponse.json();
        if (!assignResult.success) {
          throw new Error(assignResult.message || 'Failed to assign interview');
        }

        // Send confirmation emails
        const confirmResponse = await fetch(`${backendUrl}/api/v1/interviews/${change.interviewId}/confirm`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tutor_id: change.tutorId,
            tutor_name: change.tutorName,
            scheduled_at: scheduledAt,
            student_email: change.studentEmail,
            student_name: change.studentName,
          }),
        });

        const confirmResult = await confirmResponse.json();
        if (!confirmResult.success) {
          throw new Error(confirmResult.message || 'Failed to send confirmation emails');
        }

        console.log(`Committed and sent emails for interview ${change.interviewId}`);
      }

      // Clear pending changes
      setPendingChanges([]);
      
      // Refresh data
      await fetchData();

      alert(`✓ Successfully committed ${pendingChanges.length} change(s) and sent confirmation emails!`);
    } catch (err: any) {
      console.error('Error committing changes:', err);
      alert(`Failed to commit changes: ${err.message}`);
      // Refresh data to restore original state
      await fetchData();
    } finally {
      setLoading(false);
    }
  };

  const discardChanges = () => {
    if (pendingChanges.length === 0) return;
    
    if (confirm(`Discard ${pendingChanges.length} pending change(s)?`)) {
      setPendingChanges([]);
      // Refresh to get original state
      fetchData();
    }
  };

  const createInterview = async (data: { booking_id: string; student_id: string; university: string; scheduled_at: string; notes?: string }) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${backendUrl}/api/v1/interviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to create interview');
      }

      // Refresh data to show new interview
      await fetchData();
      
      alert('✓ Interview created successfully!');
    } catch (err: any) {
      console.error('Error creating interview:', err);
      alert(`Failed to create interview: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelInterview = async (interviewId: string) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${backendUrl}/api/v1/interviews/${interviewId}/cancel`, {
        method: 'POST',
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to cancel interview');
      }

      // Remove from pending changes if exists
      setPendingChanges(prev => prev.filter(c => c.interviewId !== interviewId));

      // Refresh data
      await fetchData();
      
      alert('✓ Interview cancelled and unassigned successfully!');
    } catch (err: any) {
      console.error('Error cancelling interview:', err);
      alert(`Failed to cancel interview: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteInterview = async (interviewId: string) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${backendUrl}/api/v1/interviews/${interviewId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to delete interview');
      }

      // Remove from pending changes if exists
      setPendingChanges(prev => prev.filter(c => c.interviewId !== interviewId));

      // Refresh data
      await fetchData();
      
      alert('✓ Interview deleted successfully!');
    } catch (err: any) {
      console.error('Error deleting interview:', err);
      alert(`Failed to delete interview: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value: TutorCalendarContextType = {
    tutors,
    unassignedInterviews,
    selectedDate,
    selectedTutor,
    isAvailabilityModalOpen,
    isInterviewDetailsModalOpen,
    selectedInterviewDetails,
    loading,
    error,
    pendingChanges,
    hasPendingChanges,
    currentUserId,
    setSelectedDate,
    assignInterview,
    cancelInterview,
    markSlotsAvailable,
    removeAvailability,
    openAvailabilityModal,
    closeAvailabilityModal,
    openInterviewDetailsModal,
    closeInterviewDetailsModal,
    createInterview,
    deleteInterview,
    saveAvailability,
    refreshData,
    commitChanges,
    discardChanges,
    setCurrentUserId,
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
