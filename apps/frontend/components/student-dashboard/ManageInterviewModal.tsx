'use client';

import { useState, useEffect } from 'react';
import { X, Search, GraduationCap } from 'lucide-react';

interface University {
  id: string;
  name: string;
}

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
  const [universities, setUniversities] = useState<University[]>([]);
  const [universitySearchQuery, setUniversitySearchQuery] = useState('');
  const [showUniversityDropdown, setShowUniversityDropdown] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';

  // Fetch universities on mount
  useEffect(() => {
    if (isOpen) {
      fetchUniversities();
    }
  }, [isOpen]);

  const fetchUniversities = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/v1/universities`);
      const data = await response.json();
      if (data.success) {
        setUniversities(data.data);
      }
    } catch (error) {
      console.error('Error fetching universities:', error);
    }
  };

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

  const filteredUniversities = universities.filter((uni) =>
    uni.name.toLowerCase().includes(universitySearchQuery.toLowerCase())
  );

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
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              <GraduationCap className="w-4 h-4 inline mr-1" />
              University
            </label>
            <div className="relative">
              <div
                onClick={() => setShowUniversityDropdown(!showUniversityDropdown)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent cursor-pointer bg-white"
              >
                {university ? (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900">{university}</span>
                    <X
                      className="w-4 h-4 text-gray-400 hover:text-gray-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        setUniversity('');
                        setUniversitySearchQuery('');
                        setShowUniversityDropdown(false);
                      }}
                    />
                  </div>
                ) : (
                  <span className="text-gray-500">Select a university...</span>
                )}
              </div>

              {showUniversityDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                  <div className="p-3 border-b border-gray-200">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={universitySearchQuery}
                        onChange={(e) => setUniversitySearchQuery(e.target.value)}
                        placeholder="Search universities..."
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {filteredUniversities.length === 0 ? (
                      <p className="p-3 text-sm text-gray-500 text-center">No universities found</p>
                    ) : (
                      filteredUniversities.map((uni) => (
                        <button
                          key={uni.id}
                          type="button"
                          onClick={() => {
                            setUniversity(uni.name);
                            setShowUniversityDropdown(false);
                            setUniversitySearchQuery('');
                          }}
                          className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors ${
                            university === uni.name ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                          }`}
                        >
                          <span className="text-sm text-gray-900">{uni.name}</span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Specify which university you'd like to focus on during this interview.
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
