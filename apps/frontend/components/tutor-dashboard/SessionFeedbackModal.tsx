'use client';

import React, { useState, useEffect } from 'react';
import { X, Info, Save, ChevronDown, ChevronUp, Star, MessageSquare, Award, Target } from 'lucide-react';

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
  const [showInfo, setShowInfo] = useState(true);
  const [coreSkillsExpanded, setCoreSkillsExpanded] = useState(true);
  const [extraSkillsExpanded, setExtraSkillsExpanded] = useState(false);
  
  // Mock data structure based on the schema - this would come from API in real implementation
  const [interviewQuestion, setInterviewQuestion] = useState<InterviewQuestion>({
    id: 'mock-q-1',
    questionText: 'Tell me about a time you observed a difficult interaction in a healthcare setting and what you learned from it.',
    title: 'Difficult interaction in healthcare',
    category: 'staple',
    difficulty: 'medium',
    interviewType: 'mmi',
    followUpQuestions: [
      { order: 1, text: 'How was the situation handled and what would you have done similarly or differently?' },
      { order: 2, text: 'What did this show you about the pressures of a career in medicine?' },
      { order: 3, text: 'How did this impact your view of patient care?' }
    ],
    skillCriteria: [
      // Core skills
      { id: '1', skillCode: 'communication', displayName: 'Communication', skillGroup: 'core', maxMarks: 2, guidance: 'How communication styles defused or escalated the issue', displayOrder: 1, marksAwarded: 0, examinerComment: '' },
      { id: '2', skillCode: 'empathy', displayName: 'Empathy', skillGroup: 'core', maxMarks: 2, guidance: 'Awareness of emotions of patient, family, or staff involved', displayOrder: 2, marksAwarded: 0, examinerComment: '' },
      { id: '3', skillCode: 'understanding_doctors_role', displayName: "Understanding the Doctor's Role", skillGroup: 'core', maxMarks: 2, guidance: 'Recognition of emotional, ethical, or interpersonal responsibilities of doctors', displayOrder: 3, marksAwarded: 0, examinerComment: '' },
      { id: '4', skillCode: 'teamwork', displayName: 'Teamwork', skillGroup: 'core', maxMarks: 2, guidance: 'Reflection on how staff supported one another', displayOrder: 4, marksAwarded: 0, examinerComment: '' },
      { id: '5', skillCode: 'leadership', displayName: 'Leadership', skillGroup: 'core', maxMarks: 2, guidance: 'Observed or discussed how someone led in a tense moment', displayOrder: 5, marksAwarded: 0, examinerComment: '' },
      // Extra skills
      { id: '6', skillCode: 'compassion', displayName: 'Compassion', skillGroup: 'extra', maxMarks: 2, guidance: 'Caring approach to patient and peer relationships', displayOrder: 1, marksAwarded: 0, examinerComment: '' },
      { id: '7', skillCode: 'problem_solving', displayName: 'Problem Solving', skillGroup: 'extra', maxMarks: 2, guidance: 'Ability to think logically and adapt under pressure', displayOrder: 2, marksAwarded: 0, examinerComment: '' },
      { id: '8', skillCode: 'time_management', displayName: 'Time Management', skillGroup: 'extra', maxMarks: 2, guidance: 'Prioritising tasks and maintaining balance', displayOrder: 3, marksAwarded: 0, examinerComment: '' },
      { id: '9', skillCode: 'medical_knowledge', displayName: 'Medical Knowledge', skillGroup: 'extra', maxMarks: 2, guidance: 'Curiosity and understanding of relevant medical topics', displayOrder: 4, marksAwarded: 0, examinerComment: '' },
      { id: '10', skillCode: 'manual_dexterity', displayName: 'Manual Dexterity', skillGroup: 'extra', maxMarks: 2, guidance: 'Relevant procedural or clinical skill awareness (if applicable)', displayOrder: 5, marksAwarded: 0, examinerComment: '' },
    ],
    studentResponse: '',
    generalFeedback: '',
    overallScore: 0,
    notes: ''
  });

  useEffect(() => {
    if (isOpen && session) {
      setShowInfo(true);
      setCoreSkillsExpanded(true);
      setExtraSkillsExpanded(false);
      // Reset or fetch data for this session
    }
  }, [isOpen, session]);

  const updateSkillMark = (skillId: string, marks: number) => {
    setInterviewQuestion(prev => ({
      ...prev,
      skillCriteria: prev.skillCriteria.map(skill =>
        skill.id === skillId ? { ...skill, marksAwarded: marks } : skill
      )
    }));
  };

  const updateSkillComment = (skillId: string, comment: string) => {
    setInterviewQuestion(prev => ({
      ...prev,
      skillCriteria: prev.skillCriteria.map(skill =>
        skill.id === skillId ? { ...skill, examinerComment: comment } : skill
      )
    }));
  };

  const handleSave = () => {
    // TODO: Implement backend save when ready
    console.log('Saving feedback for session:', session?.id);
    console.log('Interview question data:', interviewQuestion);
    alert('Feedback saved! (Local only - backend integration pending)');
    onClose();
  };

  const coreSkills = interviewQuestion.skillCriteria.filter(s => s.skillGroup === 'core');
  const extraSkills = interviewQuestion.skillCriteria.filter(s => s.skillGroup === 'extra');
  const totalCoreMarks = coreSkills.reduce((sum, s) => sum + s.marksAwarded, 0);
  const maxCoreMarks = coreSkills.reduce((sum, s) => sum + s.maxMarks, 0);
  const totalExtraMarks = extraSkills.reduce((sum, s) => sum + s.marksAwarded, 0);
  const maxExtraMarks = extraSkills.reduce((sum, s) => sum + s.maxMarks, 0);

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
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50" onClick={onClose} />
      
      {/* Modal */}
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-[1600px] h-[90vh] overflow-hidden flex flex-col pointer-events-auto">
        {/* Compact Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <h2 className="text-base font-bold truncate">{session.studentName}</h2>
            <span className="px-2 py-0.5 bg-white text-blue-600 text-[10px] font-bold rounded uppercase flex-shrink-0">
              {interviewQuestion.interviewType}
            </span>
            <span className={`px-2 py-0.5 text-[10px] font-bold rounded flex-shrink-0 ${
              interviewQuestion.difficulty === 'easy' ? 'bg-green-400 text-green-900' :
              interviewQuestion.difficulty === 'medium' ? 'bg-yellow-400 text-yellow-900' :
              'bg-red-400 text-red-900'
            }`}>
              {interviewQuestion.difficulty}
            </span>
            <span className="text-xs text-blue-100 ml-2">{formatTime(session.scheduled_at)}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-white hover:bg-blue-800 rounded transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Compact Info Section */}
        {showInfo && (
          <div className="mx-3 mt-2 bg-blue-50 border border-blue-200 rounded p-2 flex-shrink-0">
            <div className="flex items-center gap-2 text-xs">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span className="text-blue-800">
                <strong>Quick Guide:</strong> Mark skills (0-2) as you go • Add notes in real-time • Complete feedback after
              </span>
              <button
                onClick={() => setShowInfo(false)}
                className="text-blue-600 hover:text-blue-800 font-medium ml-auto flex-shrink-0"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Compact Two-Column Content */}
        <div className="flex-1 overflow-y-auto p-3">
          <div className="grid grid-cols-2 gap-3 h-full">
            {/* LEFT COLUMN: Question & Notes */}
            <div className="space-y-3">
              {/* Main Question - Compact */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-300 rounded-lg p-3">
                <div className="flex items-start gap-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-purple-900 mb-0.5">{interviewQuestion.title}</h3>
                    <p className="text-xs text-gray-700 leading-snug">{interviewQuestion.questionText}</p>
                  </div>
                </div>

                {/* Follow-up Questions - Compact */}
                {interviewQuestion.followUpQuestions.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-purple-200">
                    <p className="text-[10px] font-bold text-purple-900 mb-1.5 uppercase tracking-wide">Follow-ups:</p>
                    <div className="space-y-1">
                      {interviewQuestion.followUpQuestions.map((fq) => (
                        <div key={fq.order} className="flex gap-1.5 text-xs">
                          <span className="flex-shrink-0 w-4 h-4 bg-purple-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                            {fq.order}
                          </span>
                          <p className="text-gray-700 flex-1 leading-tight">{fq.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Student Response - Compact */}
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-2">
                <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase tracking-wide">
                  📝 Student Response
                </label>
                <textarea
                  value={interviewQuestion.studentResponse}
                  onChange={(e) => setInterviewQuestion(prev => ({ ...prev, studentResponse: e.target.value }))}
                  placeholder="Quick notes as they answer..."
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-transparent resize-none font-mono"
                  rows={4}
                />
              </div>

              {/* General Feedback - Compact */}
              <div className="bg-amber-50 border border-amber-300 rounded-lg p-2">
                <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase tracking-wide">
                  💬 General Feedback
                </label>
                <textarea
                  value={interviewQuestion.generalFeedback}
                  onChange={(e) => setInterviewQuestion(prev => ({ ...prev, generalFeedback: e.target.value }))}
                  placeholder="Overall comments..."
                  className="w-full px-2 py-1.5 border border-amber-300 rounded text-xs focus:ring-1 focus:ring-amber-500 focus:border-transparent resize-none"
                  rows={4}
                />
              </div>

              {/* Score & Notes Row - Compact */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-purple-50 border border-purple-300 rounded-lg p-2">
                  <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase tracking-wide">
                    ⭐ Overall /10
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((mark) => (
                      <button
                        key={mark}
                        onClick={() => setInterviewQuestion(prev => ({ ...prev, overallScore: mark }))}
                        className={`w-7 h-7 rounded font-bold text-xs transition-all ${
                          interviewQuestion.overallScore === mark
                            ? 'bg-purple-600 text-white scale-105'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                      >
                        {mark}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-300 rounded-lg p-2">
                  <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase tracking-wide">
                    📌 Notes
                  </label>
                  <textarea
                    value={interviewQuestion.notes}
                    onChange={(e) => setInterviewQuestion(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Extra observations..."
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={2}
                  />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Skills Assessment */}
            <div className="space-y-3 overflow-y-auto">
              {/* Core Skills - Always Visible, Compact */}
              <div className="border border-blue-300 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-3 py-1.5 bg-blue-600 text-white">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    <h3 className="text-xs font-bold">Core Skills</h3>
                  </div>
                  <span className="text-xs font-bold bg-white text-blue-600 px-2 py-0.5 rounded">
                    {totalCoreMarks}/{maxCoreMarks}
                  </span>
                </div>
                <div className="p-2 bg-blue-50 space-y-2">
                  {coreSkills.map((skill) => (
                    <div key={skill.id} className="bg-white border border-blue-200 rounded p-2">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-xs text-gray-900 truncate">{skill.displayName}</h4>
                          <p className="text-[10px] text-gray-600 leading-tight">{skill.guidance}</p>
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          {[0, 1, 2].map((mark) => (
                            <button
                              key={mark}
                              onClick={() => updateSkillMark(skill.id, mark)}
                              className={`w-7 h-7 rounded font-bold text-xs transition-all ${
                                skill.marksAwarded === mark
                                  ? 'bg-blue-600 text-white scale-105'
                                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                              }`}
                            >
                              {mark}
                            </button>
                          ))}
                        </div>
                      </div>
                      <textarea
                        value={skill.examinerComment}
                        onChange={(e) => updateSkillComment(skill.id, e.target.value)}
                        placeholder="Quick feedback..."
                        className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows={1}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Extra Skills - Collapsible, Compact */}
              <div className="border border-green-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExtraSkillsExpanded(!extraSkillsExpanded)}
                  className="w-full flex items-center justify-between px-3 py-1.5 bg-green-600 text-white hover:bg-green-700 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    <h3 className="text-xs font-bold">Extra Skills</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold bg-white text-green-600 px-2 py-0.5 rounded">
                      {totalExtraMarks}/{maxExtraMarks}
                    </span>
                    {extraSkillsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {extraSkillsExpanded && (
                  <div className="p-2 bg-green-50 space-y-2">
                    {extraSkills.map((skill) => (
                      <div key={skill.id} className="bg-white border border-green-200 rounded p-2">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-xs text-gray-900 truncate">{skill.displayName}</h4>
                            <p className="text-[10px] text-gray-600 leading-tight">{skill.guidance}</p>
                          </div>
                          <div className="flex items-center gap-1 ml-2">
                            {[0, 1, 2].map((mark) => (
                              <button
                                key={mark}
                                onClick={() => updateSkillMark(skill.id, mark)}
                                className={`w-7 h-7 rounded font-bold text-xs transition-all ${
                                  skill.marksAwarded === mark
                                    ? 'bg-green-600 text-white scale-105'
                                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                }`}
                              >
                                {mark}
                              </button>
                            ))}
                          </div>
                        </div>
                        <textarea
                          value={skill.examinerComment}
                          onChange={(e) => updateSkillComment(skill.id, e.target.value)}
                          placeholder="Quick feedback..."
                          className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-green-500 focus:border-transparent resize-none"
                          rows={1}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Compact Footer */}
        <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 flex items-center justify-between gap-4 flex-shrink-0">
          <div className="text-xs">
            <span className="font-bold text-gray-900">Total: {totalCoreMarks + totalExtraMarks}/{maxCoreMarks + maxExtraMarks}</span>
            <span className="text-gray-600 ml-2">
              (Core: {totalCoreMarks}/{maxCoreMarks} • Extra: {totalExtraMarks}/{maxExtraMarks} • Score: {interviewQuestion.overallScore}/10)
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 border border-gray-300 rounded hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium transition-colors"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default SessionFeedbackModal;
