'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, Calendar, CalendarClock, CheckCircle, Clock } from 'lucide-react';
import { createClient } from '../../utils/supabase/client';
import { useRouter } from 'next/navigation';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import Step3_5InterviewDates from '../../components/interview-payment/Step3_5InterviewDates';
import {
  useStudentDashboardData,
  type DashboardInterview
} from './hooks/useStudentDashboardData';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import ManageInterviewModal from '../../components/student-dashboard/ManageInterviewModal';
import { UK_MEDICAL_SCHOOLS } from '../../data/universities';

export const dynamic = 'force-dynamic';

interface TutorAvailabilitySlot {
  id: string;
  tutorId: string;
  tutorName?: string;
  date: string;
  hourStart: number;
  hourEnd: number;
}

function getSessionType(interview?: DashboardInterview): string {
  if (interview) return 'Live Interview';
  return 'Session';
}

function formatDateTime(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  return {
    date: date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    time: date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
  };
}

function formatPackageName(raw?: string) {
  if (!raw) return 'Interview Session';
  const key = raw.toLowerCase().trim();
  if (key.includes('core_live')) return 'Core Mock Interview Package';
  if (key.includes('premium_live')) return 'Premium Mock Interview Package';
  if (key.includes('essentials_live')) return 'Essentials Mock Interview Package';
  if (key.includes('core_generated')) return 'Core Generated Package';
  if (key.includes('premium_generated')) return 'Premium Generated Package';
  if (key.includes('essentials_generated')) return 'Essentials Generated Package';
 

function getUniversityDisplayName(universityIdOrName?: string): string {
  if (!universityIdOrName) return '';
  
  // Try to find by ID first
  const schoolById = UK_MEDICAL_SCHOOLS.find(u => u.id === universityIdOrName);
  if (schoolById) return schoolById.displayName;
  
  // Try to find by displayName (for backwards compatibility)
  const schoolByName = UK_MEDICAL_SCHOOLS.find(u => u.displayName === universityIdOrName);
  if (schoolByName) return schoolByName.displayName;
  
  // Return as-is if not found
  return universityIdOrName;
} return raw;
}

