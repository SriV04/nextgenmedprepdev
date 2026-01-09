'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  X,
  Info,
  Save,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Award,
  Target,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Search,
  RotateCcw,
  Keyboard,
} from 'lucide-react';

interface FollowUpQuestion {
  order: number;
  text: string;
}

interface SkillCriterion {
  id: string;
  skillCode: string;
  displayName: string;
  skillGroup: 'core' | 'extra';
  maxMarks: number;
  guidance: string;
  displayOrder: number;
  marksAwarded: number;
  examinerComment: string;
}

interface InterviewQuestion {
  id: string;
  questionText: string;
  title: string;
  category: string;
  difficulty: string;
  interviewType: string;
  followUpQuestions: FollowUpQuestion[];
  skillCriteria: SkillCriterion[];
  studentResponse: string;
  generalFeedback: string;
  overallScore: number;
  notes: string;
  rubricLevel?: 'excellent' | 'good' | 'average' | 'needs_improvement';
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

type SaveState = 'idle' | 'dirty' | 'saving' | 'saved' | 'error';

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function formatTime(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function computeTotals(skills: SkillCriterion[]) {
  const total = skills.reduce((sum, s) => sum + (s.marksAwarded ?? 0), 0);
  const max = skills.reduce((sum, s) => sum + (s.maxMarks ?? 0), 0);
  return { total, max };
}

const badgeForDifficulty = (difficulty: string) => {
  const d = (difficulty || '').toLowerCase();
  if (d === 'easy') return 'bg-emerald-200 text-emerald-900';
  if (d === 'medium') return 'bg-amber-200 text-amber-900';
  return 'bg-rose-200 text-rose-900';
};

const rubricOptions: { key: InterviewQuestion['rubricLevel']; label: string }[] = [
  { key: 'excellent', label: 'Excellent' },
  { key: 'good', label: 'Good' },
  { key: 'average', label: 'Average' },
  { key: 'needs_improvement', label: 'Needs improvement' },
];

const MarkPill: React.FC<{
  value: number;
  active: boolean;
  onClick: () => void;
  colorClass: string;
}> = ({ value, active, onClick, colorClass }) => (
  <button
    type="button"
    onClick={onClick}
    className={[
      'w-8 h-8 rounded-md text-xs font-bold transition-all select-none',
      active ? `${colorClass} text-white shadow-sm scale-[1.03]` : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500',
    ].join(' ')}
    aria-pressed={active}
  >
    {value}
  </button>
);

const SkillCard: React.FC<{
  skill: SkillCriterion;
  accent: 'blue' | 'green';
  onMark: (marks: number) => void;
  onComment: (comment: string) => void;
  requireCommentWhenZero?: boolean;
  showGuidance?: boolean;
}> = ({ skill, accent, onMark, onComment, requireCommentWhenZero = true, showGuidance = true }) => {
  const colorClass = accent === 'blue' ? 'bg-blue-600' : 'bg-green-600';
  const ringClass = accent === 'blue' ? 'focus:ring-blue-500' : 'focus:ring-green-500';
  const warn = requireCommentWhenZero && skill.marksAwarded === 0 && (skill.examinerComment || '').trim().length === 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-sm text-gray-900 truncate">{skill.displayName}</h4>
            <span className="text-[11px] text-gray-500">
              {skill.marksAwarded}/{skill.maxMarks}
            </span>
            {warn && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                <AlertTriangle className="w-3.5 h-3.5" />
                Comment required at 0
              </span>
            )}
          </div>

          {showGuidance && (
            <p className="mt-1 text-[12px] text-gray-600 leading-snug">{skill.guidance}</p>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {[0, 1, 2].map((m) => (
            <MarkPill
              key={m}
              value={m}
              active={skill.marksAwarded === m}
              onClick={() => onMark(m)}
              colorClass={colorClass}
            />
          ))}
        </div>
      </div>

      <div className="mt-2">
        <textarea
          value={skill.examinerComment}
          onChange={(e) => onComment(e.target.value)}
          placeholder="Evidence-based comment (what they did well / what to improve)…"
          className={[
            'w-full px-3 py-2 border rounded-md text-sm resize-none',
            warn ? 'border-amber-300 bg-amber-50/40' : 'border-gray-200 bg-white',
            'focus:outline-none focus:ring-2 focus:ring-offset-1',
            ringClass,
          ].join(' ')}
          rows={2}
        />
      </div>
    </div>
  );
};

const SessionFeedbackModal: React.FC<SessionFeedbackModalProps> = ({ isOpen, onClose, session }) => {
  const [showInfo, setShowInfo] = useState(true);
  const [coreExpanded, setCoreExpanded] = useState(true);
  const [extraExpanded, setExtraExpanded] = useState(true);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showGuidance, setShowGuidance] = useState(true);
  const [skillSearch, setSkillSearch] = useState('');
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);

