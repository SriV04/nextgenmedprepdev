'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface UCATScores {
  verbal_reasoning?: number;
  decision_making?: number;
  quantitative_reasoning?: number;
  abstract_reasoning?: number;
  situational_judgement?: number;
  overall_score?: number;
  year_taken?: string;
}

interface BMATScores {
  section1_score?: number;
  section2_score?: number;
  section3_score?: number;
  overall_score?: number;
  year_taken?: string;
}

interface MedDentGrades {
  interview_scores?: Record<string, any>;
  admissions_test_scores?: Record<string, any>;
  other_achievements?: string[];
}

interface JoinTeamFormData {
  full_name: string;
  email: string;
  phone_number: string;
  alevel_subjects_grades: string;
  university_year: string;
  med_dent_grades: MedDentGrades;
  ucat: UCATScores;
  bmat?: BMATScores;
  med_school_offers: string;
  subjects_can_tutor: string[];
  exam_boards: string;
  tutoring_experience: string;
  why_tutor: string;
  availability: string[];
  cv_url?: string;
}

const tutoringSubjects = [
  'UCAT',
  'A-Level Biology',
  'A-Level Chemistry',
  'A-Level Maths',
  'GCSE - Various',
  'Interview Prep',
  'Personal Statement Review'
];

const availabilityOptions = [
  'Weekdays',
  'Evenings',
  'Weekends',
  'Flexible'
];

