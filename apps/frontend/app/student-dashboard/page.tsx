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
  return raw;
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

  const pendingInterviews = useMemo(
    () =>
      interviews.filter(
        (interview) => (!interview.scheduled_at || !interview.tutor?.id) && !interview.completed
      ),
    [interviews]
  );

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

        const response = await fetch(
          `${backendUrl}/api/v1/tutors/with-availability?start_date=${startDateStr}&end_date=${endDateStr}`
        );
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
  }, [backendUrl, isScheduleModalOpen]);

  const handleConfirmSchedule = async (selection: {
    scheduledAt: string;
    tutorId: string;
    availabilitySlotId: string;
    tutorName?: string;
  }) => {
    if (!activeInterview) return;

    try {
      setScheduling(true);
      const response = await fetch(`${backendUrl}/api/v1/interviews/${activeInterview.id}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tutor_id: selection.tutorId,
          scheduled_at: selection.scheduledAt,
          availability_slot_id: selection.availabilitySlotId,
        }),
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to assign interview');
      }

      updateInterview(activeInterview.id, {
        scheduled_at: selection.scheduledAt,
        tutor: {
          id: selection.tutorId,
          name: selection.tutorName || 'Assigned Tutor',
          email: '',
        },
      });

      handleCloseSchedule();
      refresh();
    } catch (err: any) {
      console.error('Error assigning interview:', err);
      alert(err.message || 'Failed to schedule interview');
    } finally {
      setScheduling(false);
    }
  };


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
  const primaryCTA = { label: 'Book a session', onClick: () => {} };


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
                        <p className="text-sm text-gray-600">University: {interview.university}</p>
                      )}
                      <div className="text-sm text-gray-600">
                        Tutor: {interview.tutor?.name || 'Assigned'}
                        {dateTime && ` • ${dateTime.date} • ${dateTime.time}`}
                      </div>
                    </div>
                    <button className="inline-flex items-center justify-center rounded-lg border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-700 hover:border-indigo-300 hover:bg-indigo-50">
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
            <h2 className="text-xl font-semibold text-gray-900">Tutor unassigned interviews</h2>
          </div>

          {pendingInterviews.length === 0 ? (
            <div className="text-sm text-gray-600">No pending interviews to schedule.</div>
          ) : (
            <div className="space-y-3">
              {pendingInterviews.map((interview) => (
                <div
                  key={interview.id}
                  className="flex flex-col gap-4 rounded-xl border border-amber-200 bg-amber-50/50 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-amber-700">
                      {getSessionType(interview)} • {formatPackageName(interview.booking?.package)}
                    </div>
                    {interview.university && (
                      <p className="text-sm text-gray-600">University: {interview.university}</p>
                    )}
                    <div className="text-sm text-gray-600">Tutor: Unassigned</div>
                  </div>
                  <button
                    onClick={() => handleOpenSchedule(interview)}
                    className="inline-flex items-center justify-center rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
                  >
                    Schedule interview
                  </button>
                </div>
              ))}
            </div>
          )}
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
              {availabilityLoading ? (
                <div className="text-center py-12 text-gray-600">
                  Loading availability...
                </div>
              ) : availabilityError ? (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                  {availabilityError}
                </div>
              ) : tutorAvailability.length === 0 ? (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg">
                  No available time slots found. Please check back soon.
                </div>
              ) : (
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
