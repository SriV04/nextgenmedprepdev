'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Info, Save, MessageSquare, HelpCircle } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  feedback: string;
}

interface SessionFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: {
    id: string;
    studentName: string;
    studentEmail: string;
    scheduled_at: string;
    package: string;
    universities?: string;
  } | null;
}

const SessionFeedbackModal: React.FC<SessionFeedbackModalProps> = ({
  isOpen,
  onClose,
  session,
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showInfo, setShowInfo] = useState(true);

  useEffect(() => {
    if (isOpen && session) {
      // Reset state when modal opens
      setQuestions([]);
      setShowInfo(true);
    }
  }, [isOpen, session]);

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      question: '',
      feedback: '',
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, field: 'question' | 'feedback', value: string) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleSave = () => {
    // TODO: Implement backend save when ready
    console.log('Saving feedback for session:', session?.id);
    console.log('Questions and feedback:', questions);
    alert('Feedback saved! (Local only - backend integration pending)');
    onClose();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
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

  if (!isOpen || !session) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Session Feedback</h2>
            <div className="text-sm text-gray-600">
              <p className="font-medium">{session.studentName}</p>
              <p>{formatDate(session.scheduled_at)} at {formatTime(session.scheduled_at)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Info Section */}
        {showInfo && (
          <div className="mx-6 mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">How to Use This Tool</h3>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>Add questions that were discussed during the interview</li>
                  <li>For each question, provide detailed feedback on the student's response</li>
                  <li>Include strengths, areas for improvement, and specific examples</li>
                  <li>Your feedback will help the student prepare better for future interviews</li>
                </ul>
              </div>
              <button
                onClick={() => setShowInfo(false)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Got it
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {questions.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Questions Added Yet</h3>
              <p className="text-gray-500 mb-6">Start by adding the first interview question</p>
              <button
                onClick={addQuestion}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus className="w-5 h-5" />
                Add First Question
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {questions.map((q, index) => (
                <div key={q.id} className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                  {/* Question Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-blue-600" />
                        Question {index + 1}
                      </h4>
                    </div>
                    <button
                      onClick={() => removeQuestion(q.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove question"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Question Input */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Interview Question
                    </label>
                    <textarea
                      value={q.question}
                      onChange={(e) => updateQuestion(q.id, 'question', e.target.value)}
                      placeholder="e.g., Tell me about a time when you had to work in a team..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={3}
                    />
                  </div>

                  {/* Feedback Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Feedback for This Question
                    </label>
                    <textarea
                      value={q.feedback}
                      onChange={(e) => updateQuestion(q.id, 'feedback', e.target.value)}
                      placeholder="Provide detailed feedback on the student's answer. Include strengths, weaknesses, and suggestions for improvement..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={5}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      {q.feedback.length} characters
                    </p>
                  </div>
                </div>
              ))}

              {/* Add Another Question Button */}
              <button
                onClick={addQuestion}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-gray-600 hover:text-blue-600 font-medium"
              >
                <Plus className="w-5 h-5" />
                Add Another Question
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            {questions.length === 0 ? (
              <span>No questions added</span>
            ) : (
              <span>
                {questions.length} question{questions.length !== 1 ? 's' : ''} added
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium text-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={questions.length === 0}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-colors ${
                questions.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <Save className="w-5 h-5" />
              Save Feedback
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionFeedbackModal;
