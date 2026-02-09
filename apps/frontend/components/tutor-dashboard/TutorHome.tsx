'use client';

import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle,
  User,
  Video,
  Mail,
  GraduationCap,
  TrendingUp,
  Plus,
  ClipboardList,
  CalendarClock,
  Zap,
  ArrowRight,
  Sparkles,
  CircleDollarSign,
  Eye,
  AlertCircle,
} from 'lucide-react';
import SessionFeedbackModal from './SessionFeedbackModal';
import AddQuestionModal from './AddQuestionModal';
import QuestionViewModal from './QuestionViewModal';
import AvailabilityModal from '../../components/tutor-calendar/AvailabilityModal';

interface UpcomingSession {
  id: string;
  scheduled_at: string;
  studentName: string;
  studentEmail: string;
  universities?: string;
  package: string;
  zoom_join_url?: string;
  notes?: string;
}

interface SessionStats {
  totalCompleted: number;
  totalUpcoming: number;
  thisWeekCompleted: number;
  thisMonthCompleted: number;
}

interface QuestionSubmission {
  id: string;
  title?: string | null;
  question_text: string;
  status?: string | null;
  created_at?: string;
  rejection_reason?: string | null;
}

interface TutorHomeProps {
  tutorId: string;
  tutorName?: string;
  userRole?: 'admin' | 'manager' | 'tutor' | null;
  onOpenInterviewModal?: (interviewId: string) => void;
  onOpenAvailability?: () => void;
}

