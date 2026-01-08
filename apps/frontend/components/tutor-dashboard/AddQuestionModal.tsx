'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Info, Save, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

interface FollowUpQuestion {
  order: number;
  text: string;
}

interface SkillCriterion {
  skillCode: string;
  displayName: string;
  skillGroup: 'core' | 'extra';
  maxMarks: number;
  guidance: string;
  displayOrder: number;
}

interface AddQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  userId: string;
}

interface AvailableSkill {
  skill_code: string;
  display_name: string;
  sort_order: number;
}

interface AvailableTag {
  tag: string;
}

const AddQuestionModal: React.FC<AddQuestionModalProps> = ({ isOpen, onClose, onSuccess, userId }) => {
  // Form state
  const [questionText, setQuestionText] = useState('');
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [interviewTypes, setInterviewTypes] = useState<('MMI' | 'Oxbridge' | 'Group Task')[]>([]);
  const [notes, setNotes] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [followUpQuestions, setFollowUpQuestions] = useState<FollowUpQuestion[]>([]);
  const [coreSkills, setCoreSkills] = useState<SkillCriterion[]>([]);
  const [extraSkills, setExtraSkills] = useState<SkillCriterion[]>([]);
  
  // UI state
  const [availableSkills, setAvailableSkills] = useState<AvailableSkill[]>([]);
  const [availableTags, setAvailableTags] = useState<AvailableTag[]>([]);
  const [tagSearch, setTagSearch] = useState('');
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showSkillSelector, setShowSkillSelector] = useState<'core' | 'extra' | null>(null);
  const [showNewSkillForm, setShowNewSkillForm] = useState(false);
  const [newSkillCode, setNewSkillCode] = useState('');
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillDescription, setNewSkillDescription] = useState('');

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';

  useEffect(() => {
    if (isOpen) {
      fetchAvailableSkills();
      fetchAvailableTags();
      resetForm();
    }
  }, [isOpen]);

  const fetchAvailableSkills = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/v1/prometheus/skills?active=true`);
      const result = await response.json();
      if (result.success) {
        setAvailableSkills(result.data);
      } else {
        console.error('Failed to fetch skills:', result.message);
      }
    } catch (err) {
      console.error('Error fetching skills:', err);
    }
  };

  const fetchAvailableTags = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/v1/prometheus/tags`);
      const result = await response.json();
      if (result.success) {
        setAvailableTags(result.data);
      } else {
        console.error('Failed to fetch tags:', result.message);
      }
    } catch (err) {
      console.error('Error fetching tags:', err);
    }
  };

  const resetForm = () => {
    setQuestionText('');
    setTitle('');
    setDifficulty('medium');
    setInterviewTypes([]);
    setNotes('');
    setSelectedTags([]);
    setTagSearch('');
    setShowTagSelector(false);
    setFollowUpQuestions([]);
    setCoreSkills([]);
    setExtraSkills([]);
    setError(null);
    setSuccess(false);
    setShowNewSkillForm(false);
    setNewSkillCode('');
    setNewSkillName('');
    setNewSkillDescription('');
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const addFollowUpQuestion = () => {
    const newOrder = followUpQuestions.length + 1;
    setFollowUpQuestions([...followUpQuestions, { order: newOrder, text: '' }]);
  };

  const updateFollowUpQuestion = (order: number, text: string) => {
    setFollowUpQuestions(followUpQuestions.map(fq => 
      fq.order === order ? { ...fq, text } : fq
    ));
  };

  const removeFollowUpQuestion = (order: number) => {
    const filtered = followUpQuestions.filter(fq => fq.order !== order);
    // Reorder remaining questions
    const reordered = filtered.map((fq, index) => ({ ...fq, order: index + 1 }));
    setFollowUpQuestions(reordered);
  };

  const handleCreateNewSkill = async () => {
    if (!newSkillCode.trim() || !newSkillName.trim()) {
      setError('Skill code and name are required');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${backendUrl}/api/v1/prometheus/skills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          skill_code: newSkillCode.trim(),
          display_name: newSkillName.trim(),
          description: newSkillDescription.trim() || undefined,
          sort_order: availableSkills.length + 1
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to create skill');
      }

      // Refresh skills list
      await fetchAvailableSkills();
      
      // Reset form
      setNewSkillCode('');
      setNewSkillName('');
      setNewSkillDescription('');
      setShowNewSkillForm(false);
      setError(null);
    } catch (err: any) {
      console.error('Error creating skill:', err);
      setError(err.message || 'Failed to create skill');
    } finally {
      setLoading(false);
    }
  };

  const toggleInterviewType = (type: 'MMI' | 'Oxbridge' | 'Group Task') => {
    setInterviewTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const addSkill = (skillCode: string, group: 'core' | 'extra') => {
    const skill = availableSkills.find(s => s.skill_code === skillCode);
    if (!skill) return;

    const newSkill: SkillCriterion = {
      skillCode: skill.skill_code,
      displayName: skill.display_name,
      skillGroup: group,
      maxMarks: 2,
      guidance: '',
      displayOrder: group === 'core' ? coreSkills.length + 1 : extraSkills.length + 1
    };

    if (group === 'core') {
      if (!coreSkills.find(s => s.skillCode === skillCode)) {
        setCoreSkills([...coreSkills, newSkill]);
      }
    } else {
      if (!extraSkills.find(s => s.skillCode === skillCode)) {
        setExtraSkills([...extraSkills, newSkill]);
      }
    }
    setShowSkillSelector(null);
  };

  const removeSkill = (skillCode: string, group: 'core' | 'extra') => {
    if (group === 'core') {
      const filtered = coreSkills.filter(s => s.skillCode !== skillCode);
      const reordered = filtered.map((s, index) => ({ ...s, displayOrder: index + 1 }));
      setCoreSkills(reordered);
    } else {
      const filtered = extraSkills.filter(s => s.skillCode !== skillCode);
      const reordered = filtered.map((s, index) => ({ ...s, displayOrder: index + 1 }));
      setExtraSkills(reordered);
    }
  };

  const updateSkillGuidance = (skillCode: string, group: 'core' | 'extra', guidance: string) => {
    if (group === 'core') {
      setCoreSkills(coreSkills.map(s => 
        s.skillCode === skillCode ? { ...s, guidance } : s
      ));
    } else {
      setExtraSkills(extraSkills.map(s => 
        s.skillCode === skillCode ? { ...s, guidance } : s
      ));
    }
  };

  const updateSkillMaxMarks = (skillCode: string, group: 'core' | 'extra', maxMarks: number) => {
    if (group === 'core') {
      setCoreSkills(coreSkills.map(s => 
        s.skillCode === skillCode ? { ...s, maxMarks } : s
      ));
    } else {
      setExtraSkills(extraSkills.map(s => 
        s.skillCode === skillCode ? { ...s, maxMarks } : s
      ));
    }
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccess(false);

    // Validation
    if (!questionText.trim()) {
      setError('Question text is required');
      return;
    }
    if (!title.trim()) {
      setError('Question title is required');
      return;
    }
    if (coreSkills.length === 0) {
      setError('At least one core skill is required');
      return;
    }
    if (interviewTypes.length === 0) {
      setError('At least one interview type is required');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        question_text: questionText,
        title,
        difficulty,
        interview_types: interviewTypes,
        notes: notes || undefined,
        contributor_id: userId,
        follow_up_questions: followUpQuestions.filter(fq => fq.text.trim()),
        skill_criteria: [...coreSkills, ...extraSkills].map(s => ({
          skill_code: s.skillCode,
          skill_group: s.skillGroup,
          max_marks: s.maxMarks,
          guidance: s.guidance || undefined,
          display_order: s.displayOrder
        })),
        tags: selectedTags.length > 0 ? selectedTags : undefined
      };

      const response = await fetch(`${backendUrl}/api/v1/prometheus/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to create question');
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error('Error creating question:', err);
      setError(err.message || 'Failed to create question');
    } finally {
      setLoading(false);
    }
  };

  const getUsedSkillCodes = (group: 'core' | 'extra') => {
    return group === 'core' 
      ? coreSkills.map(s => s.skillCode)
      : extraSkills.map(s => s.skillCode);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Create New Question</h2>
            <p className="text-sm text-gray-600 mt-1">Add a question to the Prometheus question bank</p>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-green-900">Question created successfully!</p>
                <p className="text-sm text-green-700">Closing modal...</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Difficult interaction in healthcare"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty *
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interview Types * (Select all that apply)
                </label>
                <div className="flex flex-wrap gap-3">
                  {(['MMI', 'Group Task', 'Oxbridge'] as const).map((type) => (
                    <label
                      key={type}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={interviewTypes.includes(type)}
                        onChange={() => toggleInterviewType(type)}
                        className="w-4 h-4 text-purple-600 focus:ring-2 focus:ring-purple-500"
                      />
                      <span className="text-sm font-medium capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Text *
              </label>
              <textarea
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Enter the main interview question..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes / Resources
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes, context, or resources for this question..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows={3}
              />
            </div>
          </div>

          {/* Follow-up Questions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Follow-up Questions</h3>
              <button
                type="button"
                onClick={addFollowUpQuestion}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Follow-up
              </button>
            </div>
            {followUpQuestions.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No follow-up questions added yet</p>
            ) : (
              <div className="space-y-2">
                {followUpQuestions.map((fq) => (
                  <div key={fq.order} className="flex gap-2 items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center mt-2">
                      {fq.order}
                    </span>
                    <textarea
                      value={fq.text}
                      onChange={(e) => updateFollowUpQuestion(fq.order, e.target.value)}
                      placeholder="Enter follow-up question..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                      rows={2}
                    />
                    <button
                      type="button"
                      onClick={() => removeFollowUpQuestion(fq.order)}
                      className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-3 border-2 border-purple-200 rounded-lg p-4 bg-purple-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-purple-900">Question Tags</h3>
              <button
                type="button"
                onClick={() => setShowTagSelector(!showTagSelector)}
                className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                {showTagSelector ? 'Hide Tags' : 'Add Tags'}
              </button>
            </div>

            {showTagSelector && (
              <div className="bg-white border border-purple-300 rounded-lg p-3">
                <div className="mb-3">
                  <input
                    type="text"
                    value={tagSearch}
                    onChange={(e) => setTagSearch(e.target.value)}
                    placeholder="Search tags..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  />
                </div>
                <p className="text-sm font-medium text-gray-700 mb-2">Select tags:</p>
                <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                  {availableTags
                    .filter(t => !tagSearch || t.tag.toLowerCase().includes(tagSearch.toLowerCase()))
                    .map(tag => (
                      <button
                        key={tag.tag}
                        type="button"
                        onClick={() => toggleTag(tag.tag)}
                        className={`px-3 py-2 rounded-lg transition-colors text-sm text-left ${
                          selectedTags.includes(tag.tag)
                            ? 'bg-purple-600 text-white'
                            : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                        }`}
                      >
                        {tag.tag}
                      </button>
                    ))}
                </div>
              </div>
            )}

            {selectedTags.length === 0 ? (
              <p className="text-sm text-purple-700 italic">No tags selected yet (optional)</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selectedTags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 bg-white border border-purple-300 text-purple-900 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className="hover:text-purple-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Core Skills */}
          <div className="space-y-3 border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-blue-900">Core Skills *</h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewSkillForm(!showNewSkillForm);
                    setShowSkillSelector(null);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  New Skill
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowSkillSelector(showSkillSelector === 'core' ? null : 'core');
                    setShowNewSkillForm(false);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Core Skill
                </button>
              </div>
            </div>

            {showNewSkillForm && (
              <div className="bg-white border border-green-300 rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-900 mb-3">Create New Skill Definition</p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Skill Code * (e.g., COMM, EMP)
                    </label>
                    <input
                      type="text"
                      value={newSkillCode}
                      onChange={(e) => setNewSkillCode(e.target.value.toUpperCase())}
                      placeholder="SKILL_CODE"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Display Name *
                    </label>
                    <input
                      type="text"
                      value={newSkillName}
                      onChange={(e) => setNewSkillName(e.target.value)}
                      placeholder="Communication"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Description (optional)
                    </label>
                    <textarea
                      value={newSkillDescription}
                      onChange={(e) => setNewSkillDescription(e.target.value)}
                      placeholder="Description of the skill..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-sm"
                      rows={2}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleCreateNewSkill}
                      disabled={loading}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50"
                    >
                      Create Skill
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewSkillForm(false);
                        setNewSkillCode('');
                        setNewSkillName('');
                        setNewSkillDescription('');
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showSkillSelector === 'core' && (
              <div className="bg-white border border-blue-300 rounded-lg p-3">
                <p className="text-sm font-medium text-gray-700 mb-2">Select a skill:</p>
                <div className="grid grid-cols-2 gap-2">
                  {availableSkills
                    .filter(s => !getUsedSkillCodes('core').includes(s.skill_code))
                    .map(skill => (
                      <button
                        key={skill.skill_code}
                        type="button"
                        onClick={() => addSkill(skill.skill_code, 'core')}
                        className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors text-sm text-left"
                      >
                        {skill.display_name}
                      </button>
                    ))}
                </div>
              </div>
            )}

            {coreSkills.length === 0 ? (
              <p className="text-sm text-blue-700 italic">No core skills added yet (at least one required)</p>
            ) : (
              <div className="space-y-3">
                {coreSkills.map((skill) => (
                  <div key={skill.skillCode} className="bg-white border border-blue-200 rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{skill.displayName}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-medium text-gray-600">Max Marks:</label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={skill.maxMarks}
                          onChange={(e) => updateSkillMaxMarks(skill.skillCode, 'core', parseInt(e.target.value) || 2)}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeSkill(skill.skillCode, 'core')}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <textarea
                      value={skill.guidance}
                      onChange={(e) => updateSkillGuidance(skill.skillCode, 'core', e.target.value)}
                      placeholder="Guidance for assessing this skill..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                      rows={2}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Extra Skills */}
          <div className="space-y-3 border-2 border-green-200 rounded-lg p-4 bg-green-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-green-900">Extra Skills</h3>
              <button
                type="button"
                onClick={() => setShowSkillSelector(showSkillSelector === 'extra' ? null : 'extra')}
                className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Extra Skill
              </button>
            </div>

            {showSkillSelector === 'extra' && (
              <div className="bg-white border border-green-300 rounded-lg p-3">
                <p className="text-sm font-medium text-gray-700 mb-2">Select a skill:</p>
                <div className="grid grid-cols-2 gap-2">
                  {availableSkills
                    .filter(s => !getUsedSkillCodes('extra').includes(s.skill_code))
                    .map(skill => (
                      <button
                        key={skill.skill_code}
                        type="button"
                        onClick={() => addSkill(skill.skill_code, 'extra')}
                        className="px-3 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors text-sm text-left"
                      >
                        {skill.display_name}
                      </button>
                    ))}
                </div>
              </div>
            )}

            {extraSkills.length === 0 ? (
              <p className="text-sm text-green-700 italic">No extra skills added yet (optional)</p>
            ) : (
              <div className="space-y-3">
                {extraSkills.map((skill) => (
                  <div key={skill.skillCode} className="bg-white border border-green-200 rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{skill.displayName}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-medium text-gray-600">Max Marks:</label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={skill.maxMarks}
                          onChange={(e) => updateSkillMaxMarks(skill.skillCode, 'extra', parseInt(e.target.value) || 2)}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeSkill(skill.skillCode, 'extra')}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <textarea
                      value={skill.guidance}
                      onChange={(e) => updateSkillGuidance(skill.skillCode, 'extra', e.target.value)}
                      placeholder="Guidance for assessing this skill..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-sm"
                      rows={2}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            * Required fields
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium text-gray-700 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || success}
              className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Create Question
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddQuestionModal;