export default function JoinTeamForm() {
  const [formData, setFormData] = useState<JoinTeamFormData>({
    full_name: '',
    email: '',
    phone_number: '',
    alevel_subjects_grades: '',
    university_year: '',
    med_dent_grades: {
      interview_scores: {},
      admissions_test_scores: {},
      other_achievements: []
    },
    ucat: {
      verbal_reasoning: undefined,
      decision_making: undefined,
      quantitative_reasoning: undefined,
      abstract_reasoning: undefined,
      situational_judgement: undefined,
      overall_score: undefined,
      year_taken: ''
    },
    bmat: {
      section1_score: undefined,
      section2_score: undefined,
      section3_score: undefined,
      overall_score: undefined,
      year_taken: ''
    },
    med_school_offers: '',
    subjects_can_tutor: [],
    exam_boards: '',
    tutoring_experience: '',
    why_tutor: '',
    availability: [],
    cv_url: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('ucat.')) {
      const ucatField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        ucat: {
          ...prev.ucat,
          [ucatField]: ucatField === 'year_taken' ? value : value ? Number(value) : undefined
        }
      }));
    } else if (name.startsWith('bmat.')) {
      const bmatField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        bmat: {
          ...prev.bmat!,
          [bmatField]: bmatField === 'year_taken' ? value : value ? Number(value) : undefined
        }
      }));
    } else if (name === 'med_dent_grades') {
      // Store the med/dent grades as a simple text entry in other_achievements
      setFormData(prev => ({
        ...prev,
        med_dent_grades: {
          interview_scores: {},
          admissions_test_scores: {},
          other_achievements: [value]
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'subjects_can_tutor' | 'availability') => {
    const { value, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [fieldName]: checked 
        ? [...prev[fieldName], value]
        : prev[fieldName].filter(item => item !== value)
    }));
  };

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
  const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || 'v1';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Prepare the data for submission
      const submitData = {
        ...formData,
        med_dent_grades: {
          ...formData.med_dent_grades,
          other_achievements: formData.med_dent_grades.other_achievements || []
        }
      };

      console.log('Submitting new joiner application:', {
        email: formData.email,
        full_name: formData.full_name
      });

      const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/new-joiners`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        // Reset form
        setFormData({
          full_name: '',
          email: '',
          phone_number: '',
          alevel_subjects_grades: '',
          university_year: '',
          med_dent_grades: { interview_scores: {}, admissions_test_scores: {}, other_achievements: [] },
          ucat: {},
          bmat: {},
          med_school_offers: '',
          subjects_can_tutor: [],
          exam_boards: '',
          tutoring_experience: '',
          why_tutor: '',
          availability: [],
          cv_url: ''
        });
      } else {
        throw new Error(result.error || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <motion.div 
        className="bg-green-50 border border-green-200 rounded-lg p-8 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-green-800 mb-2">Application Submitted Successfully!</h3>
        <p className="text-green-600 mb-6">
          Thank you for your interest in joining NextGen Med Prep. We'll review your application and get back to you within 5-7 business days.
        </p>
        <button
          onClick={() => setSubmitStatus('idle')}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Submit Another Application
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Academic Background */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Academic Background</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              A Level Subjects And Grades <span className="text-red-500">*</span>
            </label>
            <textarea
              name="alevel_subjects_grades"
              value={formData.alevel_subjects_grades}
              onChange={handleInputChange}
              required
              rows={3}
              placeholder="e.g., Biology: A*, Chemistry: A*, Maths: A"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              University & Year of Study <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="university_year"
              value={formData.university_year}
              onChange={handleInputChange}
              required
              placeholder="e.g., University of Manchester, Year 3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Medical/Dental School Grades - One Grade per Year Please <span className="text-red-500">*</span>
            </label>
            <textarea
              name="med_dent_grades"
              value={formData.med_dent_grades.other_achievements?.[0] || ''}
              onChange={handleInputChange}
              required
              rows={3}
              placeholder="e.g., Year 1: 80%, Year 2: 85%"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Admissions Test Scores */}
      <div className="bg-purple-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Admissions Test Scores</h3>
        
        {/* UCAT Scores */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-700 mb-3">UCAT Score & Breakdown <span className="text-red-500">*</span></h4>
          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="number"
              name="ucat.verbal_reasoning"
              value={formData.ucat.verbal_reasoning || ''}
              onChange={handleInputChange}
              placeholder="Verbal Reasoning"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="number"
              name="ucat.decision_making"
              value={formData.ucat.decision_making || ''}
              onChange={handleInputChange}
              placeholder="Decision Making"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="number"
              name="ucat.quantitative_reasoning"
              value={formData.ucat.quantitative_reasoning || ''}
              onChange={handleInputChange}
              placeholder="Quantitative Reasoning"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="number"
              name="ucat.abstract_reasoning"
              value={formData.ucat.abstract_reasoning || ''}
              onChange={handleInputChange}
              placeholder="Abstract Reasoning"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="number"
              name="ucat.situational_judgement"
              value={formData.ucat.situational_judgement || ''}
              onChange={handleInputChange}
              placeholder="Situational Judgement"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="number"
              name="ucat.overall_score"
              value={formData.ucat.overall_score || ''}
              onChange={handleInputChange}
              placeholder="Overall Score"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              name="ucat.year_taken"
              value={formData.ucat.year_taken || ''}
              onChange={handleInputChange}
              placeholder="Year Taken"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* BMAT Scores */}
        <div>
          <h4 className="font-medium text-gray-700 mb-3">BMAT Score & Breakdown (if applicable)</h4>
          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="number"
              step="0.1"
              name="bmat.section1_score"
              value={formData.bmat?.section1_score || ''}
              onChange={handleInputChange}
              placeholder="Section 1 Score"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="number"
              step="0.1"
              name="bmat.section2_score"
              value={formData.bmat?.section2_score || ''}
              onChange={handleInputChange}
              placeholder="Section 2 Score"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="number"
              step="0.1"
              name="bmat.section3_score"
              value={formData.bmat?.section3_score || ''}
              onChange={handleInputChange}
              placeholder="Section 3 Score"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="number"
              step="0.1"
              name="bmat.overall_score"
              value={formData.bmat?.overall_score || ''}
              onChange={handleInputChange}
              placeholder="Overall Score"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              name="bmat.year_taken"
              value={formData.bmat?.year_taken || ''}
              onChange={handleInputChange}
              placeholder="Year Taken"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Medical School Offers */}
      <div className="bg-green-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Medical School Offers</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Medical School Offers Received <span className="text-red-500">*</span>
          </label>
          <textarea
            name="med_school_offers"
            value={formData.med_school_offers}
            onChange={handleInputChange}
            required
            rows={3}
            placeholder="List all medical school offers you've received"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Tutoring Information */}
      <div className="bg-yellow-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Tutoring Information</h3>
        
        {/* Subjects You Can Tutor */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Subjects You Can Tutor <span className="text-red-500">*</span>
          </label>
          <div className="grid md:grid-cols-2 gap-2">
            {tutoringSubjects.map((subject) => (
              <label key={subject} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={subject}
                  checked={formData.subjects_can_tutor.includes(subject)}
                  onChange={(e) => handleCheckboxChange(e, 'subjects_can_tutor')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{subject}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Exam Boards */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            If you responded for tutoring please put exam board below
          </label>
          <input
            type="text"
            name="exam_boards"
            value={formData.exam_boards}
            onChange={handleInputChange}
            placeholder="e.g., AQA, OCR, Edexcel"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Previous Tutoring Experience */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Previous Tutoring Experience <span className="text-red-500">*</span>
          </label>
          <textarea
            name="tutoring_experience"
            value={formData.tutoring_experience}
            onChange={handleInputChange}
            required
            rows={4}
            placeholder="Describe your previous tutoring experience, including subjects taught, duration, and any relevant achievements"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Why Do You Want to Be a Tutor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Why Do You Want to Be a Tutor? <span className="text-red-500">*</span>
          </label>
          <textarea
            name="why_tutor"
            value={formData.why_tutor}
            onChange={handleInputChange}
            required
            rows={4}
            placeholder="Explain your motivation for becoming a tutor and how you plan to help students succeed"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Availability and CV */}
      <div className="bg-indigo-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Availability & Documents</h3>
        
        {/* Availability */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Availability for Tutoring <span className="text-red-500">*</span>
          </label>
          <div className="grid md:grid-cols-2 gap-2">
            {availabilityOptions.map((option) => (
              <label key={option} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={option}
                  checked={formData.availability.includes(option)}
                  onChange={(e) => handleCheckboxChange(e, 'availability')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* CV Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CV URL (Optional)
          </label>
          <input
            type="url"
            name="cv_url"
            value={formData.cv_url}
            onChange={handleInputChange}
            placeholder="Link to your CV (Google Drive, Dropbox, etc.)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-1">
            Please upload your CV to Google Drive or similar and share the link here
          </p>
        </div>
      </div>

      {/* Error Message */}
      {submitStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-red-700 font-medium">Error submitting application</span>
          </div>
          <p className="text-red-600 mt-2">{errorMessage}</p>
        </div>
      )}

      {/* Submit Button */}
      <div className="text-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
        </button>
      </div>
    </form>
  );
}