export default function StudentDashboard() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [activeInterview, setActiveInterview] = useState<DashboardInterview | null>(null);
  const [tutorAvailability, setTutorAvailability] = useState<TutorAvailabilitySlot[]>([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const [scheduling, setScheduling] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'feedback' | 'resources' | 'profile'>('home');
  const [manageModalOpen, setManageModalOpen] = useState(false);
  const [managingInterview, setManagingInterview] = useState<DashboardInterview | null>(null);
  const [scheduleSuccess, setScheduleSuccess] = useState(false);
  const [scheduleMessage, setScheduleMessage] = useState('');
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const [availabilitySubmitting, setAvailabilitySubmitting] = useState(false);
  const [availabilitySuccess, setAvailabilitySuccess] = useState(false);

  const router = useRouter();
  const supabase = createClient();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';

  const {
    userRecord,
    interviews,
    sessionStats,
    loading,
    error,
    refresh,
    updateInterview,
  } = useStudentDashboardData({
    userEmail: user?.email ?? null,
    backendUrl,
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login?redirectTo=/student-dashboard&role=student');
      } else {
        setUser(user);
      }
      setAuthChecked(true);
    };
    checkAuth();
  }, [router, supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login?role=student');
  };

  const scheduledInterviews = useMemo(
    () =>
      interviews.filter(
        (interview) => interview.scheduled_at && interview.tutor?.id && !interview.completed
      ),
    [interviews]
  );


  const getUniversityDisplayName = (universityIdOrName?: string): string => {
    if (!universityIdOrName) return '';
    
    // Try to find by ID first
    const schoolById = UK_MEDICAL_SCHOOLS.find(u => u.id === universityIdOrName);
    if (schoolById) return schoolById.displayName;
    
    // Try to find by displayName (for backwards compatibility)
    const schoolByName = UK_MEDICAL_SCHOOLS.find(u => u.displayName === universityIdOrName);
    if (schoolByName) return schoolByName.displayName;
    
    // Return as-is if not found
    return universityIdOrName;
  }

  const pendingInterviews = useMemo(
    () =>
      interviews.filter(
        (interview) => (!interview.scheduled_at || !interview.tutor?.id) && !interview.completed),
    [interviews]
  );
    

  const completedInterviews = useMemo(
    () =>
      interviews.filter(
        (interview) => interview.completed
      ),
    [interviews]
  );  

  const handleOpenManage = (interview: DashboardInterview) => {
    setManagingInterview(interview);
    setManageModalOpen(true);
  };

  const handleCloseManage = () => {
    setManageModalOpen(false);
    setManagingInterview(null);
  };

  const handleSaveInterview = async (interviewId: string, updates: { university?: string; notes?: string }) => {
    try {
      const response = await fetch(`${backendUrl}/api/v1/interviews/${interviewId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to update interview');
      }

      updateInterview(interviewId, updates);
      refresh();
    } catch (err: any) {
      console.error('Error updating interview:', err);
      throw err;
    }
  };
  
  const handleOpenSchedule = (interview: DashboardInterview) => {
    setActiveInterview(interview);
    setIsScheduleModalOpen(true);
  };

  const handleCloseSchedule = () => {
    setIsScheduleModalOpen(false);
    setActiveInterview(null);
    setTutorAvailability([]);
    setAvailabilityError(null);
  };

  const handleOpenAvailability = () => {
    setIsAvailabilityModalOpen(true);
    setAvailabilitySuccess(false);
  };

  const handleCloseAvailability = () => {
    setIsAvailabilityModalOpen(false);
  };

  const handleSubmitAvailability = async (selection: {
    scheduledAt: string;
  }) => {
    if (!userRecord?.id) return;

    try {
      setAvailabilitySubmitting(true);
      
      const scheduledDate = new Date(selection.scheduledAt);
      const date = scheduledDate.toISOString().split('T')[0];
      const hour = scheduledDate.getUTCHours();

      const response = await fetch(`${backendUrl}/api/v1/users/${userRecord.id}/availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date,
          hour_start: hour,
          hour_end: hour + 1,
        }),
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to submit availability');
      }

      setAvailabilitySuccess(true);
      
      // Auto-close modal after 2 seconds
      setTimeout(() => {
        handleCloseAvailability();
        setAvailabilitySuccess(false);
        refresh();
      }, 2000);
    } catch (err: any) {
      console.error('Error submitting availability:', err);
      alert(err.message || 'Failed to submit availability');
    } finally {
      setAvailabilitySubmitting(false);
    }
  };

  useEffect(() => {
    if (!isScheduleModalOpen) return;

    const fetchAvailability = async () => {
      try {
        setAvailabilityLoading(true);
        setAvailabilityError(null);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const endDate = new Date(today);
        endDate.setDate(today.getDate() + 28);

        const startDateStr = today.toISOString().split('T')[0];
        const endDateStr = endDate.toISOString().split('T')[0];

        // Get the field from the active interview's booking
        const interviewField = activeInterview?.booking?.field || activeInterview?.field;
        
        // Build URL with field parameter if available
        let url = `${backendUrl}/api/v1/tutors/with-availability?start_date=${startDateStr}&end_date=${endDateStr}`;
        if (interviewField) {
          url += `&field=${interviewField}`;
        }

        const response = await fetch(url);
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || 'Failed to fetch tutor availability');
        }

        const now = new Date();
        const nowDate = now.toISOString().split('T')[0];
        const nowHour = now.getHours();

        const slots: TutorAvailabilitySlot[] = (result.data || []).flatMap((tutor: any) =>
          (tutor.availability || [])
            .filter((slot: any) => slot.type === 'available')
            .filter((slot: any) => {
              if (slot.date < nowDate) return false;
              if (slot.date === nowDate && slot.hour_start <= nowHour) return false;
              return true;
            })
            .map((slot: any) => ({
              id: slot.id,
              tutorId: tutor.id,
              tutorName: tutor.name,
              date: slot.date,
              hourStart: slot.hour_start,
              hourEnd: slot.hour_end,
            }))
        );

        setTutorAvailability(slots);
      } catch (err: any) {
        console.error('Error fetching tutor availability:', err);
        setAvailabilityError(err.message || 'Failed to load availability');
      } finally {
        setAvailabilityLoading(false);
      }
    };

    fetchAvailability();
  }, [backendUrl, isScheduleModalOpen, activeInterview]);

  const handleConfirmSchedule = async (selection: {
    scheduledAt: string;
    tutorId?: string;
    availabilitySlotId?: string;
    tutorName?: string;
    availableTutorCount: number;
  }) => {
    if (!activeInterview) return;

    try {
      setScheduling(true);
      setScheduleSuccess(false);
      const isConfirmed =
        selection.availableTutorCount === 1 &&
        !!selection.tutorId &&
        !!selection.availabilitySlotId;

      const payload: {
        scheduled_at: string;
        tutor_id?: string;
        availability_slot_id?: string;
      } = {
        scheduled_at: selection.scheduledAt,
      };

      if (isConfirmed) {
        payload.tutor_id = selection.tutorId;
        payload.availability_slot_id = selection.availabilitySlotId;
      }

      const response = await fetch(`${backendUrl}/api/v1/interviews/${activeInterview.id}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to schedule interview');
      }

      // Determine if this was a pending request or confirmed assignment
      const message = isConfirmed 
        ? 'Interview scheduled successfully!'
        : 'Interview request received! We\'ll match you with a tutor soon.';

      updateInterview(activeInterview.id, {
        status: isConfirmed ? 'confirmed' : 'pending',
        proposed_time: selection.scheduledAt,
        scheduled_at: isConfirmed ? selection.scheduledAt : null,
        tutor: isConfirmed
          ? {
              id: selection.tutorId as string,
              name: selection.tutorName || 'Assigned Tutor',
              email: '',
            }
          : undefined,
      });

      setScheduleSuccess(true);
      setScheduleMessage(message);
      
      // Auto-close modal after 3 seconds
      setTimeout(() => {
        handleCloseSchedule();
        setScheduleSuccess(false);
        refresh();
      }, 3000);
    } catch (err: any) {
      console.error('Error scheduling interview:', err);
      setScheduleMessage(err.message || 'Failed to schedule interview');
    } finally {
      setScheduling(false);
    }
  };

  // Memoize handlers before early returns (Rules of Hooks)
  const handleBookSession = React.useCallback(() => {
    router.push('/interviews');
  }, [router]);

  const primaryCTA = React.useMemo(() => ({ 
    label: 'Book a session', 
    onClick: handleBookSession 
  }), [handleBookSession]);

  if (!authChecked || !user || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const userName = userRecord?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student';
  const userEmail = userRecord?.email || user?.email || '';
  const nextSession = null;


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <DashboardHeader
        userName={userName}
        userEmail={userEmail}
        onSignOut={handleSignOut}
        nextSession={nextSession}
        primaryCTA={primaryCTA}
      />
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 py-3">
            {[
              { key: 'home', label: 'Home' },
              { key: 'feedback', label: 'Feedback' },
              { key: 'resources', label: 'Resources' },
              { key: 'profile', label: 'Profile' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                  activeTab === tab.key
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {activeTab !== 'home' && (
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center text-gray-600">
            {activeTab === 'feedback' && 'Feedback content coming soon.'}
            {activeTab === 'resources' && 'Resources content coming soon.'}
            {activeTab === 'profile' && 'Profile content coming soon.'}
          </section>
        )}

        {activeTab === 'home' && (
          <>
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'Total sessions completed',
              value: sessionStats.totalCompleted,
              icon: CheckCircle,
              color: 'bg-green-100 text-green-700',
            },
            {
              label: 'Upcoming sessions',
              value: sessionStats.upcomingSessions,
              icon: Calendar,
              color: 'bg-blue-100 text-blue-700',
            },
            {
              label: 'Pending interviews',
              value: sessionStats.pendingInterviews,
              icon: AlertCircle,
              color: 'bg-amber-100 text-amber-700',
            },
            {
              label: 'Hours booked (lifetime)',
              value: sessionStats.hoursBooked,
              icon: Clock,
              color: 'bg-purple-100 text-purple-700',
            },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <CalendarClock className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-semibold text-gray-900">Upcoming booked interviews</h2>
          </div>

          {scheduledInterviews.length === 0 ? (
            <div className="text-sm text-gray-600">No upcoming interviews scheduled yet.</div>
          ) : (
            <div className="space-y-3">
              {scheduledInterviews.map((interview) => {
                const dateTime = formatDateTime(interview.scheduled_at || undefined);
                return (
                  <div
                    key={interview.id}
                    className="flex flex-col gap-4 rounded-xl border border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-indigo-700">
                        {getSessionType(interview)} • {formatPackageName(interview.booking?.package)}
                      </div>
                      {interview.university && (
                        <p className="text-sm text-gray-600">University: {getUniversityDisplayName(interview.university)}</p>
                      )}
                      <div className="text-sm text-gray-600">
                        Tutor: {interview.tutor?.name || 'Assigned'}
                        {dateTime && ` • ${dateTime.date} • ${dateTime.time}`}
                      </div>
                    </div>
                    <button
                      onClick={() => handleOpenManage(interview)}
                      className="inline-flex items-center justify-center rounded-lg border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-700 hover:border-indigo-300 hover:bg-indigo-50"
                    >
                      Manage
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <h2 className="text-xl font-semibold text-gray-900">Unassigned interviews</h2>
          </div>

          {pendingInterviews.length === 0 ? (
            <div className="text-sm text-gray-600">No pending interviews to schedule.</div>
          ) : (
            <div className="space-y-3">
              {pendingInterviews.map((interview) => {
                // Determine status label based on proposed_time
                const hasProposedTime = !!interview.proposed_time;
                const statusLabel = hasProposedTime ? 'Time requested' : 'Pending confirmation';
                const statusColor = hasProposedTime ? 'text-blue-700' : 'text-amber-700';
                
                return (
                  <div
                    key={interview.id}
                    className="flex flex-col gap-4 rounded-xl border border-amber-200 bg-amber-50/50 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-amber-700">
                          {getSessionType(interview)} • {formatPackageName(interview.booking?.package)}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${hasProposedTime ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                          {statusLabel}
                        </span>
                      </div>
                      {interview.university && (
                        <p className="text-sm text-gray-600">University: {getUniversityDisplayName(interview.university)}</p>
                      )}
                      <div className="text-sm text-gray-600">
                        Tutor: Unassigned
                        {hasProposedTime && interview.proposed_time && (
                          <span> • Requested: {formatDateTime(interview.proposed_time)?.date} at {formatDateTime(interview.proposed_time)?.time}</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleOpenSchedule(interview)}
                      className="inline-flex items-center justify-center rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
                    >
                      {hasProposedTime ? 'Update time' : 'Schedule interview'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">Completed sessions</h2>
          </div>

          {completedInterviews.length === 0 ? (
            <div className="text-sm text-gray-600">No completed sessions yet.</div>
          ) : (
            <div className="space-y-3">
              {completedInterviews.map((interview) => {
                const dateTime = formatDateTime(interview.scheduled_at || undefined);
                return (
                  <div
                    key={interview.id}
                    className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-green-50/30 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-green-700">
                        {getSessionType(interview)} • {formatPackageName(interview.booking?.package)}
                      </div>
                      {interview.university && (
                        <p className="text-sm text-gray-600">University: {getUniversityDisplayName(interview.university)}</p>
                      )}
                      <div className="text-sm text-gray-600">
                        Tutor: {interview.tutor?.name || 'Completed'}
                        {dateTime && ` • ${dateTime.date} • ${dateTime.time}`}
                      </div>
                      {interview.student_feedback && (
                        <p className="text-sm text-gray-500 italic mt-1">
                          "Your feedback: {interview.student_feedback.substring(0, 100)}
                          {interview.student_feedback.length > 100 ? '...' : ''}"
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center rounded-lg bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        ✓ Completed
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Manage Your Availability</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Let us know when you're available for interviews. This helps us match you with tutors more quickly.
          </p>
          <button
            onClick={handleOpenAvailability}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Submit Availability
          </button>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Missing interviews?</h3>
              <p className="text-sm text-gray-600">If something looks off, we can help you sort it fast.</p>
            </div>
            <a
              href="mailto:contact@nextgenmedprep.com"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Contact us
            </a>
          </div>
        </section>
          </>
        )}
      </main>

      {/* Scheduling modal remains here for now, can be modularized later */}
      {isScheduleModalOpen && activeInterview && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Schedule Your Live Interview</h3>
                <p className="text-sm text-gray-600">Choose a time that works with tutor availability.</p>
              </div>
              <button
                onClick={handleCloseSchedule}
                className="text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
            <div className="p-6">
              {scheduleSuccess ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {scheduleMessage}
                  </h3>
                  <p className="text-gray-600">This modal will close automatically...</p>
                </div>
              ) : (
                <>
                  {availabilityLoading ? (
                    <div className="text-center py-12 text-gray-600">
                      Loading availability...
                    </div>
                  ) : availabilityError ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4">
                      {availabilityError}
                    </div>
                  ) : null}
                  {!availabilityLoading && !availabilityError && tutorAvailability.length === 0 && (
                    <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg mb-4">
                      No tutors currently have availability for this field, but you can still request a time below.
                    </div>
                  )}
                  {!availabilityLoading && (
                    <Step3_5InterviewDates
                      mode="dashboard"
                      bookingId={activeInterview.booking_id || activeInterview.booking?.id || ''}
                      tutorAvailability={tutorAvailability}
                      onConfirm={handleConfirmSchedule}
                    />
                  )}
                  {scheduling && (
                    <div className="mt-4 text-sm text-gray-600">Saving your interview time...</div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Manage Interview Modal */}
      {manageModalOpen && managingInterview && (
        <ManageInterviewModal
          interview={managingInterview}
          isOpen={manageModalOpen}
          onClose={handleCloseManage}
          onSave={handleSaveInterview}
        />
      )}

      {/* Availability Submission Modal */}
      {isAvailabilityModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Submit Your Availability</h3>
                <p className="text-sm text-gray-600">Select times when you're available for interviews.</p>
              </div>
              <button
                onClick={handleCloseAvailability}
                className="text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
            <div className="p-6">
              {availabilitySuccess ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Availability submitted successfully!
                  </h3>
                  <p className="text-gray-600">This modal will close automatically...</p>
                </div>
              ) : (
                <>
                  <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg mb-4">
                    <p className="text-sm">
                      <strong>Tip:</strong> Select multiple time slots to increase your chances of getting matched with a tutor quickly.
                    </p>
                  </div>
                  <Step3_5InterviewDates
                    mode="dashboard"
                    bookingId=""
                    tutorAvailability={[]}
                    onConfirm={handleSubmitAvailability}
                  />
                  {availabilitySubmitting && (
                    <div className="mt-4 text-sm text-gray-600">Submitting your availability...</div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
