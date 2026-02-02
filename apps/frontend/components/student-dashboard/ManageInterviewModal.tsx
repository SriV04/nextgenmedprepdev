'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface ManageInterviewModalProps {
  interview: {
    id: string;
    university?: string;
    notes?: string;
    scheduled_at: string | null;
    tutor?: {
      id: string;
      name: string;
      email: string;
    };
    booking?: {
      package?: string;
    };
  };
  isOpen: boolean;
  onClose: () => void;
  onSave: (interviewId: string, updates: { university?: string; notes?: string }) => Promise<void>;
}

export default function ManageInterviewModal({
  interview,
  isOpen,
  onClose,
  onSave,
}: ManageInterviewModalProps) {
  const [university, setUniversity] = useState(interview.university || '');
  const [notes, setNotes] = useState(interview.notes || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      await onSave(interview.id, {
        university: university.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update interview');
    } finally {
      setIsSaving(false);
    }
  };

  const scheduledDate = interview.scheduled_at ? new Date(interview.scheduled_at) : null;
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

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Manage Interview</h3>
            <p className="text-sm text-gray-600">Update interview details</p>
          </div>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Interview Details Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
            <h4 className="text-sm font-semibold text-blue-900">Interview Details</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p>
                <span className="font-medium">Package:</span>{' '}
                {interview.booking?.package || 'Interview Session'}
              </p>
              {interview.tutor && (
                <p>
                  <span className="font-medium">Tutor:</span> {interview.tutor.name}
                </p>
              )}
              <p>
                <span className="font-medium">Date:</span> {formattedDate}
                {formattedTime && ` at ${formattedTime}`}
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* University Field */}
          <div>
            <label
              htmlFor="university"
              className="block text-sm font-semibold text-gray-900 mb-2"
            >
              University / Focus
            </label>
            <input
              type="text"
              id="university"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              placeholder="e.g., Oxford, Cambridge, Imperial"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSaving}
            />
            <p className="mt-1 text-sm text-gray-500">
              Specify which university or area you'd like to focus on during this interview.
            </p>
          </div>

          {/* Notes Field */}
          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-semibold text-gray-900 mb-2"
            >
              Additional Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any specific topics, questions, or areas you'd like to cover..."
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              disabled={isSaving}
            />
            <p className="mt-1 text-sm text-gray-500">
              Share any specific preparation notes or topics you want to focus on.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
