'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MessageSquare, ChevronDown, ChevronUp, CheckCircle, AlertCircle, CalendarDays, Plus, Trash2 } from 'lucide-react';
import { UK_MEDICAL_SCHOOLS } from '@/data/universities';

interface Booking {
  id: string;
  email: string;
  package: string;
  amount: number;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  status?: 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  created_at: string;
  preferred_time?: string;
  universities?: string;
  field?: 'medicine' | 'dentistry';
  phone?: string;
  notes?: string;
  file_path?: string;
  tutor_id?: string;
  start_time?: string;
  complete?: boolean;
}

interface Interview {
  id: number;
  university: string;
  status: 'pending' | 'scheduled' | 'completed';
  date?: string;
  time?: string;
  comments?: string;
}

interface InterviewQuestion {
  category: string;
  questions: string[];
}

interface InterviewBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onSchedule: (bookingId: string, interviewId: number, date: string, time: string, comments: string) => void;
}

// Mock interview questions by university
const getInterviewQuestions = (universities: string): InterviewQuestion[] => {
  const universityList = universities.split(',').map(u => u.trim().toLowerCase());
  
  // Mock data - in a real app, this would come from a database
  const questionBank: Record<string, InterviewQuestion[]> = {
    'cambridge': [
      {
        category: 'Medical Ethics',
        questions: [
          'A patient refuses a life-saving treatment on religious grounds. How would you handle this situation?',
          'Should healthcare be free for everyone? Discuss the implications.',
          'What are your views on euthanasia?'
        ]
      },
      {
        category: 'Clinical Scenarios',
        questions: [
          'You notice a colleague making repeated errors. What would you do?',
          'How would you break bad news to a patient?',
          'Describe how you would prioritize patients in an emergency department.'
        ]
      },
      {
        category: 'Personal Motivation',
        questions: [
          'Why do you want to study medicine?',
          'What makes you think you would be a good doctor?',
          'Describe a time when you had to work under pressure.'
        ]
      }
    ],
    'oxford': [
      {
        category: 'Problem Solving',
        questions: [
          'How would you design a study to test a new drug?',
          'Why might someone develop diabetes?',
          'Explain how the heart works to a 10-year-old.'
        ]
      },
      {
        category: 'Scientific Thinking',
        questions: [
          'Why do we need different types of cells in the body?',
          'How would you investigate an outbreak of food poisoning?',
          'What is the difference between correlation and causation?'
        ]
      },
      {
        category: 'Communication',
        questions: [
          'How would you explain to a patient why they need surgery?',
          'Describe a time when you had to persuade someone to change their mind.',
          'How would you handle a disagreement with a senior colleague?'
        ]
      }
    ],
    'imperial college london': [
      {
        category: 'Research & Innovation',
        questions: [
          'How has technology changed medicine in the last decade?',
          'What role should artificial intelligence play in healthcare?',
          'Describe a recent medical breakthrough and its implications.'
        ]
      },
      {
        category: 'Leadership',
        questions: [
          'Describe a time when you led a team through a difficult situation.',
          'How would you improve healthcare delivery in underserved areas?',
          'What qualities make an effective healthcare leader?'
        ]
      }
    ],
    'university college london': [
      {
        category: 'Global Health',
        questions: [
          'How would you address health inequalities in society?',
          'What are the main health challenges facing developing countries?',
          'How can medicine be made more accessible worldwide?'
        ]
      },
      {
        category: 'Teamwork',
        questions: [
          'Healthcare is increasingly multidisciplinary. How would you work effectively in a team?',
          'Describe a time when you had to resolve a conflict.',
          'How would you handle working with someone you dislike?'
        ]
      }
    ]
  };

  // Combine questions for all selected universities
  const combinedQuestions: InterviewQuestion[] = [];
  const seenCategories = new Set<string>();

  universityList.forEach(university => {
    const questions = questionBank[university];
    if (questions) {
      questions.forEach(categoryGroup => {
        if (!seenCategories.has(categoryGroup.category)) {
          combinedQuestions.push(categoryGroup);
          seenCategories.add(categoryGroup.category);
        } else {
          // Add unique questions to existing category
          const existingCategory = combinedQuestions.find(q => q.category === categoryGroup.category);
          if (existingCategory) {
            categoryGroup.questions.forEach(question => {
              if (!existingCategory.questions.includes(question)) {
                existingCategory.questions.push(question);
              }
            });
          }
        }
      });
    }
  });

  // If no specific questions found, return general questions
  if (combinedQuestions.length === 0) {
    return [
      {
        category: 'General Medicine',
        questions: [
          'Why do you want to study medicine?',
          'What makes you think you would be a good doctor?',
          'How would you handle a difficult patient?',
          'Describe a time when you had to work under pressure.',
          'What are the biggest challenges facing healthcare today?'
        ]
      },
      {
        category: 'Medical Ethics',
        questions: [
          'Should healthcare be free for everyone?',
          'What are your views on euthanasia?',
          'How would you handle a patient who refuses treatment?',
          'What would you do if you made a mistake that harmed a patient?'
        ]
      }
    ];
  }

  return combinedQuestions;
};

