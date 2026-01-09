'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
export interface StudentProfile {
  id: string;
  user_id: string;
  auth_id?: string;
  created_from_booking_id?: string;
  timezone: string;
  weekly_availability?: WeeklyAvailability[];
  preferences?: string;
  created_at: string;
  updated_at: string;
  users?: {
    id: string;
    email: string;
    full_name?: string;
    phone_number?: string;
  };
}

export interface WeeklyAvailability {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  slots: TimeSlot[];
}

export interface TimeSlot {
  start: string; // HH:MM format
  end: string; // HH:MM format
}

export interface SpecificDateAvailability {
  date: string; // YYYY-MM-DD format
  hour_start: number;
  hour_end: number;
  type?: 'interview' | 'tutoring' | 'consultation';
}

export interface Session {
  id: string;
  university?: string;
  scheduled_at?: string;
  completed: boolean;
  status: string;
  notes?: string;
  zoom_join_url?: string;
  student_feedback?: string;
  tutor_id?: string;
  tutors?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface AvailabilitySubmission {
  student_id: string;
  timezone?: string;
  weekly_availability?: WeeklyAvailability[];
  specific_dates?: SpecificDateAvailability[];
  notes?: string;
}

interface StudentContextType {
  studentId: string | null;
  profile: StudentProfile | null;
  sessions: Session[];
  upcomingSessions: Session[];
  previousSessions: Session[];
  loading: boolean;
  error: string | null;
  setStudentId: (id: string | null) => void;
  refreshProfile: () => Promise<void>;
  refreshSessions: () => Promise<void>;
  submitAvailability: (data: AvailabilitySubmission) => Promise<void>;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

interface StudentProviderProps {
  children: ReactNode;
  initialStudentId?: string | null;
}

export function StudentProvider({ children, initialStudentId = null }: StudentProviderProps) {
  const [studentId, setStudentId] = useState<string | null>(initialStudentId);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // Fetch student profile
  const refreshProfile = async () => {
    if (!studentId) {
      setProfile(null);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/student/profile?student_id=${studentId}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      if (data.success) {
        setProfile(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch profile');
      }
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError(err.message);
    }
  };

  // Fetch student sessions
  const refreshSessions = async () => {
    if (!studentId) {
      setSessions([]);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/student/sessions?student_id=${studentId}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch sessions');
      }

      const data = await response.json();
      if (data.success) {
        setSessions(data.data || []);
      } else {
        throw new Error(data.message || 'Failed to fetch sessions');
      }
    } catch (err: any) {
      console.error('Error fetching sessions:', err);
      setError(err.message);
    }
  };

  // Submit availability
  const submitAvailability = async (data: AvailabilitySubmission) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/v1/student/availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit availability');
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to submit availability');
      }

      // Refresh profile to get updated availability
      await refreshProfile();
    } catch (err: any) {
      console.error('Error submitting availability:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Load data when studentId changes
  useEffect(() => {
    if (studentId) {
      setLoading(true);
      setError(null);

      Promise.all([refreshProfile(), refreshSessions()])
        .catch((err) => {
          console.error('Error loading student data:', err);
          setError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setProfile(null);
      setSessions([]);
      setLoading(false);
    }
  }, [studentId]);

  // Compute upcoming and previous sessions
  const now = new Date();
  const upcomingSessions = sessions.filter((session) => {
    if (!session.scheduled_at) return false;
    const scheduledDate = new Date(session.scheduled_at);
    return scheduledDate >= now && !session.completed;
  });

  const previousSessions = sessions.filter((session) => {
    if (session.completed) return true;
    if (!session.scheduled_at) return false;
    const scheduledDate = new Date(session.scheduled_at);
    return scheduledDate < now;
  });

  const value: StudentContextType = {
    studentId,
    profile,
    sessions,
    upcomingSessions,
    previousSessions,
    loading,
    error,
    setStudentId,
    refreshProfile,
    refreshSessions,
    submitAvailability,
  };

  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>;
}

export function useStudent() {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
}
