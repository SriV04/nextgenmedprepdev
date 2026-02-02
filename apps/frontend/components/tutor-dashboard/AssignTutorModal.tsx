'use client';

import React, { useState } from 'react';
import { X, Check, AlertCircle, Loader2 } from 'lucide-react';

interface AvailableTutor {
  id: string;
  name: string;
  email: string;
  field?: string;
}

interface AssignTutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  interviewId: string;
  studentEmail?: string;
  proposedTime?: string;
  availableTutors: AvailableTutor[];
  onAssignSuccess?: () => void;
}

const AssignTutorModal: React.FC<AssignTutorModalProps> = ({
  isOpen,
  onClose,
  interviewId,
  studentEmail,
  proposedTime,
  availableTutors,
  onAssignSuccess,
}) => {
  const [selectedTutorId, setSelectedTutorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';

  if (!isOpen) return null;

  const handleAssign = async () => {
    if (!selectedTutorId) {
      setError('Please select a tutor');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${backendUrl}/api/v1/interviews/${interviewId}/assign-tutor`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tutor_id: selectedTutorId,
          }),
        }
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to assign tutor');
      }

      setSuccess(true);
      setTimeout(() => {
        onAssignSuccess?.();
        onClose();
        setSuccess(false);
        setSelectedTutorId(null);
      }, 2000);
    } catch (err: any) {
      console.error('Error assigning tutor:', err);
      setError(err.message || 'Failed to assign tutor');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Assign Tutor</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-gray-900 font-semibold">Tutor assigned successfully!</p>
            </div>
          ) : (
            <>
              {/* Interview Details */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-semibold">Student:</span> {studentEmail}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Proposed Time:</span> {formatDateTime(proposedTime)}
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Tutor List */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Available Tutors ({availableTutors.length})
                </label>
                {availableTutors.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No available tutors found for this time
                  </p>
                ) : (
                  <div className="space-y-2">
                    {availableTutors.map((tutor) => (
                      <button
                        key={tutor.id}
                        onClick={() => setSelectedTutorId(tutor.id)}
                        className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                          selectedTutorId === tutor.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-semibold text-gray-900">{tutor.name}</div>
                        <div className="text-sm text-gray-600">{tutor.email}</div>
                        {tutor.field && (
                          <div className="text-xs text-gray-500 mt-1">
                            Field: {tutor.field}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssign}
                  disabled={!selectedTutorId || loading}
                  className="flex-1 px-4 py-2 bg-blue-600 rounded-lg font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Assign Tutor
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignTutorModal;