const InterviewBookingModal: React.FC<InterviewBookingModalProps> = ({
  isOpen,
  onClose,
  booking,
  onSchedule
}) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [comments, setComments] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [interviewQuestions, setInterviewQuestions] = useState<InterviewQuestion[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [expandedInterview, setExpandedInterview] = useState<number | null>(null);
  const [schedulingInterview, setSchedulingInterview] = useState<number | null>(null);
  const [showAddInterview, setShowAddInterview] = useState(false);
  const [newInterviewUniversity, setNewInterviewUniversity] = useState('');

  useEffect(() => {
    if (booking?.universities) {
      const questions = getInterviewQuestions(booking.universities);
      setInterviewQuestions(questions);
      // Expand first category by default
      if (questions.length > 0) {
        setExpandedCategories(new Set([questions[0].category]));
      }

      // Initialize interviews for core packages
      if (booking.package?.toLowerCase().includes('core')) {
        const universityList = booking.universities.split(',').map(u => u.trim());
        const initialInterviews: Interview[] = universityList.slice(0, 3).map((university, index) => ({
          id: index + 1,
          university,
          status: 'pending' as const,
        }));
        setInterviews(initialInterviews);
      }
    }
  }, [booking]);

  const isCorePackage = booking?.package?.toLowerCase().includes('core');
  const isLivePackage = booking?.package?.toLowerCase().includes('live') || 
                       booking?.package?.toLowerCase().includes('_live') ||
                       booking?.package?.toLowerCase().includes('interview');

  const handleScheduleInterview = (interviewId?: number) => {
    if (!booking || !selectedDate || !selectedTime) return;
    
    if (isCorePackage && interviewId !== undefined) {
      onSchedule(booking.id, interviewId, selectedDate, selectedTime, comments);
      // Update local interview state
      setInterviews(prev => prev.map(interview => 
        interview.id === interviewId 
          ? { ...interview, status: 'scheduled' as const, date: selectedDate, time: selectedTime, comments }
          : interview
      ));
    } else {
      // For non-core packages, use interviewId as 0 or 1
      onSchedule(booking.id, 0, selectedDate, selectedTime, comments);
    }
    
    // Reset form
    setSelectedDate('');
    setSelectedTime('');
    setComments('');
    setSchedulingInterview(null);
    setExpandedInterview(null);
    if (!isCorePackage) {
      onClose();
    }
  };

  const getInterviewStatusIcon = (status: Interview['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'scheduled':
        return <CalendarDays className="w-5 h-5 text-blue-600" />;
      case 'pending':
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getInterviewStatusColor = (status: Interview['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const handleAddInterview = () => {
    if (!newInterviewUniversity || interviews.length >= 3) return;
    
    const newInterview: Interview = {
      id: Math.max(...interviews.map(i => i.id), 0) + 1,
      university: newInterviewUniversity,
      status: 'pending' as const,
    };
    
    setInterviews(prev => [...prev, newInterview]);
    setNewInterviewUniversity('');
    setShowAddInterview(false);
  };

  const handleRemoveInterview = (interviewId: number) => {
    setInterviews(prev => prev.filter(interview => interview.id !== interviewId));
    if (expandedInterview === interviewId) {
      setExpandedInterview(null);
    }
  };

  const canAddMoreInterviews = isCorePackage && interviews.length < 3;

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < 17) {
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    return slots;
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 60); // 60 days from now
    return maxDate.toISOString().split('T')[0];
  };

  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg px-6 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              Interview Booking Details
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Booking Information - Always at top */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Booking Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <dt className="text-sm text-gray-500">Customer</dt>
                <dd className="text-sm font-medium text-gray-900 mt-1">{booking.email}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Package</dt>
                <dd className="text-sm font-medium text-gray-900 mt-1">{booking.package}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Amount</dt>
                <dd className="text-sm font-medium text-gray-900 mt-1">£{booking.amount.toFixed(2)}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Field</dt>
                <dd className="text-sm font-medium text-gray-900 mt-1 capitalize">{booking.field || 'Not specified'}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Universities</dt>
                <dd className="text-sm font-medium text-gray-900 mt-1">{booking.universities || 'Not specified'}</dd>
              </div>
              {booking.phone && (
                <div>
                  <dt className="text-sm text-gray-500">Phone</dt>
                  <dd className="text-sm font-medium text-gray-900 mt-1">{booking.phone}</dd>
                </div>
              )}
              {booking.preferred_time && (
                <div className="md:col-span-2">
                  <dt className="text-sm text-gray-500">Preferred Time</dt>
                  <dd className="text-sm font-medium text-gray-900 mt-1">{booking.preferred_time}</dd>
                </div>
              )}
              {booking.notes && (
                <div className="md:col-span-3">
                  <dt className="text-sm text-gray-500">Notes</dt>
                  <dd className="text-sm text-gray-900 mt-1 bg-white p-2 rounded border">{booking.notes}</dd>
                </div>
              )}
            </div>
          </div>

          {/* Core Package Details - Below booking info */}
          {isCorePackage && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h4 className="text-lg font-semibold text-blue-900">Core Package Details</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-100 rounded-lg p-3">
                  <h6 className="font-semibold text-blue-900 mb-2">Package Benefits</h6>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• 3 separate mock interviews</li>
                    <li>• University-specific questions for each session</li>
                    <li>• Individual scheduling and feedback</li>
                    <li>• Comprehensive interview preparation</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <h6 className="font-semibold text-gray-900 mb-2">Interview Status Overview</h6>
                  <div className="space-y-2">
                    {interviews.map((interview) => (
                      <div key={interview.id} className="flex items-center gap-2">
                        {getInterviewStatusIcon(interview.status)}
                        <span className="text-sm text-gray-700">
                          Interview {interview.id}: {interview.university}
                        </span>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getInterviewStatusColor(interview.status)}`}>
                          {interview.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content Layout - Different for core vs live packages */}
          {isCorePackage ? (
            /* Core Package - Full Width Interview Management */
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Interview Management
                </h4>
                
                <div className="space-y-4">
                  {interviews.map((interview) => (
                    <div key={interview.id} className="bg-white rounded-lg border border-gray-200 shadow-sm">
                      <div
                        className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => setExpandedInterview(
                          expandedInterview === interview.id ? null : interview.id
                        )}
                      >
                        <div className="flex items-center gap-3">
                          {getInterviewStatusIcon(interview.status)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h5 className="font-medium text-gray-900">
                                Interview {interview.id}: {interview.university}
                              </h5>
                              {/* Delete button for manually added interviews */}
                              {interviews.length > 1 && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveInterview(interview.id);
                                  }}
                                  className="ml-2 p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                  title="Remove interview"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getInterviewStatusColor(interview.status)}`}>
                                {interview.status === 'scheduled' && interview.date && interview.time
                                  ? `Scheduled: ${interview.date} at ${interview.time}`
                                  : interview.status.charAt(0).toUpperCase() + interview.status.slice(1)
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">
                            {expandedInterview === interview.id ? 'Collapse' : 'Expand'}
                          </span>
                          {expandedInterview === interview.id ? (
                            <ChevronUp className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          )}
                        </div>
                      </div>

                      {expandedInterview === interview.id && (
                        <div className="border-t border-gray-100">
                          <div className="p-4">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              {/* Left - Scheduling Form */}
                              <div className="bg-gray-50 rounded-lg p-4">
                                <h6 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                  <Clock className="w-4 h-4" />
                                  {interview.status === 'scheduled' ? 'Reschedule Interview' : 'Schedule Interview'}
                                </h6>
                                
                                <div className="space-y-3">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Date
                                      </label>
                                      <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        min={getMinDate()}
                                        max={getMaxDate()}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                      />
                                    </div>

                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Time
                                      </label>
                                      <select
                                        value={selectedTime}
                                        onChange={(e) => setSelectedTime(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                      >
                                        <option value="">Choose time</option>
                                        {generateTimeSlots().map((time) => (
                                          <option key={time} value={time}>
                                            {time}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Comments (Optional)
                                    </label>
                                    <textarea
                                      value={comments}
                                      onChange={(e) => setComments(e.target.value)}
                                      placeholder="Add any special instructions..."
                                      rows={3}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                                    />
                                  </div>

                                  <button
                                    onClick={() => handleScheduleInterview(interview.id)}
                                    disabled={!selectedDate || !selectedTime}
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm flex items-center justify-center gap-2"
                                  >
                                    <Clock className="w-4 h-4" />
                                    {interview.status === 'scheduled' ? 'Reschedule' : 'Schedule'} Interview
                                  </button>
                                </div>
                              </div>

                              {/* Right - Interview Questions */}
                              <div className="bg-green-50 rounded-lg p-4">
                                <h6 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                  <MessageSquare className="w-4 h-4 text-green-600" />
                                  Interview Questions for {interview.university}
                                </h6>
                                <div className="space-y-3 max-h-80 overflow-y-auto">
                                  {getInterviewQuestions(interview.university).map((categoryGroup, index) => (
                                    <div key={index} className="bg-white rounded-lg border border-green-200">
                                      <div className="px-3 py-2 bg-green-100 rounded-t-lg border-b border-green-200">
                                        <h6 className="text-sm font-semibold text-green-800">
                                          {categoryGroup.category}
                                        </h6>
                                      </div>
                                      <div className="px-3 py-2">
                                        <ul className="space-y-2">
                                          {categoryGroup.questions.map((question, qIndex) => (
                                            <li key={qIndex} className="text-sm text-gray-700 pl-3 border-l-2 border-green-300">
                                              {question}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Add Interview Section */}
                  {canAddMoreInterviews && (
                    <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
                      {!showAddInterview ? (
                        <button
                          onClick={() => setShowAddInterview(true)}
                          className="w-full px-4 py-6 flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          <Plus className="w-5 h-5" />
                          <span className="font-medium">Add Interview ({interviews.length}/3)</span>
                        </button>
                      ) : (
                        <div className="p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <h6 className="font-medium text-gray-900">Add New Interview</h6>
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Select University
                              </label>
                              <select
                                value={newInterviewUniversity}
                                onChange={(e) => setNewInterviewUniversity(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                              >
                                <option value="">Choose a university</option>
                                {UK_MEDICAL_SCHOOLS.map((university) => (
                                  <option key={university.id} value={university.id}>    
                                    {university.displayName}
                                  </option>
                                ))}
                              </select>
                            </div>
                            
                            <div className="flex gap-2">
                              <button
                                onClick={handleAddInterview}
                                disabled={!newInterviewUniversity}
                                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm flex items-center justify-center gap-2"
                              >
                                <Plus className="w-4 h-4" />
                                Add Interview
                              </button>
                              <button
                                onClick={() => {
                                  setShowAddInterview(false);
                                  setNewInterviewUniversity('');
                                }}
                                className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Interview Tips for Core Packages */}
              <div className="bg-blue-100 border border-blue-200 rounded-lg p-4">
                <h6 className="font-semibold text-blue-900 mb-2">Interview Tips for Core Package</h6>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Review the student's personal statement before each interview</li>
                  <li>• Create a welcoming and supportive environment</li>
                  <li>• Focus on different aspects and universities in each session</li>
                  <li>• Allow time for the student to ask questions</li>
                  <li>• Provide constructive feedback after each interview</li>
                  <li>• Build complexity across the 3 interviews progressively</li>
                </ul>
              </div>
            </div>
          ) : (
            // Live Package - Two Column Layout
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Scheduling */}
              <div className="space-y-6">
                {/* Interview Scheduling - Only show for live packages (non-core) */}
                {isLivePackage && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      Schedule Interview
                    </h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Date
                        </label>
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          min={getMinDate()}
                          max={getMaxDate()}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Time
                        </label>
                        <select
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Choose a time slot</option>
                          {generateTimeSlots().map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <MessageSquare className="w-4 h-4 inline mr-1" />
                          Comments (Optional)
                        </label>
                        <textarea
                          value={comments}
                          onChange={(e) => setComments(e.target.value)}
                          placeholder="Add any special instructions or notes for the interview..."
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                      </div>

                      <button
                        onClick={() => handleScheduleInterview()}
                        disabled={!selectedDate || !selectedTime}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                      >
                        <Clock className="w-5 h-5" />
                        Schedule Interview
                      </button>
                    </div>
                  </div>
                )}

                {!isLivePackage && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 text-sm">
                      <strong>Note:</strong> This booking is not for a live interview package. 
                      Scheduling functionality is only available for live interview packages.
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column - Interview Questions */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                  Interview Questions
                </h4>
                
                {booking.universities ? (
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-green-700 mb-4">
                      Based on the selected universities: <strong>{booking.universities}</strong>
                    </p>
                    
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {interviewQuestions.map((categoryGroup, index) => (
                        <div key={index} className="bg-white rounded-lg border border-green-200">
                          <button
                            onClick={() => toggleCategory(categoryGroup.category)}
                            className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                          >
                            <h5 className="font-semibold text-gray-900">{categoryGroup.category}</h5>
                            {expandedCategories.has(categoryGroup.category) ? (
                              <ChevronUp className="w-5 h-5 text-gray-500" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-500" />
                            )}
                          </button>
                          
                          {expandedCategories.has(categoryGroup.category) && (
                            <div className="px-4 pb-4">
                              <ul className="space-y-2">
                                {categoryGroup.questions.map((question, qIndex) => (
                                  <li key={qIndex} className="text-sm text-gray-700 pl-4 border-l-2 border-green-200">
                                    {question}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-100 rounded-lg p-4">
                    <p className="text-gray-600 text-sm">
                      No universities specified for this booking. Interview questions will be general medical interview questions.
                    </p>
                  </div>
                )}

                {/* Interview Tips */}
                <div className="bg-blue-100 border border-blue-200 rounded-lg p-4">
                  <h6 className="font-semibold text-blue-900 mb-2">Interview Tips:</h6>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Review the student's personal statement before the interview</li>
                    <li>• Create a welcoming and supportive environment</li>
                    <li>• Allow time for the student to ask questions</li>
                    <li>• Provide constructive feedback after the interview</li>
                    <li>• Focus on both technical knowledge and personal qualities</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewBookingModal;