'use client';

import { useState } from 'react';
import { useStudent, Session } from '@/contexts/StudentContext';

export default function SessionsList() {
  const { upcomingSessions, previousSessions, loading } = useStudent();
  const [activeFilter, setActiveFilter] = useState<'upcoming' | 'previous'>('upcoming');

  const displaySessions = activeFilter === 'upcoming' ? upcomingSessions : previousSessions;

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Buttons */}
      <div className="flex space-x-4 border-b border-gray-200 pb-4">
        <button
          onClick={() => setActiveFilter('upcoming')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            activeFilter === 'upcoming'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Upcoming ({upcomingSessions.length})
        </button>
        <button
          onClick={() => setActiveFilter('previous')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            activeFilter === 'previous'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Previous ({previousSessions.length})
        </button>
      </div>

      {/* Sessions List */}
      {displaySessions.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No {activeFilter} sessions
          </h3>
          <p className="text-gray-600">
            {activeFilter === 'upcoming'
              ? "You don't have any upcoming sessions scheduled yet."
              : "You don't have any previous sessions."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displaySessions.map((session) => (
            <SessionCard key={session.id} session={session} isUpcoming={activeFilter === 'upcoming'} />
          ))}
        </div>
      )}
    </div>
  );
}

interface SessionCardProps {
  session: Session;
  isUpcoming: boolean;
}

function SessionCard({ session, isUpcoming }: SessionCardProps) {
  const scheduledDate = session.scheduled_at ? new Date(session.scheduled_at) : null;
  const formattedDate = scheduledDate
    ? scheduledDate.toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Not scheduled';
  const formattedTime = scheduledDate
    ? scheduledDate.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  const getStatusBadge = () => {
    if (session.completed) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Completed
        </span>
      );
    }
    
    if (session.status === 'scheduled' || session.status === 'confirmed') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          Scheduled
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        {session.status}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {session.university || 'Interview Session'}
            </h3>
            {getStatusBadge()}
          </div>
          {scheduledDate && (
            <div className="text-right ml-4">
              <div className="text-sm font-medium text-gray-900">{formattedDate}</div>
              {formattedTime && <div className="text-sm text-gray-600">{formattedTime}</div>}
            </div>
          )}
        </div>

        {/* Tutor Info */}
        {session.tutors && (
          <div className="mb-4 flex items-center text-sm text-gray-600">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span>Tutor: {session.tutors.name}</span>
          </div>
        )}

        {/* Notes */}
        {session.notes && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Notes:</span> {session.notes}
            </p>
          </div>
        )}

        {/* Student Feedback */}
        {session.student_feedback && (
          <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-900">
              <span className="font-medium">Your Feedback:</span> {session.student_feedback}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-3 mt-4">
          {isUpcoming && session.zoom_join_url && (
            <a
              href={session.zoom_join_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center font-medium"
            >
              Join Zoom Session
            </a>
          )}
          {!isUpcoming && !session.student_feedback && (
            <button
              onClick={() => {
                // TODO: Implement feedback submission
                alert('Feedback submission feature coming soon!');
              }}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Provide Feedback
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