  const initialRef = useRef<InterviewQuestion | null>(null);
  const lastSavedAtRef = useRef<number | null>(null);
  const autosaveTimerRef = useRef<number | null>(null);

  // Mock data (replace with API load)
  const [interviewQuestion, setInterviewQuestion] = useState<InterviewQuestion>({
    id: 'mock-q-1',
    questionText:
      'Tell me about a time you observed a difficult interaction in a healthcare setting and what you learned from it.',
    title: 'Difficult interaction in healthcare',
    category: 'staple',
    difficulty: 'medium',
    interviewType: 'mmi',
    followUpQuestions: [
      { order: 1, text: 'How was the situation handled and what would you have done similarly or differently?' },
      { order: 2, text: 'What did this show you about the pressures of a career in medicine?' },
      { order: 3, text: 'How did this impact your view of patient care?' },
    ],
    skillCriteria: [
      { id: '1', skillCode: 'communication', displayName: 'Communication', skillGroup: 'core', maxMarks: 2, guidance: 'How communication styles defused or escalated the issue', displayOrder: 1, marksAwarded: 0, examinerComment: '' },
      { id: '2', skillCode: 'empathy', displayName: 'Empathy', skillGroup: 'core', maxMarks: 2, guidance: 'Awareness of emotions of patient, family, or staff involved', displayOrder: 2, marksAwarded: 0, examinerComment: '' },
      { id: '3', skillCode: 'understanding_doctors_role', displayName: "Understanding the Doctor's Role", skillGroup: 'core', maxMarks: 2, guidance: 'Recognition of emotional, ethical, or interpersonal responsibilities of doctors', displayOrder: 3, marksAwarded: 0, examinerComment: '' },
      { id: '4', skillCode: 'teamwork', displayName: 'Teamwork', skillGroup: 'core', maxMarks: 2, guidance: 'Reflection on how staff supported one another', displayOrder: 4, marksAwarded: 0, examinerComment: '' },
      { id: '5', skillCode: 'leadership', displayName: 'Leadership', skillGroup: 'core', maxMarks: 2, guidance: 'Observed or discussed how someone led in a tense moment', displayOrder: 5, marksAwarded: 0, examinerComment: '' },

      { id: '6', skillCode: 'compassion', displayName: 'Compassion', skillGroup: 'extra', maxMarks: 2, guidance: 'Caring approach to patient and peer relationships', displayOrder: 1, marksAwarded: 0, examinerComment: '' },
      { id: '7', skillCode: 'problem_solving', displayName: 'Problem Solving', skillGroup: 'extra', maxMarks: 2, guidance: 'Ability to think logically and adapt under pressure', displayOrder: 2, marksAwarded: 0, examinerComment: '' },
      { id: '8', skillCode: 'time_management', displayName: 'Time Management', skillGroup: 'extra', maxMarks: 2, guidance: 'Prioritising tasks and maintaining balance', displayOrder: 3, marksAwarded: 0, examinerComment: '' },
      { id: '9', skillCode: 'medical_knowledge', displayName: 'Medical Knowledge', skillGroup: 'extra', maxMarks: 2, guidance: 'Curiosity and understanding of relevant medical topics', displayOrder: 4, marksAwarded: 0, examinerComment: '' },
      { id: '10', skillCode: 'manual_dexterity', displayName: 'Manual Dexterity', skillGroup: 'extra', maxMarks: 2, guidance: 'Relevant procedural or clinical skill awareness (if applicable)', displayOrder: 5, marksAwarded: 0, examinerComment: '' },
    ],
    studentResponse: '',
    generalFeedback: '',
    overallScore: 0,
    notes: '',
    rubricLevel: undefined,
  });

