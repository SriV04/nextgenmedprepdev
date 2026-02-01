'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, CheckCircle2, Loader2 } from 'lucide-react';

interface FollowUpQuestion {
  order: number;
  text: string;
}

interface QuestionSkillCriterion {
  skill_group: 'core' | 'extra';
  skill_code: string;
  max_marks: number;
  guidance?: string | null;
  display_order?: number | null;
  skill_definitions?: {
    display_name?: string | null;
  } | null;
}

interface PrometheusQuestion {
  id: string;
  title?: string | null;
  question_text: string;
  category?: string | null;
  difficulty?: string | null;
  status?: string | null;
  notes?: string | null;
  rejection_reason?: string | null;
  follow_up_questions?: FollowUpQuestion[];
  question_tags?: Array<{ tag: string }>;
  question_skill_criteria?: QuestionSkillCriterion[];
}

interface QuestionViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: PrometheusQuestion | null;
  backendUrl: string;
  onQuestionUpdated?: (updatedQuestion: PrometheusQuestion) => void;
  allowEditing?: boolean;
  allowStatusChange?: boolean;
}

const QuestionViewModal: React.FC<QuestionViewModalProps> = ({
  isOpen,
  onClose,
  question,
  backendUrl,
  onQuestionUpdated,
  allowEditing = false,
  allowStatusChange = false,
}) => {
  const [questionDraft, setQuestionDraft] = useState<PrometheusQuestion | null>(null);
  const [rejectionReasonDraft, setRejectionReasonDraft] = useState('');
  const [savingQuestionId, setSavingQuestionId] = useState<string | null>(null);
  const [updatingQuestionId, setUpdatingQuestionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!question) {
      setQuestionDraft(null);
      setRejectionReasonDraft('');
      setError(null);
      return;
    }
    setQuestionDraft({
      ...question,
      follow_up_questions: question.follow_up_questions
        ? [...question.follow_up_questions].sort((a, b) => a.order - b.order)
        : [],
      question_skill_criteria: question.question_skill_criteria
        ? [...question.question_skill_criteria].sort(
            (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
          )
        : [],
    });
    setRejectionReasonDraft(question.rejection_reason || '');
  }, [question]);

  const updateQuestionStatus = async (
    questionId: string,
    status: 'approved' | 'rejected',
    rejectionReason?: string
  ) => {
    try {
      setUpdatingQuestionId(questionId);
      setError(null);
      const response = await fetch(
        `${backendUrl}/api/v1/prometheus/questions/${questionId}/status`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status,
            rejection_reason: status === 'rejected' ? rejectionReason?.trim() || null : null,
          }),
        }
      );
      if (!response.ok) throw new Error('Failed to update question status');
      const result = await response.json();
      if (result.success) {
        onQuestionUpdated?.(result.data);
      } else {
        setError(result.message || 'Failed to update question status');
      }
    } catch (err: any) {
      console.error('Error updating question status:', err);
      setError(err.message || 'Failed to update question status');
    } finally {
      setUpdatingQuestionId(null);
    }
  };

  const saveQuestionEdits = async () => {
    if (!questionDraft) return;
    try {
      setSavingQuestionId(questionDraft.id);
      setError(null);

      const followUps = (questionDraft.follow_up_questions || [])
        .map((item, index) => ({
          order: index + 1,
          text: item.text.trim(),
        }))
        .filter((item) => item.text.length > 0);

      const skillCriteria = (questionDraft.question_skill_criteria || []).map((skill, index) => ({
        skill_code: skill.skill_code,
        skill_group: skill.skill_group,
        max_marks: Number(skill.max_marks) || 0,
        guidance: skill.guidance || undefined,
        display_order: skill.display_order ?? index + 1,
      }));

      const payload = {
        title: questionDraft.title || undefined,
        question_text: questionDraft.question_text,
        category: questionDraft.category || undefined,
        difficulty: questionDraft.difficulty || undefined,
        notes: questionDraft.notes || undefined,
        follow_up_questions: followUps,
        skill_criteria: skillCriteria,
      };

      const response = await fetch(`${backendUrl}/api/v1/prometheus/questions/${questionDraft.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to update question');
      const result = await response.json();
      if (result.success) {
        onQuestionUpdated?.(result.data);
      } else {
        setError(result.message || 'Failed to update question');
      }
    } catch (err: any) {
      console.error('Error updating question:', err);
      setError(err.message || 'Failed to update question');
    } finally {
      setSavingQuestionId(null);
    }
  };

  if (!isOpen || !question) return null;

  const isPending = (question.status || 'pending') === 'pending';
  const isApproved = (question.status || 'pending') === 'approved';
  const isRejected = (question.status || 'pending') === 'rejected';
  const canEdit = allowEditing && (isPending || isApproved);
  const canChangeStatus = allowStatusChange && (isPending || isApproved);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-6">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {question.title || 'Untitled question'}
            </h3>
            <p className="text-sm text-gray-500">Review question details{canEdit ? ' and take action' : ''}.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Close question modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-4 max-h-[65vh] overflow-y-auto">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-gray-500">Status:</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                (question.status || 'pending') === 'approved'
                  ? 'bg-emerald-100 text-emerald-700'
                  : (question.status || 'pending') === 'rejected'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-amber-100 text-amber-700'
              }`}
            >
              {question.status || 'pending'}
            </span>
          </div>

          {questionDraft && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600">Title</label>
                  <input
                    type="text"
                    value={questionDraft.title || ''}
                    onChange={(event) =>
                      setQuestionDraft((prev) =>
                        prev ? { ...prev, title: event.target.value } : prev
                      )
                    }
                    disabled={!canEdit}
                    className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600">Difficulty</label>
                  <input
                    type="text"
                    value={questionDraft.difficulty || ''}
                    onChange={(event) =>
                      setQuestionDraft((prev) =>
                        prev ? { ...prev, difficulty: event.target.value } : prev
                      )
                    }
                    disabled={!canEdit}
                    className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <p className="font-semibold text-gray-800 mb-2">Question text</p>
                <textarea
                  value={questionDraft.question_text}
                  onChange={(event) =>
                    setQuestionDraft((prev) =>
                      prev ? { ...prev, question_text: event.target.value } : prev
                    )
                  }
                  disabled={!canEdit}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none disabled:bg-gray-50"
                  rows={4}
                />
              </div>
            </>
          )}

          <div className="flex flex-wrap gap-2 text-xs text-gray-500">
            {questionDraft?.category && (
              <span className="px-2 py-1 bg-gray-100 rounded-full">{questionDraft.category}</span>
            )}
            {question.question_tags && question.question_tags.length > 0 && (
              <span className="px-2 py-1 bg-gray-100 rounded-full">
                {question.question_tags.map((tag) => tag.tag).join(', ')}
              </span>
            )}
            {questionDraft?.question_skill_criteria &&
              questionDraft.question_skill_criteria.some((skill) => skill.skill_group === 'core') && (
                <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full">
                  Core skills:{' '}
                  {questionDraft.question_skill_criteria
                    .filter((skill) => skill.skill_group === 'core')
                    .map((skill) => skill.skill_definitions?.display_name || skill.skill_code)
                    .join(', ')}
                </span>
              )}
          </div>

          {isRejected && question.rejection_reason && (
            <div className="mt-3 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              <p className="font-semibold text-red-800 mb-1">Rejection reason</p>
              <p>{question.rejection_reason}</p>
            </div>
          )}

          {questionDraft && (
            <>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-slate-800 mb-3">Follow-up questions</p>
                <div className="space-y-2">
                  {(questionDraft.follow_up_questions || []).length === 0 ? (
                    <p className="text-xs text-gray-500 italic">No follow-up questions</p>
                  ) : (
                    (questionDraft.follow_up_questions || []).map((item, index) => (
                      <div key={`${item.order}-${index}`} className="flex items-start gap-2">
                        <span className="mt-2 text-xs font-semibold text-slate-500">#{index + 1}</span>
                        <textarea
                          value={item.text}
                          onChange={(event) =>
                            setQuestionDraft((prev) => {
                              if (!prev) return prev;
                              const nextFollowUps = [...(prev.follow_up_questions || [])];
                              nextFollowUps[index] = {
                                ...nextFollowUps[index],
                                text: event.target.value,
                              };
                              return { ...prev, follow_up_questions: nextFollowUps };
                            })
                          }
                          disabled={!canEdit}
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50"
                          rows={2}
                        />
                        {canEdit && (
                          <button
                            type="button"
                            onClick={() =>
                              setQuestionDraft((prev) => {
                                if (!prev) return prev;
                                const nextFollowUps = [...(prev.follow_up_questions || [])];
                                nextFollowUps.splice(index, 1);
                                return {
                                  ...prev,
                                  follow_up_questions: nextFollowUps.map((fq, idx) => ({
                                    ...fq,
                                    order: idx + 1,
                                  })),
                                };
                              })
                            }
                            className="mt-2 text-xs text-red-500 hover:text-red-600"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))
                  )}
                  {canEdit && (
                    <button
                      type="button"
                      onClick={() =>
                        setQuestionDraft((prev) => {
                          if (!prev) return prev;
                          const nextFollowUps = [...(prev.follow_up_questions || [])];
                          nextFollowUps.push({ order: nextFollowUps.length + 1, text: '' });
                          return { ...prev, follow_up_questions: nextFollowUps };
                        })
                      }
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                    >
                      + Add follow-up question
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-800 mb-3">Mark allocations</p>
                <div className="space-y-3">
                  {(questionDraft.question_skill_criteria || []).length === 0 ? (
                    <p className="text-xs text-gray-500 italic">No skill criteria defined</p>
                  ) : (
                    (questionDraft.question_skill_criteria || []).map((skill, index) => (
                      <div key={`${skill.skill_code}-${index}`} className="border border-gray-100 rounded-lg p-3">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {skill.skill_definitions?.display_name || skill.skill_code}
                            </p>
                            <p className="text-xs text-gray-500">Group: {skill.skill_group}</p>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-xs text-gray-500">Max marks</span>
                            <input
                              type="number"
                              min={0}
                              max={10}
                              value={skill.max_marks ?? 0}
                              onChange={(event) =>
                                setQuestionDraft((prev) => {
                                  if (!prev) return prev;
                                  const nextSkills = [...(prev.question_skill_criteria || [])];
                                  nextSkills[index] = {
                                    ...nextSkills[index],
                                    max_marks: Number(event.target.value),
                                  };
                                  return { ...prev, question_skill_criteria: nextSkills };
                                })
                              }
                              disabled={!canEdit}
                              className="w-20 px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50"
                            />
                          </div>
                        </div>
                        <textarea
                          value={skill.guidance || ''}
                          onChange={(event) =>
                            setQuestionDraft((prev) => {
                              if (!prev) return prev;
                              const nextSkills = [...(prev.question_skill_criteria || [])];
                              nextSkills[index] = {
                                ...nextSkills[index],
                                guidance: event.target.value,
                              };
                              return { ...prev, question_skill_criteria: nextSkills };
                            })
                          }
                          disabled={!canEdit}
                          className="mt-3 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50"
                          rows={2}
                          placeholder="Guidance or marking notes"
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-slate-800 mb-3">Notes</p>
                <textarea
                  value={questionDraft.notes || ''}
                  onChange={(event) =>
                    setQuestionDraft((prev) => (prev ? { ...prev, notes: event.target.value } : prev))
                  }
                  disabled={!canEdit}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50"
                  rows={3}
                  placeholder="Add any internal notes for this question"
                />
              </div>
            </>
          )}
        </div>

        {canChangeStatus && (
          <div className="mt-4">
            <label className="text-xs font-semibold text-gray-600">Rejection reason (optional)</label>
            <textarea
              value={rejectionReasonDraft}
              onChange={(event) => setRejectionReasonDraft(event.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              rows={3}
              placeholder="Share a clear reason to help the tutor improve the question"
            />
          </div>
        )}

        {(canEdit || canChangeStatus) && (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {canEdit && (
              <button
                onClick={saveQuestionEdits}
                disabled={savingQuestionId === question.id || !questionDraft}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-60"
              >
                {savingQuestionId === question.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save edits
              </button>
            )}
            {canChangeStatus && (
              <>
                <button
                  onClick={() => updateQuestionStatus(question.id, 'approved')}
                  disabled={updatingQuestionId === question.id}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-60"
                >
                  {updatingQuestionId === question.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  Approve
                </button>
                <button
                  onClick={() => updateQuestionStatus(question.id, 'rejected', rejectionReasonDraft)}
                  disabled={updatingQuestionId === question.id}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-60"
                >
                  {updatingQuestionId === question.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                  Reject
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionViewModal;
