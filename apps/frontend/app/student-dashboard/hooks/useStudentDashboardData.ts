'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

export interface DashboardInterview {
  id: string;
  booking_id?: string;
  scheduled_at: string | null;
  completed: boolean;
  student_feedback?: string;
  notes?: string;
  tutor?: {
    id: string;
    name: string;
    email: string;
  };
  university?: string;
  booking?: {
    id?: string;
    package: string;
    payment_status: string;
    universities?: string;
    field?: string;
    created_at: string;
  };
}

export interface DashboardBooking {
  id: string;
  package?: string;
  payment_status: string;
  status?: string;
  universities?: string;
  field?: string;
  created_at: string;
  preferred_time?: string;
  notes?: string;
  start_time?: string;
}

export interface DashboardAvailabilitySlot {
  id?: string;
  date: string;
  hour_start: number;
  hour_end: number;
  notes?: string;
}

export interface SessionStats {
  totalCompleted: number;
  upcomingSessions: number;
  pendingInterviews: number;
  hoursBooked: number;
}

interface UseStudentDashboardDataArgs {
  userEmail: string | null;
  backendUrl: string;
}

export function useStudentDashboardData({ userEmail, backendUrl }: UseStudentDashboardDataArgs) {
  const [userRecord, setUserRecord] = useState<any>(null);
  const [bookings, setBookings] = useState<DashboardBooking[]>([]);
  const [interviews, setInterviews] = useState<DashboardInterview[]>([]);
  const [availability, setAvailability] = useState<DashboardAvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    if (!userEmail) {
      setUserRecord(null);
      setBookings([]);
      setInterviews([]);
      setAvailability([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${backendUrl}/api/v1/students/email/${encodeURIComponent(userEmail)}/dashboard`
      );
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch dashboard data');
      }

      const { user, bookings: bookingsData, interviews: interviewsData, availability: availabilityData } = result.data;

      setUserRecord(user);
      setBookings(bookingsData || []);

      const transformedInterviews = (interviewsData || []).map((interview: any) => ({
        id: interview.id,
        booking_id: interview.booking_id,
        scheduled_at: interview.scheduled_at,
        completed: interview.completed,
        student_feedback: interview.student_feedback,
        notes: interview.notes,
        university: interview.university,
        tutor: interview.tutor
          ? {
              id: interview.tutor.id,
              name: interview.tutor.name || interview.tutor.email,
              email: interview.tutor.email,
            }
          : undefined,
        booking: interview.booking,
      }));
      setInterviews(transformedInterviews);

      if (availabilityData && availabilityData.length > 0) {
        setAvailability(
          availabilityData.map((slot: any) => ({
            id: slot.id,
            date: slot.date,
            hour_start: slot.hour_start,
            hour_end: slot.hour_end,
            notes: slot.notes,
          }))
        );
      } else {
        setAvailability([]);
      }
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }, [backendUrl, userEmail]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const sessionStats: SessionStats = useMemo(() => {
    const completed = interviews.filter((interview) => interview.completed).length;
    const upcoming = interviews.filter((interview) => !interview.completed && interview.scheduled_at).length;
    const pending = interviews.filter((interview) => !interview.scheduled_at).length;
    const hoursBooked = completed + upcoming;

    return {
      totalCompleted: completed,
      upcomingSessions: upcoming,
      pendingInterviews: pending,
      hoursBooked,
    };
  }, [interviews]);

  const universities = useMemo(() => {
    const items = new Set<string>();

    const addFromString = (value?: string) => {
      if (!value) return;
      value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
        .forEach((item) => items.add(item));
    };

    bookings.forEach((booking) => addFromString(booking.universities));
    interviews.forEach((interview) => {
      addFromString(interview.booking?.universities);
      if (typeof interview.university === 'string') {
        addFromString(interview.university);
      }
    });

    return Array.from(items).sort((a, b) => a.localeCompare(b));
  }, [bookings, interviews]);

  const updateInterview = useCallback(
    (interviewId: string, updates: Partial<DashboardInterview>) => {
      setInterviews((prev) => prev.map((interview) => (interview.id === interviewId ? { ...interview, ...updates } : interview)));
    },
    []
  );

  return {
    userRecord,
    bookings,
    interviews,
    availability,
    sessionStats,
    universities,
    loading,
    error,
    refresh: fetchDashboardData,
    updateInterview,
  };
}