  // Reset when opened
  useEffect(() => {
    if (isOpen && session) {
      setShowInfo(true);
      setCoreExpanded(true);
      setExtraExpanded(true);
      setShowShortcuts(false);
      setShowGuidance(true);
      setSkillSearch('');
      setSaveState('idle');
      setSaveError(null);

      // snapshot initial state for "Reset"
      initialRef.current = JSON.parse(JSON.stringify(interviewQuestion));
      lastSavedAtRef.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, session]);

  // Derived lists + totals
  const { coreSkills, extraSkills } = useMemo(() => {
    const sorted = [...interviewQuestion.skillCriteria].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
    const q = (skillSearch || '').trim().toLowerCase();
    const filtered = q
      ? sorted.filter((s) => `${s.displayName} ${s.guidance}`.toLowerCase().includes(q))
      : sorted;

    return {
      coreSkills: filtered.filter((s) => s.skillGroup === 'core'),
      extraSkills: filtered.filter((s) => s.skillGroup === 'extra'),
    };
  }, [interviewQuestion.skillCriteria, skillSearch]);

  const coreTotals = useMemo(() => computeTotals(coreSkills), [coreSkills]);
  const extraTotals = useMemo(() => computeTotals(extraSkills), [extraSkills]);
  const allTotals = useMemo(() => computeTotals(interviewQuestion.skillCriteria), [interviewQuestion.skillCriteria]);

  const completion = useMemo(() => {
    const totalCriteria = interviewQuestion.skillCriteria.length;
    const graded = interviewQuestion.skillCriteria.filter((s) => typeof s.marksAwarded === 'number').length;
    const pct = totalCriteria === 0 ? 0 : Math.round((graded / totalCriteria) * 100);

    const missingZeroComments = interviewQuestion.skillCriteria.filter(
      (s) => s.marksAwarded === 0 && (s.examinerComment || '').trim().length === 0
    ).length;

    const hasStudentResponse = (interviewQuestion.studentResponse || '').trim().length > 0;
    const hasGeneralFeedback = (interviewQuestion.generalFeedback || '').trim().length > 0;

    return { pct, graded, totalCriteria, missingZeroComments, hasStudentResponse, hasGeneralFeedback };
  }, [interviewQuestion]);

  // Mark dirty whenever something changes (simple heuristic)
  useEffect(() => {
    if (!isOpen) return;
    setSaveState((prev) => (prev === 'saving' ? prev : 'dirty'));
  }, [interviewQuestion, isOpen]);

  // Autosave (debounced) – replace console with API call later
  const performSave = useCallback(async () => {
    setSaveError(null);
    setSaveState('saving');

    try {
      // TODO: replace with real backend call:
      // await api.saveSessionFeedback(session!.id, interviewQuestion)
      await new Promise((r) => setTimeout(r, 450)); // simulate latency

      lastSavedAtRef.current = Date.now();
      setSaveState('saved');
      // revert saved to idle after a short time
      window.setTimeout(() => {
        setSaveState((s) => (s === 'saved' ? 'idle' : s));
      }, 1200);
    } catch (e: any) {
      setSaveState('error');
      setSaveError(e?.message ?? 'Failed to save');
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    if (saveState !== 'dirty') return;

    if (autosaveTimerRef.current) window.clearTimeout(autosaveTimerRef.current);
    autosaveTimerRef.current = window.setTimeout(() => {
      performSave();
    }, 900);

    return () => {
      if (autosaveTimerRef.current) window.clearTimeout(autosaveTimerRef.current);
    };
  }, [saveState, performSave, isOpen]);

  // Keyboard shortcuts: Cmd/Ctrl+S save, Esc close
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toLowerCase().includes('mac');
      const mod = isMac ? e.metaKey : e.ctrlKey;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }

      if (mod && e.key.toLowerCase() === 's') {
        e.preventDefault();
        performSave();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose, performSave]);