const TutorHome: React.FC<TutorHomeProps> = ({
  tutorId,
  tutorName,
  userRole,
  onOpenInterviewModal,
  onOpenAvailability,
}) => {
  const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>([]);
  const [stats, setStats] = useState<SessionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<UpcomingSession | null>(null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] = useState(false);
  const [questionSubmissions, setQuestionSubmissions] = useState<QuestionSubmission[]>([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [submissionsTab, setSubmissionsTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [selectedSubmission, setSelectedSubmission] = useState<QuestionSubmission | null>(null);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';

  useEffect(() => {
    fetchTutorData();
  }, [tutorId]);

  const fetchTutorData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [sessionsRes, statsRes] = await Promise.all([
        fetch(`${backendUrl}/api/v1/tutors/${tutorId}/upcoming-sessions`),
        fetch(`${backendUrl}/api/v1/tutors/${tutorId}/session-stats`),
      ]);

      if (sessionsRes.ok) {
        const sessionsData = await sessionsRes.json();
        if (sessionsData.success) setUpcomingSessions(sessionsData.data);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.success) setStats(statsData.data);
      }

      await fetchQuestionSubmissions();
    } catch (err: any) {
      console.error('Error fetching tutor data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestionSubmissions = async () => {
    try {
      setSubmissionsLoading(true);
      const response = await fetch(
        `${backendUrl}/api/v1/prometheus/questions?contributor_id=${encodeURIComponent(tutorId)}`
      );
      if (!response.ok) throw new Error('Failed to load question submissions');
      const result = await response.json();
      if (result.success) setQuestionSubmissions(result.data);
    } catch (err: any) {
      console.error('Error fetching question submissions:', err);
    } finally {
      setSubmissionsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  const getTimeUntil = (dateString: string) => {
    const now = new Date();
    const sessionDate = new Date(dateString);
    const diffMs = sessionDate.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `in ${diffDays}d`;
    if (diffHours > 0) return `in ${diffHours}h`;
    if (diffMins > 0) return `in ${diffMins}m`;
    if (diffMins < 0 && diffMins > -60) return 'NOW';
    return 'passed';
  };

  const getTimeUntilColor = (dateString: string) => {
    const now = new Date();
    const sessionDate = new Date(dateString);
    const diffMs = sessionDate.getTime() - now.getTime();
    const diffHours = diffMs / 3600000;

    if (diffHours <= 0) return 'text-rose-600 bg-rose-50 border-rose-200';
    if (diffHours <= 2) return 'text-amber-700 bg-amber-50 border-amber-200';
    if (diffHours <= 24) return 'text-blue-700 bg-blue-50 border-blue-200';
    return 'text-slate-600 bg-slate-50 border-slate-200';
  };

  const handleSessionClick = (session: UpcomingSession) => {
    setSelectedSession(session);
    setIsFeedbackModalOpen(true);
  };

  const handleCloseFeedbackModal = () => {
    setIsFeedbackModalOpen(false);
    setSelectedSession(null);
  };

  const normalizeSubmissionStatus = (status?: string | null) => {
    const normalized = (status || 'pending').toLowerCase();
    if (normalized === 'approved' || normalized === 'rejected') return normalized;
    return 'pending';
  };

  const submissionCounts = questionSubmissions.reduce(
    (acc, submission) => {
      const status = normalizeSubmissionStatus(submission.status);
      acc[status] += 1;
      return acc;
    },
    { pending: 0, approved: 0, rejected: 0 }
  );

  const filteredSubmissions = questionSubmissions.filter(
    (submission) => normalizeSubmissionStatus(submission.status) === submissionsTab
  );

  const handleQuestionUpdated = (updatedQuestion: QuestionSubmission) => {
    setQuestionSubmissions((prev) =>
      prev.map((item) => (item.id === updatedQuestion.id ? updatedQuestion : item))
    );
    setSelectedSubmission(updatedQuestion);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Next session helper
  const nextSession = upcomingSessions.length > 0 ? upcomingSessions[0] : null;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="relative">
          <div className="w-14 h-14 rounded-full border-[3px] border-slate-200"></div>
          <div className="absolute inset-0 w-14 h-14 rounded-full border-[3px] border-t-indigo-600 animate-spin"></div>
        </div>
        <p className="text-sm text-slate-500 font-medium animate-pulse">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-8">
      {/* ── Hero / Welcome ────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-5 sm:p-7 text-white shadow-xl">
        {/* decorative shapes */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-52 w-52 rounded-full bg-white/5"></div>
        <div className="pointer-events-none absolute -left-6 bottom-0 h-32 w-32 rounded-full bg-white/5"></div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div>
            <p className="text-indigo-200 text-sm font-medium tracking-wide uppercase mb-1">
              {getGreeting()}
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {tutorName || 'Tutor'}
            </h1>
            {stats && (
              <p className="text-indigo-200 text-sm mt-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                {stats.thisWeekCompleted} session{stats.thisWeekCompleted !== 1 ? 's' : ''} completed
                this week
              </p>
            )}
          </div>

          {/* ── Availability CTA ── */}
          <button
            type="button"
            onClick={() => setIsAvailabilityModalOpen(true)}
            className="group relative flex items-center gap-3 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 px-5 py-3 sm:py-3.5 text-left transition-all hover:bg-white/25 hover:border-white/30 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl w-full sm:w-auto"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 group-hover:bg-white/30 transition-colors flex-shrink-0">
              <CalendarClock className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="block text-sm font-bold text-white">Set Your Availability</span>
              <span className="block text-xs text-indigo-200">Let students book sessions</span>
            </div>
            <ArrowRight className="w-4 h-4 text-indigo-200 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
          </button>
        </div>
      </div>

      {/* ── Quick Stats Row ──────────────────────────────────── */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              label: 'Total Completed',
              value: stats.totalCompleted,
              sub: 'all time',
              icon: CheckCircle,
              accent: 'text-emerald-600',
              bg: 'bg-emerald-50',
              border: 'border-emerald-100',
            },
            {
              label: 'Upcoming',
              value: stats.totalUpcoming,
              sub: 'scheduled',
              icon: Calendar,
              accent: 'text-indigo-600',
              bg: 'bg-indigo-50',
              border: 'border-indigo-100',
            },
            {
              label: 'This Week',
              value: stats.thisWeekCompleted,
              sub: 'completed',
              icon: Zap,
              accent: 'text-violet-600',
              bg: 'bg-violet-50',
              border: 'border-violet-100',
            },
            {
              label: 'This Month',
              value: stats.thisMonthCompleted,
              sub: 'completed',
              icon: TrendingUp,
              accent: 'text-amber-600',
              bg: 'bg-amber-50',
              border: 'border-amber-100',
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`rounded-xl border ${stat.border} ${stat.bg} p-4 transition-shadow hover:shadow-md`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  {stat.label}
                </span>
                <stat.icon className={`w-4 h-4 ${stat.accent}`} />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stat.value}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{stat.sub}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Next Session Spotlight ────────────────────────────── */}
      {nextSession && (
        <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/80 to-white p-4 sm:p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Next Session
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex flex-col items-center justify-center h-14 w-14 rounded-xl bg-indigo-600 text-white flex-shrink-0 shadow-md">
                <span className="text-[10px] font-bold uppercase leading-none mt-0.5">
                  {new Date(nextSession.scheduled_at).toLocaleDateString('en-GB', { month: 'short' })}
                </span>
                <span className="text-xl font-extrabold leading-none">
                  {new Date(nextSession.scheduled_at).getDate()}
                </span>
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-slate-900 text-base truncate">
                  {nextSession.studentName}
                </h3>
                <p className="text-sm text-slate-500 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {formatTime(nextSession.scheduled_at)}
                  <span className={`ml-1 text-xs font-bold px-2 py-0.5 rounded-full border ${getTimeUntilColor(nextSession.scheduled_at)}`}>
                    {getTimeUntil(nextSession.scheduled_at)}
                  </span>
                </p>
                <p className="text-xs text-slate-400 mt-0.5 truncate">{nextSession.package}</p>
              </div>
            </div>

            <div className="flex gap-2 flex-shrink-0">
              {nextSession.zoom_join_url && (
                <a
                  href={nextSession.zoom_join_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all text-sm font-bold shadow-md hover:shadow-lg active:scale-[0.97]"
                >
                  <Video className="w-4 h-4" />
                  Join
                </a>
              )}
              <button
                type="button"
                onClick={() => handleSessionClick(nextSession)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-sm font-medium active:scale-[0.97]"
              >
                Add Feedback
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Upcoming Sessions ────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Upcoming Sessions</h2>
          </div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
            {upcomingSessions.length}
          </span>
        </div>

        {upcomingSessions.length === 0 ? (
          <div className="p-10 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-100 mb-3">
              <Calendar className="w-7 h-7 text-slate-300" />
            </div>
            <p className="text-slate-500 font-medium">No upcoming sessions</p>
            <p className="text-sm text-slate-400 mt-1">
              Set your availability so students can book with you
            </p>
            <button
              type="button"
              onClick={() => setIsAvailabilityModalOpen(true)}
              className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700"
            >
              <CalendarClock className="w-4 h-4" />
              Set Availability
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {upcomingSessions.map((session, idx) => {
              const timeUntil = getTimeUntil(session.scheduled_at);
              const isNow = timeUntil === 'NOW';

              // Skip the first session if it's already shown in the spotlight
              // Actually, let's keep all for completeness

              return (
                <div
                  key={session.id}
                  onClick={() => handleSessionClick(session)}
                  className={`group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-5 py-4 cursor-pointer transition-colors ${
                    isNow
                      ? 'bg-rose-50/50 hover:bg-rose-50'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  {/* Date badge */}
                  <div className="flex items-center gap-3 sm:w-44 flex-shrink-0">
                    <div
                      className={`flex flex-col items-center justify-center h-11 w-11 rounded-lg flex-shrink-0 ${
                        isNow ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span className="text-[9px] font-bold uppercase leading-none">
                        {new Date(session.scheduled_at).toLocaleDateString('en-GB', { month: 'short' })}
                      </span>
                      <span className="text-base font-extrabold leading-none">
                        {new Date(session.scheduled_at).getDate()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {formatTime(session.scheduled_at)}
                      </p>
                      <span
                        className={`inline-block text-[11px] font-bold px-1.5 py-0.5 rounded mt-0.5 border ${getTimeUntilColor(
                          session.scheduled_at
                        )}`}
                      >
                        {timeUntil}
                      </span>
                    </div>
                  </div>

                  {/* Student info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex-shrink-0">
                        <User className="w-3 h-3" />
                      </div>
                      <h3 className="font-semibold text-slate-900 text-sm truncate">
                        {session.studentName}
                      </h3>
                    </div>
                    <div className="pl-8 space-y-0.5">
                      <p className="text-xs text-slate-500 truncate flex items-center gap-1">
                        <GraduationCap className="w-3 h-3 flex-shrink-0" />
                        {session.package}
                      </p>
                      {session.universities && (
                        <p className="text-xs text-slate-400 truncate">{session.universities}</p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0 pl-8 sm:pl-0">
                    {session.zoom_join_url && (
                      <a
                        href={session.zoom_join_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-xs font-bold shadow-sm"
                      >
                        <Video className="w-3.5 h-3.5" />
                        Join
                      </a>
                    )}
                    <span className="text-xs text-slate-400 group-hover:text-indigo-500 transition-colors hidden sm:inline">
                      Add feedback →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Question Submissions ─────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <ClipboardList className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Question Bank</h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                <CircleDollarSign className="w-3.5 h-3.5" />
                £{submissionCounts.approved} earned
              </div>
              <button
                onClick={() => setIsAddQuestionModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all text-xs font-bold shadow-sm active:scale-[0.97]"
              >
                <Plus className="w-3.5 h-3.5" />
                Submit Question
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Earn £1 for each approved question
          </p>
        </div>

        {/* Tabs */}
        {questionSubmissions.length > 0 && (
          <div className="px-5 py-3 bg-slate-50/80 border-b border-slate-100 flex items-center gap-1.5">
            {(['pending', 'approved', 'rejected'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setSubmissionsTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  submissionsTab === tab
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-white'
                }`}
              >
                <span className="capitalize">{tab}</span>
                <span className={`ml-1 ${submissionsTab === tab ? 'text-indigo-200' : 'text-slate-400'}`}>
                  {submissionCounts[tab]}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Submissions list */}
        {submissionsLoading ? (
          <div className="p-8 text-center text-sm text-slate-400">Loading submissions...</div>
        ) : questionSubmissions.length === 0 ? (
          <div className="p-10 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-100 mb-3">
              <ClipboardList className="w-7 h-7 text-slate-300" />
            </div>
            <p className="text-slate-500 font-medium">No submissions yet</p>
            <p className="text-sm text-slate-400 mt-1">Submit questions to start earning</p>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-slate-400 text-sm">No {submissionsTab} submissions</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredSubmissions.map((submission) => {
              const status = normalizeSubmissionStatus(submission.status);
              const statusStyles =
                status === 'approved'
                  ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                  : status === 'rejected'
                  ? 'text-rose-700 bg-rose-50 border-rose-200'
                  : 'text-amber-700 bg-amber-50 border-amber-200';

              return (
                <div key={submission.id} className="px-5 py-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900 text-sm">
                          {submission.title || 'Untitled question'}
                        </h3>
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full border capitalize ${statusStyles}`}
                        >
                          {status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {submission.question_text}
                      </p>
                      {submission.created_at && (
                        <p className="text-[11px] text-slate-400 mt-1.5">
                          {formatDate(submission.created_at)}
                        </p>
                      )}
                      {status === 'rejected' && submission.rejection_reason && (
                        <div className="mt-2 flex items-start gap-2 rounded-lg bg-rose-50 border border-rose-100 px-3 py-2">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-rose-700">{submission.rejection_reason}</p>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedSubmission(submission as any)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors flex-shrink-0 active:scale-[0.97]"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Error Banner ──────────────────────────────────────── */}
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-rose-800">Something went wrong</p>
            <p className="text-xs text-rose-600 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* ── Modals ────────────────────────────────────────────── */}
      <SessionFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={handleCloseFeedbackModal}
        session={selectedSession}
      />

      <AddQuestionModal
        isOpen={isAddQuestionModalOpen}
        onClose={() => setIsAddQuestionModalOpen(false)}
        userId={tutorId}
        onSuccess={() => fetchQuestionSubmissions()}
      />

      <QuestionViewModal
        isOpen={!!selectedSubmission}
        onClose={() => setSelectedSubmission(null)}
        question={selectedSubmission as any}
        backendUrl={backendUrl}
        onQuestionUpdated={handleQuestionUpdated as any}
        allowEditing={false}
        allowStatusChange={false}
      />

      {/* Availability Modal */}
      {isAvailabilityModalOpen && (
        <AvailabilityModal />
      )}
    </div>
  );
};

export default TutorHome;