'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, Clock, CheckCircle, User, Video, Mail, GraduationCap, TrendingUp, Plus } from 'lucide-react';
import SessionFeedbackModal from './SessionFeedbackModal';
import AddQuestionModal from './AddQuestionModal';

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

interface TutorHomeProps {
  tutorId: string;
  tutorName?: string;
}

const TutorHome: React.FC<TutorHomeProps> = ({ tutorId, tutorName }) => {
  const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>([]);
  const [stats, setStats] = useState<SessionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<UpcomingSession | null>(null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';

  useEffect(() => {
    fetchTutorData();
  }, [tutorId]);

  const fetchTutorData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch upcoming sessions and stats
      const [sessionsRes, statsRes] = await Promise.all([
        fetch(`${backendUrl}/api/v1/tutors/${tutorId}/upcoming-sessions`),
        fetch(`${backendUrl}/api/v1/tutors/${tutorId}/session-stats`),
      ]);

      if (sessionsRes.ok) {
        const sessionsData = await sessionsRes.json();
        if (sessionsData.success) {
          setUpcomingSessions(sessionsData.data);
        }
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.success) {
          setStats(statsData.data);
        }
      }
    } catch (err: any) {
      console.error('Error fetching tutor data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
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
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeUntil = (dateString: string) => {
    const now = new Date();
    const sessionDate = new Date(dateString);
    const diffMs = sessionDate.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `in ${diffDays} day${diffDays > 1 ? 's' : ''}`;
    if (diffHours > 0) return `in ${diffHours} hour${diffHours > 1 ? 's' : ''}`;
    if (diffMins > 0) return `in ${diffMins} minute${diffMins > 1 ? 's' : ''}`;
    if (diffMins < 0 && diffMins > -60) return 'happening now';
    return 'passed';
  };

  const handleSessionClick = (session: UpcomingSession) => {
    setSelectedSession(session);
    setIsFeedbackModalOpen(true);
  };

  const handleCloseFeedbackModal = () => {
    setIsFeedbackModalOpen(false);
    setSelectedSession(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Welcome back{tutorName ? `, ${tutorName}` : ''}! 👋
            </h1>
            <p className="text-blue-100 text-sm sm:text-base">
              Here's an overview of your tutoring sessions
            </p>
          </div>
          <button
            onClick={() => setIsAddQuestionModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-colors font-medium shadow-md"
          >
            <Plus className="w-5 h-5" />
            Add Question
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs sm:text-sm font-medium text-gray-500">Total Completed</h3>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.totalCompleted}</p>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs sm:text-sm font-medium text-gray-500">Upcoming</h3>
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.totalUpcoming}</p>
            <p className="text-xs text-gray-500 mt-1">Scheduled</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs sm:text-sm font-medium text-gray-500">This Week</h3>
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.thisWeekCompleted}</p>
            <p className="text-xs text-gray-500 mt-1">Completed</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs sm:text-sm font-medium text-gray-500">This Month</h3>
              <TrendingUp className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.thisMonthCompleted}</p>
            <p className="text-xs text-gray-500 mt-1">Completed</p>
          </div>
        </div>
      )}

      {/* Upcoming Sessions */}
      <div className="bg-white rounded-xl shadow-md">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Upcoming Sessions</h2>
            </div>
            <span className="text-xs sm:text-sm text-gray-500 bg-blue-50 px-3 py-1 rounded-full">
              {upcomingSessions.length} session{upcomingSessions.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {upcomingSessions.length === 0 ? (
            <div className="p-8 text-center">
              <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No upcoming sessions scheduled</p>
              <p className="text-sm text-gray-400 mt-1">Check back later for new bookings</p>
            </div>
          ) : (
            upcomingSessions.map((session) => {
              const timeUntil = getTimeUntil(session.scheduled_at);
              const isImminentOrNow = timeUntil.includes('hour') || timeUntil === 'happening now';
              
              return (
                <div
                  key={session.id}
                  onClick={() => handleSessionClick(session)}
                  className={`p-4 sm:p-6 hover:bg-gray-50 transition-colors cursor-pointer ${
                    isImminentOrNow ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Date & Time */}
                    <div className="flex items-center gap-3 lg:w-48 flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex flex-col items-center justify-center flex-shrink-0">
                        <span className="text-xs text-blue-600 font-semibold">
                          {new Date(session.scheduled_at).toLocaleDateString('en-GB', { month: 'short' })}
                        </span>
                        <span className="text-lg font-bold text-blue-600">
                          {new Date(session.scheduled_at).getDate()}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {formatTime(session.scheduled_at)}
                        </div>
                        <p className={`text-xs ${isImminentOrNow ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>
                          {timeUntil}
                        </p>
                      </div>
                    </div>

                    {/* Student Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900 truncate">{session.studentName}</h3>
                          <div className="flex items-center gap-1 text-xs text-gray-600 truncate">
                            <Mail className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{session.studentEmail}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-sm">
                          <GraduationCap className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="text-gray-700 font-medium">{session.package}</span>
                        </div>
                        {session.universities && (
                          <p className="text-sm text-gray-600 line-clamp-1 pl-5">
                            {session.universities}
                          </p>
                        )}
                        {session.notes && (
                          <p className="text-xs text-gray-500 line-clamp-2 pl-5 mt-1">
                            {session.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    {session.zoom_join_url && (
                      <div className="lg:w-40 flex-shrink-0">
                        <a
                          href={session.zoom_join_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          <Video className="w-4 h-4" />
                          Join Session
                        </a>
                      </div>
                    )}
                  </div>
                  
                  {/* Click indicator */}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-blue-600 text-center">
                      Click to add feedback for this session
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Session Feedback Modal */}
      <SessionFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={handleCloseFeedbackModal}
        session={selectedSession}
      />

      {/* Add Question Modal */}
      <AddQuestionModal
        isOpen={isAddQuestionModalOpen}
        onClose={() => setIsAddQuestionModalOpen(false)}
        userId={tutorId}
        onSuccess={() => {
          console.log('Question created successfully');
        }}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default TutorHome;
