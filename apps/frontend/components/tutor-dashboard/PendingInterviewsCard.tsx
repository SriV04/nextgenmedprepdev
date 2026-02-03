'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, Clock, User, ChevronDown, ChevronUp, AlertCircle, Loader2 } from 'lucide-react';

interface AvailableTutor {
  id: string;
  name: string;
  email: string;
  field?: string;
  availability_slot_id: string;
}

interface PendingInterview {
  id: string;
  proposed_time: string;
  booking?: {
    email: string;
    field: string;
  };
  availableTutors: AvailableTutor[];
}

interface PendingInterviewsCardProps {
  tutorId: string;
  backendUrl: string;
  onInterviewClick?: (interviewId: string) => void;
  onAssignSuccess?: () => void;
}

const PendingInterviewsCard: React.FC<PendingInterviewsCardProps> = ({
  tutorId,
  backendUrl,
  onInterviewClick,
  onAssignSuccess,
}) => {
  const [pendingInterviews, setPendingInterviews] = useState<PendingInterview[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [assigning, setAssigning] = useState<{ interviewId: string; tutorId: string } | null>(null);
  const [assignError, setAssignError] = useState<string | null>(null);
  const [selectedTutors, setSelectedTutors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchPendingInterviews();
  }, []);

  const fetchPendingInterviews = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${backendUrl}/api/v1/interviews/pending-with-tutors`
      );
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch pending interviews');
      }

      setPendingInterviews(result.data || []);
    } catch (err: any) {
      console.error('Error fetching pending interviews:', err);
      setError(err.message || 'Failed to load pending interviews');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleRowClick = (interview: PendingInterview) => {
    if (onInterviewClick) {
      onInterviewClick(interview.id);
    }
  };

  const handleExpandClick = (e: React.MouseEvent, interviewId: string) => {
    e.stopPropagation();
    setExpandedId(expandedId === interviewId ? null : interviewId);
  };

  const handleAssignTutor = async (interviewId: string, selectedTutorId: string) => {
    try {
      setAssignError(null);
      setAssigning({ interviewId, tutorId: selectedTutorId });

      // Find the interview and selected tutor to get the availability_slot_id and proposed_time
      const interview = pendingInterviews.find((i) => i.id === interviewId);
      const selectedTutor = interview?.availableTutors.find((t) => t.id === selectedTutorId);

      if (!interview || !selectedTutor) {
        throw new Error('Interview or tutor not found');
      }

      // Ensure scheduled_at is in ISO 8601 format
      const scheduledAt = new Date(interview.proposed_time).toISOString();

      const response = await fetch(
        `${backendUrl}/api/v1/interviews/${interviewId}/assign`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tutor_id: selectedTutorId,
            scheduled_at: scheduledAt,
            availability_slot_id: selectedTutor.availability_slot_id,
          }),
        }
      );

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to assign tutor');
      }

      setPendingInterviews((prev) => prev.filter((i) => i.id !== interviewId));
      setSelectedTutors((prev) => {
        const next = { ...prev };
        delete next[interviewId];
        return next;
      });
      onAssignSuccess?.();
    } catch (err: any) {
      console.error('Error assigning tutor:', err);
      setAssignError(err.message || 'Failed to assign tutor');
    } finally {
      setAssigning(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex items-center justify-center gap-2 text-gray-600">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>Loading pending interviews...</span>
      </div>
    );
  }

  if (pendingInterviews.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center text-gray-500">
        <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p>No pending interviews awaiting assignment</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-orange-50">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          Pending Interviews ({pendingInterviews.length})
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Click to view details and assign tutors
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="px-6 py-3 bg-red-50 border-b border-red-200 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* List */}
      <div className="divide-y divide-gray-200">
        {pendingInterviews.map((interview) => (
          <div
            key={interview.id}
            className="hover:bg-gray-50 transition-colors"
          >
            <div
              role="button"
              tabIndex={0}
              onClick={() => handleRowClick(interview)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleRowClick(interview);
                }
              }}
              className="px-6 py-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold text-gray-900">
                      {interview.booking?.email?.split('@')[0] || 'Student'}
                    </span>
                    {interview.booking?.field && (
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        {interview.booking.field}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDateTime(interview.proposed_time)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{interview.availableTutors.length} tutors available</span>
                    </div>
                  </div>
                </div>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={(e) => handleExpandClick(e, interview.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleExpandClick(e as any, interview.id);
                    }
                  }}
                  className="p-1 hover:bg-gray-200 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label={expandedId === interview.id ? 'Collapse details' : 'Expand details'}
                >
                  {expandedId === interview.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  )}
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedId === interview.id && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 space-y-3">
                {assignError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    {assignError}
                  </div>
                )}
                {interview.availableTutors.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No available tutors found for this time
                  </p>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-gray-900 mb-3">
                      Available Tutors:
                    </p>
                    <div className="space-y-2">
                      {interview.availableTutors.map((tutor) => (
                        <button
                          key={tutor.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTutors((prev) => ({
                              ...prev,
                              [interview.id]: tutor.id,
                            }));
                          }}
                          disabled={!!assigning}
                          className={`w-full p-3 rounded-lg border-2 text-left transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-between gap-3 ${
                            selectedTutors[interview.id] === tutor.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                          }`}
                        >
                          <div>
                            <div className="font-medium text-gray-900">{tutor.name}</div>
                            <div className="text-sm text-gray-600">{tutor.email}</div>
                          </div>
                          {selectedTutors[interview.id] === tutor.id && (
                            <div className="text-xs font-semibold text-blue-700">Selected</div>
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTutors((prev) => {
                            const next = { ...prev };
                            delete next[interview.id];
                            return next;
                          });
                        }}
                        disabled={!selectedTutors[interview.id] || !!assigning}
                        className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Clear
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const assignTutorId = selectedTutors[interview.id];
                          if (assignTutorId) {
                            handleAssignTutor(interview.id, assignTutorId);
                          }
                        }}
                        disabled={!selectedTutors[interview.id] || !!assigning}
                        className="px-5 py-2 rounded-lg bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {assigning?.interviewId === interview.id ? 'Assigning...' : 'Confirm assignment'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingInterviewsCard;
