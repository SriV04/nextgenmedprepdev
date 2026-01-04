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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">Interview Feedback</h2>
              <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full uppercase">
                {interviewQuestion.interviewType}
              </span>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                interviewQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                interviewQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {interviewQuestion.difficulty}
              </span>
            </div>
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
          <div className="mx-6 mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-bold text-blue-900 mb-2">📋 How to Use During Interview</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• <strong>During:</strong> Take notes on student responses and mark skills as you go</li>
                  <li>• <strong>Core Skills:</strong> Essential competencies - mark out of 2 for each</li>
                  <li>• <strong>Extra Skills:</strong> Additional observations - mark if demonstrated</li>
                  <li>• <strong>After:</strong> Complete general feedback and overall score</li>
                </ul>
              </div>
              <button
                onClick={() => setShowInfo(false)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex-shrink-0"
              >
                Got it
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Main Question */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-6">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-purple-900 mb-1">{interviewQuestion.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">Category: {interviewQuestion.category}</p>
                  <p className="text-base text-gray-800 leading-relaxed">{interviewQuestion.questionText}</p>
                </div>
              </div>

              {/* Follow-up Questions */}
              {interviewQuestion.followUpQuestions.length > 0 && (
                <div className="mt-4 pt-4 border-t border-purple-200">
                  <h4 className="text-sm font-semibold text-purple-900 mb-3">Follow-up Questions:</h4>
                  <div className="space-y-2">
                    {interviewQuestion.followUpQuestions.map((fq) => (
                      <div key={fq.order} className="flex gap-2">
                        <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                          {fq.order}
                        </span>
                        <p className="text-sm text-gray-700 flex-1">{fq.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Student Response */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                📝 Student's Response (Notes)
              </label>
              <textarea
                value={interviewQuestion.studentResponse}
                onChange={(e) => setInterviewQuestion(prev => ({ ...prev, studentResponse: e.target.value }))}
                placeholder="Capture key points from the student's answer as they speak..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
                rows={4}
              />
            </div>

            {/* Core Skills Section */}
            <div className="border-2 border-blue-300 rounded-xl overflow-hidden">
              <button
                onClick={() => setCoreSkillsExpanded(!coreSkillsExpanded)}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6" />
                  <div className="text-left">
                    <h3 className="text-lg font-bold">Core Skills Assessment</h3>
                    <p className="text-xs text-blue-100">Essential competencies to evaluate</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold bg-white text-blue-600 px-3 py-1 rounded-full">
                    {totalCoreMarks} / {maxCoreMarks}
                  </span>
                  {coreSkillsExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {coreSkillsExpanded && (
                <div className="p-4 bg-blue-50 space-y-4">
                  {coreSkills.map((skill) => (
                    <div key={skill.id} className="bg-white border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 mb-1">{skill.displayName}</h4>
                          <p className="text-xs text-gray-600 italic">{skill.guidance}</p>
                        </div>
                        {/* Mark Selector */}
                        <div className="flex items-center gap-2 ml-4">
                          <span className="text-xs font-medium text-gray-600">Mark:</span>
                          {[0, 1, 2].map((mark) => (
                            <button
                              key={mark}
                              onClick={() => updateSkillMark(skill.id, mark)}
                              className={`w-10 h-10 rounded-lg font-bold transition-all ${
                                skill.marksAwarded === mark
                                  ? 'bg-blue-600 text-white shadow-lg scale-110'
                                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                              }`}
                            >
                              {mark}
                            </button>
                          ))}
                          <span className="text-xs text-gray-500">/ {skill.maxMarks}</span>
                        </div>
                      </div>
                      <textarea
                        value={skill.examinerComment}
                        onChange={(e) => updateSkillComment(skill.id, e.target.value)}
                        placeholder="Specific feedback for this skill..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                        rows={2}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Extra Skills Section */}
            <div className="border-2 border-green-300 rounded-xl overflow-hidden">
              <button
                onClick={() => setExtraSkillsExpanded(!extraSkillsExpanded)}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Target className="w-6 h-6" />
                  <div className="text-left">
                    <h3 className="text-lg font-bold">Extra Skills Assessment</h3>
                    <p className="text-xs text-green-100">Additional competencies if demonstrated</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold bg-white text-green-600 px-3 py-1 rounded-full">
                    {totalExtraMarks} / {maxExtraMarks}
                  </span>
                  {extraSkillsExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {extraSkillsExpanded && (
                <div className="p-4 bg-green-50 space-y-4">
                  {extraSkills.map((skill) => (
                    <div key={skill.id} className="bg-white border border-green-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 mb-1">{skill.displayName}</h4>
                          <p className="text-xs text-gray-600 italic">{skill.guidance}</p>
                        </div>
                        {/* Mark Selector */}
                        <div className="flex items-center gap-2 ml-4">
                          <span className="text-xs font-medium text-gray-600">Mark:</span>
                          {[0, 1, 2].map((mark) => (
                            <button
                              key={mark}
                              onClick={() => updateSkillMark(skill.id, mark)}
                              className={`w-10 h-10 rounded-lg font-bold transition-all ${
                                skill.marksAwarded === mark
                                  ? 'bg-green-600 text-white shadow-lg scale-110'
                                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                              }`}
                            >
                              {mark}
                            </button>
                          ))}
                          <span className="text-xs text-gray-500">/ {skill.maxMarks}</span>
                        </div>
                      </div>
                      <textarea
                        value={skill.examinerComment}
                        onChange={(e) => updateSkillComment(skill.id, e.target.value)}
                        placeholder="Specific feedback for this skill..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-sm"
                        rows={2}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* General Feedback */}
            <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                💬 General Feedback
              </label>
              <textarea
                value={interviewQuestion.generalFeedback}
                onChange={(e) => setInterviewQuestion(prev => ({ ...prev, generalFeedback: e.target.value }))}
                placeholder="Overall comments, strengths, areas for improvement, and suggestions for the student..."
                className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                rows={5}
              />
            </div>

            {/* Overall Score & Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  ⭐ Overall Score (out of 10)
                </label>
                <div className="flex items-center gap-2">
                  {[...Array(11)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setInterviewQuestion(prev => ({ ...prev, overallScore: i }))}
                      className={`w-10 h-10 rounded-lg font-bold transition-all ${
                        interviewQuestion.overallScore === i
                          ? 'bg-purple-600 text-white shadow-lg scale-110'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300 text-sm'
                      }`}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  📌 Additional Notes
                </label>
                <textarea
                  value={interviewQuestion.notes}
                  onChange={(e) => setInterviewQuestion(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any additional observations..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-between gap-4">
          <div className="text-sm space-y-1">
            <p className="font-medium text-gray-900">
              Total: {totalCoreMarks + totalExtraMarks} / {maxCoreMarks + maxExtraMarks} marks
            </p>
            <p className="text-xs text-gray-600">
              Core: {totalCoreMarks}/{maxCoreMarks} • Extra: {totalExtraMarks}/{maxExtraMarks} • Overall: {interviewQuestion.overallScore}/10
            </p>
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
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
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
