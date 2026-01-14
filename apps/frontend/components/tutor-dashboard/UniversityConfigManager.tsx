'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp, ClipboardCheck, Loader2, Plus, RefreshCw, Save, Search, Tag, Trash2, X } from 'lucide-react';
import { UK_MEDICAL_SCHOOLS } from '../../data/universities';

interface UniversityTagConfig {
  tag: string;
  notes?: Record<string, unknown> | null;
}

interface UniversityStation {
  id: string;
  question_type: string;
  station_index: number;
  station_name?: string | null;
  duration_minutes?: number | null;
  notes?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  university: string;
  university_tag_configs?: UniversityTagConfig[];
}

interface TagDraft {
  selectedTags: string[];
  notesByTag: Record<string, string>;
}

const OTHER_TAG = 'other';
const OTHER_QUESTION_TYPE = 'Other';
const QUESTION_TYPES = ['MMI', 'Group Task', 'Oxbridge', OTHER_QUESTION_TYPE] as const;

const normalizeNotes = (notes?: Record<string, unknown> | null) => {
  if (!notes) return '';
  if (typeof notes === 'string') return notes;
  if (typeof notes.text === 'string') return notes.text;
  return '';
};

const getStationLabel = (station: UniversityStation) => {
  const label = station.station_name?.trim();
  return label ? `${station.station_index}. ${label}` : `Station ${station.station_index}`;
};

const createEmptyDraft = (): TagDraft => ({
  selectedTags: [],
  notesByTag: {},
});

interface PendingQuestion {
  id: string;
  title?: string | null;
  question_text: string;
  category?: string | null;
  difficulty?: string | null;
  status?: string | null;
  question_tags?: Array<{ tag: string }>;
}

interface PrometheusQuestion {
  id: string;
  title?: string | null;
  question_text: string;
  category?: string | null;
  difficulty?: string | null;
  status?: string | null;
  question_tags?: Array<{ tag: string }>;
}