  const updateSkillMark = useCallback((skillId: string, marks: number) => {
    setInterviewQuestion((prev) => ({
      ...prev,
      skillCriteria: prev.skillCriteria.map((skill) =>
        skill.id === skillId ? { ...skill, marksAwarded: clamp(marks, 0, skill.maxMarks) } : skill
      ),
    }));
  }, []);

  const updateSkillComment = useCallback((skillId: string, comment: string) => {
    setInterviewQuestion((prev) => ({
      ...prev,
      skillCriteria: prev.skillCriteria.map((skill) => (skill.id === skillId ? { ...skill, examinerComment: comment } : skill)),
    }));
  }, []);

  const setGroupMarks = useCallback((group: 'core' | 'extra' | 'all', marks: 0 | 1 | 2) => {
    setInterviewQuestion((prev) => ({
      ...prev,
      skillCriteria: prev.skillCriteria.map((s) => {
        if (group === 'all' || s.skillGroup === group) {
          return { ...s, marksAwarded: clamp(marks, 0, s.maxMarks) };
        }
        return s;
      }),
    }));
  }, []);

  const resetToInitial = useCallback(() => {
    if (!initialRef.current) return;
    setInterviewQuestion(JSON.parse(JSON.stringify(initialRef.current)));
    setSaveState('dirty');
  }, []);

  const handleClose = useCallback(() => {
    // optional: if dirty, you could warn — keeping it simple but functional
    onClose();
  }, [onClose]);

  const canSubmit = useMemo(() => {
    // practical constraints: no missing comments for zeros, plus at least some written feedback
    if (completion.missingZeroComments > 0) return false;
    if (!completion.hasGeneralFeedback) return false;
    return true;
  }, [completion]);

  const saveIndicator = useMemo(() => {
    if (saveState === 'saving') return { icon: <Loader2 className="w-4 h-4 animate-spin" />, text: 'Saving…' };
    if (saveState === 'saved') return { icon: <CheckCircle2 className="w-4 h-4" />, text: 'Saved' };
    if (saveState === 'error') return { icon: <AlertTriangle className="w-4 h-4" />, text: 'Save failed' };
    if (saveState === 'dirty') return { icon: <AlertTriangle className="w-4 h-4" />, text: 'Unsaved changes' };
    return { icon: <CheckCircle2 className="w-4 h-4" />, text: 'Up to date' };
  }, [saveState]);

  if (!isOpen || !session) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[9999] bg-black/60" onClick={handleClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-none">
        <div className="pointer-events-auto bg-white rounded-2xl shadow-2xl w-full max-w-[1600px] h-[92vh] overflow-hidden flex flex-col border border-gray-200">
          {/* Header (sticky style) */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-700 to-blue-800 text-white">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 min-w-0">
                <h2 className="text-base font-semibold truncate">{session.studentName}</h2>

                <span className="px-2 py-0.5 bg-white/95 text-blue-700 text-[11px] font-semibold rounded uppercase">
                  {interviewQuestion.interviewType}
                </span>

                <span className={`px-2 py-0.5 text-[11px] font-semibold rounded ${badgeForDifficulty(interviewQuestion.difficulty)}`}>
                  {interviewQuestion.difficulty}
                </span>

                <span className="text-xs text-blue-100 ml-2 whitespace-nowrap">
                  {formatDate(session.scheduled_at)} • {formatTime(session.scheduled_at)}
                </span>
              </div>

              <div className="mt-1 flex items-center gap-3 text-xs text-blue-100">
                <span className="truncate">{session.studentEmail}</span>
                <span className="text-blue-200">•</span>
                <span className="truncate">Package: {session.package}</span>
                {session.universities && (
                  <>
                    <span className="text-blue-200">•</span>
                    <span className="truncate">Universities: {session.universities}</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowShortcuts((s) => !s)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-white/10 hover:bg-white/15 transition-colors text-xs"
              >
                <Keyboard className="w-4 h-4" />
                Shortcuts
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Optional info / shortcuts */}
          <div className="px-5 pt-3 space-y-2">
            {showInfo && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5 flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-700 mt-0.5" />
                <div className="text-xs text-blue-900 leading-snug flex-1">
                  <span className="font-semibold">Workflow:</span> grade skills (0–2), add brief evidence-based comments, then complete general feedback.
                  Autosave runs in the background; use Cmd/Ctrl+S to force save.
                </div>
                <button
                  type="button"
                  onClick={() => setShowInfo(false)}
                  className="text-blue-700 hover:text-blue-900 text-xs font-semibold"
                >
                  Dismiss
                </button>
              </div>
            )}

            {showShortcuts && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-700">
                <div className="font-semibold text-gray-900 mb-1">Keyboard shortcuts</div>
                <ul className="list-disc ml-5 space-y-0.5">
                  <li><span className="font-semibold">Cmd/Ctrl + S</span>: Save now</li>
                  <li><span className="font-semibold">Esc</span>: Close</li>
                </ul>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden px-5 pb-4 pt-3">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
              {/* LEFT: Question + narrative */}
              <div className="h-full overflow-y-auto pr-1 space-y-4">
                {/* Question card */}
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-gray-900">{interviewQuestion.title}</h3>
                      <p className="mt-1 text-sm text-gray-700 leading-snug">{interviewQuestion.questionText}</p>

                      {interviewQuestion.followUpQuestions.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-purple-200">
                          <div className="text-[11px] font-semibold text-purple-900 uppercase tracking-wide">
                            Follow-ups
                          </div>
                          <div className="mt-2 space-y-2">
                            {interviewQuestion.followUpQuestions
                              .slice()
                              .sort((a, b) => a.order - b.order)
                              .map((fq) => (
                                <div key={fq.order} className="flex items-start gap-2">
                                  <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                                    {fq.order}
                                  </span>
                                  <p className="text-sm text-gray-700 leading-snug">{fq.text}</p>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Student response */}
                <div className="bg-white border border-gray-200 rounded-2xl p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[11px] font-semibold text-gray-900 uppercase tracking-wide">Student response</div>
                    <div className="text-[11px] text-gray-500">Capture key evidence/quotes</div>
                  </div>
                  <textarea
                    value={interviewQuestion.studentResponse}
                    onChange={(e) => setInterviewQuestion((prev) => ({ ...prev, studentResponse: e.target.value }))}
                    placeholder="Type as the student answers…"
                    className="mt-2 w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 resize-none"
                    rows={6}
                  />
                </div>

                {/* General feedback */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[11px] font-semibold text-gray-900 uppercase tracking-wide">General feedback</div>
                    <div className="text-[11px] text-amber-800">Required before submit</div>
                  </div>
                  <textarea
                    value={interviewQuestion.generalFeedback}
                    onChange={(e) => setInterviewQuestion((prev) => ({ ...prev, generalFeedback: e.target.value }))}
                    placeholder="Overall strengths, key improvements, and one actionable next step…"
                    className="mt-2 w-full px-3 py-2.5 border border-amber-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 resize-none bg-white"
                    rows={6}
                  />
                </div>

                {/* Rubric + score + notes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white border border-gray-200 rounded-2xl p-4">
                    <div className="text-[11px] font-semibold text-gray-900 uppercase tracking-wide">Overall rubric</div>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {rubricOptions.map((opt) => (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => setInterviewQuestion((prev) => ({ ...prev, rubricLevel: opt.key }))}
                          className={[
                            'px-3 py-2 rounded-xl text-sm font-semibold border transition-colors',
                            interviewQuestion.rubricLevel === opt.key
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50',
                          ].join(' ')}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>

                    <div className="mt-4">
                      <div className="text-[11px] font-semibold text-gray-900 uppercase tracking-wide">Overall score /10</div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {Array.from({ length: 11 }, (_, i) => i).map((mark) => (
                          <button
                            key={mark}
                            type="button"
                            onClick={() => setInterviewQuestion((prev) => ({ ...prev, overallScore: mark }))}
                            className={[
                              'w-9 h-9 rounded-xl text-sm font-bold border transition-all',
                              interviewQuestion.overallScore === mark
                                ? 'bg-purple-600 text-white border-purple-600 scale-[1.03]'
                                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50',
                            ].join(' ')}
                          >
                            {mark}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-2xl p-4">
                    <div className="text-[11px] font-semibold text-gray-900 uppercase tracking-wide">Notes (optional)</div>
                    <textarea
                      value={interviewQuestion.notes}
                      onChange={(e) => setInterviewQuestion((prev) => ({ ...prev, notes: e.target.value }))}
                      placeholder="Anything else worth capturing for later…"
                      className="mt-2 w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 resize-none"
                      rows={10}
                    />
                  </div>
                </div>
              </div>

              {/* RIGHT: Skills + tools */}
              <div className="h-full overflow-hidden flex flex-col">
                {/* Tools row */}
                <div className="bg-white border border-gray-200 rounded-2xl p-3">
                  <div className="flex flex-col md:flex-row md:items-center gap-3">
                    <div className="flex-1 relative">
                      <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        value={skillSearch}
                        onChange={(e) => setSkillSearch(e.target.value)}
                        placeholder="Search skills or guidance…"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowGuidance((v) => !v)}
                        className="px-3 py-2 rounded-xl border border-gray-200 text-sm font-semibold hover:bg-gray-50"
                      >
                        {showGuidance ? 'Hide guidance' : 'Show guidance'}
                      </button>

                      <button
                        type="button"
                        onClick={resetToInitial}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-sm font-semibold hover:bg-gray-50"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Reset
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-semibold text-gray-900">Quick mark:</span>
                    <button
                      type="button"
                      onClick={() => setGroupMarks('core', 2)}
                      className="px-2.5 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 font-semibold hover:bg-blue-100"
                    >
                      Core = 2
                    </button>
                    <button
                      type="button"
                      onClick={() => setGroupMarks('core', 1)}
                      className="px-2.5 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 font-semibold hover:bg-blue-100"
                    >
                      Core = 1
                    </button>
                    <button
                      type="button"
                      onClick={() => setGroupMarks('core', 0)}
                      className="px-2.5 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 font-semibold hover:bg-blue-100"
                    >
                      Core = 0
                    </button>

                    <button
                      type="button"
                      onClick={() => setGroupMarks('extra', 2)}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold hover:bg-emerald-100"
                    >
                      Extra = 2
                    </button>
                    <button
                      type="button"
                      onClick={() => setGroupMarks('all', 2)}
                      className="px-2.5 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 font-semibold hover:bg-gray-100"
                    >
                      All = 2
                    </button>

                    <span className="ml-auto text-gray-600">
                      Completion: <span className="font-semibold text-gray-900">{completion.pct}%</span>
                      {completion.missingZeroComments > 0 && (
                        <span className="ml-2 text-amber-700 font-semibold">
                          • {completion.missingZeroComments} zero-mark comment{completion.missingZeroComments === 1 ? '' : 's'} needed
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Skills panels */}
                <div className="flex-1 overflow-y-auto mt-4 pr-1 space-y-4">
                  {/* Core */}
                  <div className="border border-blue-200 rounded-2xl overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() => setCoreExpanded((v) => !v)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-blue-600 text-white"
                    >
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        <span className="font-semibold text-sm">Core skills</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold bg-white text-blue-700 px-2 py-1 rounded-lg">
                          {coreTotals.total}/{coreTotals.max}
                        </span>
                        {coreExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>

                    {coreExpanded && (
                      <div className="p-4 bg-blue-50/40 space-y-3">
                        {coreSkills.length === 0 ? (
                          <div className="text-sm text-gray-600">No core skills match your search.</div>
                        ) : (
                          coreSkills.map((s) => (
                            <SkillCard
                              key={s.id}
                              skill={s}
                              accent="blue"
                              onMark={(m) => updateSkillMark(s.id, m)}
                              onComment={(c) => updateSkillComment(s.id, c)}
                              showGuidance={showGuidance}
                            />
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  {/* Extra */}
                  <div className="border border-emerald-200 rounded-2xl overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() => setExtraExpanded((v) => !v)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-emerald-600 text-white"
                    >
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        <span className="font-semibold text-sm">Extra skills</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold bg-white text-emerald-700 px-2 py-1 rounded-lg">
                          {extraTotals.total}/{extraTotals.max}
                        </span>
                        {extraExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>

                    {extraExpanded && (
                      <div className="p-4 bg-emerald-50/40 space-y-3">
                        {extraSkills.length === 0 ? (
                          <div className="text-sm text-gray-600">No extra skills match your search.</div>
                        ) : (
                          extraSkills.map((s) => (
                            <SkillCard
                              key={s.id}
                              skill={s}
                              accent="green"
                              onMark={(m) => updateSkillMark(s.id, m)}
                              onComment={(c) => updateSkillComment(s.id, c)}
                              showGuidance={showGuidance}
                            />
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 bg-gray-50 px-5 py-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-gray-900">
                  Total: {allTotals.total}/{allTotals.max}
                </span>
                <span className="text-gray-600">
                  (Core {coreTotals.total}/{coreTotals.max} • Extra {extraTotals.total}/{extraTotals.max} • Score {interviewQuestion.overallScore}/10)
                </span>
              </div>

              <div className="mt-1 flex items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 text-gray-700">
                  {saveIndicator.icon}
                  <span className="font-semibold">{saveIndicator.text}</span>
                </span>

                {lastSavedAtRef.current && (
                  <span className="text-gray-500">
                    • last saved {Math.max(1, Math.round((Date.now() - lastSavedAtRef.current) / 1000))}s ago
                  </span>
                )}

                {saveState === 'error' && saveError && (
                  <span className="text-rose-700 font-semibold">• {saveError}</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-800 hover:bg-white"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={performSave}
                disabled={saveState === 'saving'}
                className={[
                  'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors',
                  saveState === 'saving' ? 'bg-blue-400 text-white cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white',
                ].join(' ')}
              >
                {saveState === 'saving' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save now
              </button>

              <button
                type="button"
                disabled={!canSubmit}
                onClick={() => {
                  // Replace with “finalize/submit” endpoint when ready
                  // e.g. api.submitSessionFeedback(session.id)
                  alert('Submitted (wire this to backend finalize flow).');
                  onClose();
                }}
                className={[
                  'px-4 py-2 rounded-xl text-sm font-semibold transition-colors',
                  canSubmit ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-emerald-200 text-emerald-800 cursor-not-allowed',
                ].join(' ')}
                title={
                  canSubmit
                    ? 'Finalize feedback'
                    : completion.missingZeroComments > 0
                      ? 'Add comments for zero marks before submitting'
                      : 'General feedback is required before submitting'
                }
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SessionFeedbackModal;