export default function UniversityConfigManager({ backendUrl }: { backendUrl: string }) {
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [stations, setStations] = useState<UniversityStation[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [stationError, setStationError] = useState<string | null>(null);
  const [stationLoading, setStationLoading] = useState(false);
  const [tagLoading, setTagLoading] = useState(false);
  const [tagError, setTagError] = useState<string | null>(null);
  const [creatingStation, setCreatingStation] = useState(false);
  const [savingTags, setSavingTags] = useState<Record<string, boolean>>({});
  const [tagDrafts, setTagDrafts] = useState<Record<string, TagDraft>>({});
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [pendingQuestions, setPendingQuestions] = useState<PendingQuestion[]>([]);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [pendingError, setPendingError] = useState<string | null>(null);
  const [updatingQuestionId, setUpdatingQuestionId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<PrometheusQuestion[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [questionsError, setQuestionsError] = useState<string | null>(null);
  const [questionFilters, setQuestionFilters] = useState({
    status: 'all',
    difficulty: 'all',
    category: 'all',
    search: '',
  });
  const [questionViewerExpanded, setQuestionViewerExpanded] = useState(true);
  const [stationForm, setStationForm] = useState({
    question_type: '',
    station_index: '',
    station_name: '',
    duration_minutes: '',
    notes: '',
    is_active: true,
  });

  const universities = useMemo(() => {
    return [...UK_MEDICAL_SCHOOLS]
      .map((school) => ({
        id: school.id,
        label: school.displayName || school.name,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, []);

  useEffect(() => {
    const loadTags = async () => {
      try {
        setTagLoading(true);
        setTagError(null);
        const response = await fetch(`${backendUrl}/api/v1/prometheus/tags`);
        if (!response.ok) throw new Error('Failed to load tags');
        const result = await response.json();
        if (result.success) {
          setTags(result.data.map((tag: { tag: string }) => tag.tag));
        } else {
          setTagError(result.message || 'Failed to load tags');
        }
      } catch (error: any) {
        setTagError(error.message || 'Failed to load tags');
      } finally {
        setTagLoading(false);
      }
    };
    loadTags();
  }, [backendUrl]);

  useEffect(() => {
    if (!selectedUniversity) {
      setStations([]);
      setTagDrafts({});
      return;
    }
    const loadStations = async () => {
      try {
        setStationLoading(true);
        setStationError(null);
        const response = await fetch(
          `${backendUrl}/api/v1/prometheus/university-stations?university=${encodeURIComponent(selectedUniversity)}`
        );
        if (!response.ok) throw new Error('Failed to load stations');
        const result = await response.json();
        if (result.success) {
          const data = result.data as UniversityStation[];
          setStations(data);
          const draftState: Record<string, TagDraft> = {};
          data.forEach((station) => {
            const selectedTags =
              station.university_tag_configs?.map((config) => config.tag) || [];
            const notesByTag: Record<string, string> = {};
            station.university_tag_configs?.forEach((config) => {
              const noteValue = normalizeNotes(config.notes);
              if (noteValue) {
                notesByTag[config.tag] = noteValue;
              }
            });
            draftState[station.id] = {
              selectedTags,
              notesByTag,
            };
          });
          setTagDrafts(draftState);
        } else {
          setStationError(result.message || 'Failed to load stations');
        }
      } catch (error: any) {
        setStationError(error.message || 'Failed to load stations');
      } finally {
        setStationLoading(false);
      }
    };
    loadStations();
  }, [backendUrl, selectedUniversity]);

  useEffect(() => {
    if (!showApprovalModal) return;
    const loadPendingQuestions = async () => {
      try {
        setPendingLoading(true);
        setPendingError(null);
        const response = await fetch(`${backendUrl}/api/v1/prometheus/questions?status=pending`);
        if (!response.ok) throw new Error('Failed to load pending questions');
        const result = await response.json();
        if (result.success) {
          setPendingQuestions(result.data as PendingQuestion[]);
        } else {
          setPendingError(result.message || 'Failed to load pending questions');
        }
      } catch (error: any) {
        setPendingError(error.message || 'Failed to load pending questions');
      } finally {
        setPendingLoading(false);
      }
    };
    loadPendingQuestions();
  }, [backendUrl, showApprovalModal]);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setQuestionsLoading(true);
        setQuestionsError(null);
        const params = new URLSearchParams();
        if (questionFilters.status !== 'all') {
          params.set('status', questionFilters.status);
        }
        if (questionFilters.difficulty !== 'all') {
          params.set('difficulty', questionFilters.difficulty);
        }
        if (questionFilters.category !== 'all') {
          params.set('category', questionFilters.category);
        }
        const response = await fetch(
          `${backendUrl}/api/v1/prometheus/questions${params.toString() ? `?${params.toString()}` : ''}`
        );
        if (!response.ok) throw new Error('Failed to load questions');
        const result = await response.json();
        if (result.success) {
          setQuestions(result.data as PrometheusQuestion[]);
        } else {
          setQuestionsError(result.message || 'Failed to load questions');
        }
      } catch (error: any) {
        setQuestionsError(error.message || 'Failed to load questions');
      } finally {
        setQuestionsLoading(false);
      }
    };
    loadQuestions();
  }, [
    backendUrl,
    questionFilters.status,
    questionFilters.difficulty,
    questionFilters.category,
  ]);

  const handleCreateStation = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedUniversity) {
      setStationError('Select a university before adding stations.');
      return;
    }

    try {
      setCreatingStation(true);
      setStationError(null);
      const response = await fetch(`${backendUrl}/api/v1/prometheus/university-stations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question_type: stationForm.question_type.trim(),
          station_index: Number(stationForm.station_index),
          station_name: stationForm.station_name.trim() || null,
          duration_minutes: stationForm.duration_minutes ? Number(stationForm.duration_minutes) : null,
          notes: stationForm.question_type === OTHER_QUESTION_TYPE ? stationForm.notes.trim() || null : null,
          is_active: stationForm.is_active,
          university: selectedUniversity,
        }),
      });

      if (!response.ok) throw new Error('Failed to create station');
      const result = await response.json();
      if (result.success) {
        const station = result.data as UniversityStation;
        setStations((prev) => [...prev, station].sort((a, b) => a.station_index - b.station_index));
        setTagDrafts((prev) => ({
          ...prev,
          [station.id]: createEmptyDraft(),
        }));
        setStationForm({
          question_type: '',
          station_index: '',
          station_name: '',
          duration_minutes: '',
          notes: '',
          is_active: true,
        });
      } else {
        setStationError(result.message || 'Failed to create station');
      }
    } catch (error: any) {
      setStationError(error.message || 'Failed to create station');
    } finally {
      setCreatingStation(false);
    }
  };

  const updateDraft = (stationId: string, updater: (draft: TagDraft) => TagDraft) => {
    setTagDrafts((prev) => {
      const current = prev[stationId] || createEmptyDraft();
      return {
        ...prev,
        [stationId]: updater(current),
      };
    });
  };

  const handleSaveTags = async (stationId: string) => {
    const draft = tagDrafts[stationId] || createEmptyDraft();
    setSavingTags((prev) => ({ ...prev, [stationId]: true }));

    try {
      const tagsPayload = draft.selectedTags.map((tag) => {
        const isOther = tag.toLowerCase() === OTHER_TAG;
        const notesText = draft.notesByTag[tag]?.trim();
        return {
          tag,
          notes: isOther && notesText ? { text: notesText } : null,
        };
      });

      const response = await fetch(
        `${backendUrl}/api/v1/prometheus/university-stations/${stationId}/tags`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tags: tagsPayload }),
        }
      );

      if (!response.ok) throw new Error('Failed to update tags');
      const result = await response.json();
      if (result.success) {
        setStations((prev) =>
          prev.map((station) => (station.id === stationId ? result.data : station))
        );
      } else {
        setStationError(result.message || 'Failed to update tags');
      }
    } catch (error: any) {
      setStationError(error.message || 'Failed to update tags');
    } finally {
      setSavingTags((prev) => ({ ...prev, [stationId]: false }));
    }
  };

  const handleDeleteStation = async (stationId: string) => {
    const station = stations.find((item) => item.id === stationId);
    const stationLabel = station ? getStationLabel(station) : 'this station';
    if (!window.confirm(`Delete ${stationLabel}? This cannot be undone.`)) return;

    try {
      setStationError(null);
      const response = await fetch(
        `${backendUrl}/api/v1/prometheus/university-stations/${stationId}`,
        { method: 'DELETE' }
      );
      if (!response.ok) throw new Error('Failed to delete station');
      const result = await response.json();
      if (result.success) {
        setStations((prev) => prev.filter((item) => item.id !== stationId));
        setTagDrafts((prev) => {
          const next = { ...prev };
          delete next[stationId];
          return next;
        });
      } else {
        setStationError(result.message || 'Failed to delete station');
      }
    } catch (error: any) {
      setStationError(error.message || 'Failed to delete station');
    }
  };

  const updateQuestionStatus = async (questionId: string, status: 'approved' | 'rejected') => {
    try {
      setUpdatingQuestionId(questionId);
      setPendingError(null);
      const response = await fetch(
        `${backendUrl}/api/v1/prometheus/questions/${questionId}/status`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        }
      );
      if (!response.ok) throw new Error('Failed to update question status');
      const result = await response.json();
      if (result.success) {
        setPendingQuestions((prev) => prev.filter((item) => item.id !== questionId));
        setQuestions((prev) =>
          prev.map((item) =>
            item.id === questionId ? { ...item, status } : item
          )
        );
      } else {
        setPendingError(result.message || 'Failed to update question status');
      }
    } catch (error: any) {
      setPendingError(error.message || 'Failed to update question status');
    } finally {
      setUpdatingQuestionId(null);
    }
  };

  const questionCategories = useMemo(() => {
    return Array.from(
      new Set(questions.map((question) => question.category).filter(Boolean))
    ) as string[];
  }, [questions]);

  const questionDifficulties = useMemo(() => {
    return Array.from(
      new Set(questions.map((question) => question.difficulty).filter(Boolean))
    ) as string[];
  }, [questions]);

  const pendingCount = useMemo(() => {
    return questions.filter((question) => question.status === 'pending').length;
  }, [questions]);

  const filteredQuestions = useMemo(() => {
    const search = questionFilters.search.trim().toLowerCase();
    if (!search) return questions;
    return questions.filter((question) => {
      const title = question.title?.toLowerCase() || '';
      const body = question.question_text?.toLowerCase() || '';
      return title.includes(search) || body.includes(search);
    });
  }, [questions, questionFilters.search]);

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* Question Viewer Section */}
        <div className="bg-white rounded-2xl shadow-sm border-2 border-blue-100 p-6">
          <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4">
            <div className="flex-1">
              <button
                onClick={() => setQuestionViewerExpanded(!questionViewerExpanded)}
                className="flex items-center gap-2 text-left w-full group"
              >
                <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  Question Viewer
                </h2>
                {questionViewerExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                )}
              </button>
              <p className="text-sm text-gray-500 mt-1">
                Browse and approve submitted questions with live filters.
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
                <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                  Total: {questions.length}
                </span>
                <span className="px-2 py-1 rounded-full bg-amber-50 text-amber-700">
                  Pending: {pendingCount}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowApprovalModal(true)}
                className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-white rounded-lg bg-blue-600 hover:bg-blue-700 shadow-sm"
              >
                <ClipboardCheck className="w-4 h-4" />
                Review pending questions
              </button>
              <button
                onClick={() =>
                  setQuestionFilters((prev) => ({
                    ...prev,
                    status: 'all',
                    difficulty: 'all',
                    category: 'all',
                    search: '',
                  }))
                }
                className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-600 rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                <RefreshCw className="w-4 h-4" />
                Reset filters
              </button>
            </div>
          </div>

          {questionViewerExpanded && (
            <>
          <div className="mt-5 grid grid-cols-1 xl:grid-cols-[1.3fr_0.9fr_0.9fr_0.9fr] gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={questionFilters.search}
                onChange={(event) =>
                  setQuestionFilters((prev) => ({ ...prev, search: event.target.value }))
                }
                placeholder="Search by title or question text"
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
            </div>
            <select
              value={questionFilters.status}
              onChange={(event) =>
                setQuestionFilters((prev) => ({ ...prev, status: event.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={questionFilters.category}
              onChange={(event) =>
                setQuestionFilters((prev) => ({ ...prev, category: event.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            >
              <option value="all">All categories</option>
              {questionCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <select
              value={questionFilters.difficulty}
              onChange={(event) =>
                setQuestionFilters((prev) => ({ ...prev, difficulty: event.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            >
              <option value="all">All difficulty</option>
              {questionDifficulties.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {difficulty}
                </option>
              ))}
            </select>
          </div>

          {questionsError && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700 mt-4">
              {questionsError}
            </div>
          )}

          <div className="mt-5 space-y-4">
            {questionsLoading && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading questions...
              </div>
            )}
            {!questionsLoading && filteredQuestions.length === 0 && (
              <div className="text-sm text-gray-500 bg-gray-50 rounded-lg px-4 py-6 text-center">
                No questions match the current filters.
              </div>
            )}
            {filteredQuestions.map((question) => {
              const status = question.status || 'pending';
              const statusClass =
                status === 'approved'
                  ? 'bg-emerald-100 text-emerald-700'
                  : status === 'rejected'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-amber-100 text-amber-700';
              return (
                <div key={question.id} className="border border-gray-100 rounded-xl p-4 bg-white">
                  <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-base font-semibold text-gray-900">
                          {question.title || 'Untitled question'}
                        </h4>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusClass}`}>
                          {status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{question.question_text}</p>
                      <div className="flex flex-wrap gap-2 mt-3 text-xs text-gray-500">
                        {question.category && (
                          <span className="px-2 py-1 bg-gray-100 rounded-full">{question.category}</span>
                        )}
                        {question.difficulty && (
                          <span className="px-2 py-1 bg-gray-100 rounded-full">{question.difficulty}</span>
                        )}
                        {question.question_tags && question.question_tags.length > 0 && (
                          <span className="px-2 py-1 bg-gray-100 rounded-full">
                            {question.question_tags.map((tag) => tag.tag).join(', ')}
                          </span>
                        )}
                      </div>
                    </div>
                    {status === 'pending' && (
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => updateQuestionStatus(question.id, 'approved')}
                          disabled={updatingQuestionId === question.id}
                          className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-60"
                        >
                          {updatingQuestionId === question.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4" />
                          )}
                          Approve
                        </button>
                        <button
                          onClick={() => updateQuestionStatus(question.id, 'rejected')}
                          disabled={updatingQuestionId === question.id}
                          className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-60"
                        >
                          {updatingQuestionId === question.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <X className="w-4 h-4" />
                          )}
                          Disapprove
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
            </>
          )}
        </div>

        {/* University Station Configurations Section */}
        <div className="bg-white rounded-2xl shadow-sm border-2 border-green-100 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">University Station Configurations</h2>
              <p className="text-sm text-gray-500 mt-1">
                Build station templates and map tags for each university interview.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500 bg-gray-50 px-3 py-2 rounded-full">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Admin & manager only
              </div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select university</label>
              <select
                value={selectedUniversity}
                onChange={(event) => setSelectedUniversity(event.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose a university</option>
                {universities.map((uni) => (
                  <option key={uni.id} value={uni.id}>
                    {uni.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Tag className="w-4 h-4" />
                {tagLoading && 'Loading tags...'}
                {!tagLoading && tagError && (
                  <span className="text-red-600">{tagError}</span>
                )}
                {!tagLoading && !tagError && `${tags.length} tags available`}
              </div>
            </div>
          </div>
        </div>

        {stationError && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
            {stationError}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_1.9fr] gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create station</h3>
            <form onSubmit={handleCreateStation} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Question type</label>
                <select
                  value={stationForm.question_type}
                  onChange={(event) =>
                    setStationForm((prev) => ({ ...prev, question_type: event.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Choose a type</option>
                  {QUESTION_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              {stationForm.question_type === OTHER_QUESTION_TYPE && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    value={stationForm.notes}
                    onChange={(event) =>
                      setStationForm((prev) => ({ ...prev, notes: event.target.value }))
                    }
                    placeholder="Add notes for the Other question type"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Station Number</label>
                  <input
                    type="number"
                    min="1"
                    value={stationForm.station_index}
                    onChange={(event) =>
                      setStationForm((prev) => ({ ...prev, station_index: event.target.value }))
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (mins)</label>
                  <input
                    type="number"
                    min="1"
                    value={stationForm.duration_minutes}
                    onChange={(event) =>
                      setStationForm((prev) => ({ ...prev, duration_minutes: event.target.value }))
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Station name</label>
                <input
                  type="text"
                  value={stationForm.station_name}
                  onChange={(event) =>
                    setStationForm((prev) => ({ ...prev, station_name: event.target.value }))
                  }
                  placeholder="Optional display name"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={stationForm.is_active}
                  onChange={(event) =>
                    setStationForm((prev) => ({ ...prev, is_active: event.target.checked }))
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Active station
              </label>
              <button
                type="submit"
                disabled={creatingStation || !selectedUniversity}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {creatingStation ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Add station
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Current station configs</h3>
                <p className="text-sm text-gray-500">Review and adjust tags for each station.</p>
              </div>
              {stationLoading && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
            </div>
            {!selectedUniversity && (
              <div className="text-sm text-gray-500 bg-gray-50 rounded-lg px-4 py-6 text-center">
                Select a university to load station configs.
              </div>
            )}
            {selectedUniversity && !stationLoading && stations.length === 0 && (
              <div className="text-sm text-gray-500 bg-gray-50 rounded-lg px-4 py-6 text-center">
                No stations configured yet. Add the first station on the left.
              </div>
            )}
            <div className="space-y-4">
              {stations.map((station) => {
                const draft = tagDrafts[station.id] || createEmptyDraft();
                return (
                  <div key={station.id} className="border border-gray-100 rounded-xl p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
                      <div>
                        <h4 className="text-base font-semibold text-gray-900">
                          {getStationLabel(station)}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {station.question_type}
                          {station.duration_minutes ? ` · ${station.duration_minutes} mins` : ''}
                          {!station.is_active ? ' · inactive' : ''}
                        </p>
                        {station.notes && (
                          <p className="text-xs text-gray-400 mt-1">Notes: {station.notes}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDeleteStation(station.id)}
                          className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                        <button
                          onClick={() => handleSaveTags(station.id)}
                          disabled={savingTags[station.id]}
                          className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-60"
                        >
                          {savingTags[station.id] ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                          Save tags
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                      {tags.map((tag) => {
                        const isSelected = draft.selectedTags.includes(tag);
                        const isOther = tag.toLowerCase() === OTHER_TAG;
                        return (
                          <div key={`${station.id}-${tag}`} className="border border-gray-100 rounded-lg px-3 py-2">
                            <label className="flex items-center gap-2 text-sm text-gray-700">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(event) => {
                                  const checked = event.target.checked;
                                  updateDraft(station.id, (current) => {
                                    const nextTags = checked
                                      ? [...current.selectedTags, tag]
                                      : current.selectedTags.filter((t) => t !== tag);
                                    const nextNotes = { ...current.notesByTag };
                                    if (!checked) delete nextNotes[tag];
                                    return {
                                      selectedTags: nextTags,
                                      notesByTag: nextNotes,
                                    };
                                  });
                                }}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              {tag}
                            </label>
                            {isSelected && isOther && (
                              <textarea
                                value={draft.notesByTag[tag] || ''}
                                onChange={(event) => {
                                  const value = event.target.value;
                                  updateDraft(station.id, (current) => ({
                                    ...current,
                                    notesByTag: { ...current.notesByTag, [tag]: value },
                                  }));
                                }}
                                placeholder="Add notes for the Other tag"
                                className="mt-2 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows={2}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {station.university_tag_configs && station.university_tag_configs.length > 0 && (
                      <div className="mt-4 text-sm text-gray-500">
                        Current tags:{' '}
                        {station.university_tag_configs
                          .map((config) => {
                            const note = normalizeNotes(config.notes);
                            return note ? `${config.tag} (${note})` : config.tag;
                          })
                          .join(', ')}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {showApprovalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-6">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Pending Questions</h3>
                <p className="text-sm text-gray-500">Approve new submissions before they go live.</p>
              </div>
              <button
                onClick={() => setShowApprovalModal(false)}
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label="Close approval modal"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            {pendingLoading && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading pending questions...
              </div>
            )}
            {pendingError && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
                {pendingError}
              </div>
            )}
            {!pendingLoading && !pendingError && pendingQuestions.length === 0 && (
              <div className="text-sm text-gray-500 bg-gray-50 rounded-lg px-4 py-6 text-center">
                No pending questions at the moment.
              </div>
            )}
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {pendingQuestions.map((question) => (
                <div key={question.id} className="border border-gray-100 rounded-xl p-4">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                    <div>
                      <h4 className="text-base font-semibold text-gray-900">
                        {question.title || 'Untitled question'}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">{question.question_text}</p>
                      <div className="flex flex-wrap gap-2 mt-3 text-xs text-gray-500">
                        {question.category && <span className="px-2 py-1 bg-gray-100 rounded-full">{question.category}</span>}
                        {question.difficulty && <span className="px-2 py-1 bg-gray-100 rounded-full">{question.difficulty}</span>}
                        {question.question_tags && question.question_tags.length > 0 && (
                          <span className="px-2 py-1 bg-gray-100 rounded-full">
                            {question.question_tags.map((tag) => tag.tag).join(', ')}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => updateQuestionStatus(question.id, 'approved')}
                        disabled={updatingQuestionId === question.id}
                        className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-60"
                      >
                        {updatingQuestionId === question.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4" />
                        )}
                        Approve
                      </button>
                      <button
                        onClick={() => updateQuestionStatus(question.id, 'rejected')}
                        disabled={updatingQuestionId === question.id}
                        className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-60"
                      >
                        {updatingQuestionId === question.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                        Disapprove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
