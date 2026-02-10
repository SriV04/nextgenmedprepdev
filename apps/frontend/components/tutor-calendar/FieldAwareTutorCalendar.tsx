'use client';

import React, { useState, useEffect } from 'react';
import TutorCalendar from './TutorCalendar';
import UnassignedInterviews from './UnassignedInterviews';
import AvailabilityModal from './AvailabilityModal';
import InterviewDetailsModal from './InterviewDetailsModal';
import CommitChangesBar from './CommitChangesBar';
import { useTutorCalendar } from '../../contexts/TutorCalendarContext';
import type { TutorCalendarProps } from '../../types/tutor-calendar';
import { Stethoscope, Smile, BookOpen, GraduationCap } from 'lucide-react';

interface FieldAwareTutorCalendarProps extends TutorCalendarProps {
  showBothFields?: boolean;
  onInterviewClick?: (interview: any) => void;
}

/**
 * FieldAwareTutorCalendar
 * Manages field selection for medicine and dentistry interviews
 * Uses the existing TutorCalendarContext and switches field filter
 */
export const FieldAwareTutorCalendar: React.FC<FieldAwareTutorCalendarProps> = ({
  onSlotClick,
  isAdmin,
  showBothFields = true,
  onInterviewClick,
}) => {
  const [activeTab, setActiveTab] = useState<'medicine' | 'dentistry' | 'ucat' | 'alevels'>('medicine');
  const { setSelectedField, currentUserId, userRole } = useTutorCalendar();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';

  // Update the context field when tab changes
  useEffect(() => {
    if (setSelectedField) {
      setSelectedField(activeTab);
    }
  }, [activeTab, setSelectedField]);

  // Always call hooks at the top level
  useEffect(() => {
    if (!showBothFields && setSelectedField) {
      setSelectedField('medicine');
    }
  }, [showBothFields, setSelectedField]);

  if (!showBothFields) {
    return (
      <>
        <CommitChangesBar />
        <UnassignedInterviews onInterviewClick={onInterviewClick} field="medicine" />
        <TutorCalendar onSlotClick={onSlotClick} isAdmin={isAdmin} />
        <AvailabilityModal />
        <InterviewDetailsModal />
      </>
    );
  }

  // Both fields mode - show tabs
  return (
    <div className="w-full space-y-4">
      {/* Field Selection Tabs */}
      <div className="mb-4 flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('medicine')}
          className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
            activeTab === 'medicine'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Stethoscope className="w-5 h-5" />
          Medicine
        </button>
        <button
          onClick={() => setActiveTab('dentistry')}
          className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
            activeTab === 'dentistry'
              ? 'border-b-2 border-purple-600 text-purple-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Smile className="w-5 h-5" />
          Dentistry
        </button>
        <button
          onClick={() => setActiveTab('ucat')}
          className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
            activeTab === 'ucat'
              ? 'border-b-2 border-green-600 text-green-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          UCAT
        </button>
        <button
          onClick={() => setActiveTab('alevels')}
          className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
            activeTab === 'alevels'
              ? 'border-b-2 border-orange-600 text-orange-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <GraduationCap className="w-5 h-5" />
          A-Levels
        </button>
      </div>

      {/* Field Info Banner */}
      {activeTab === 'medicine' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 flex items-center gap-2">
            <Stethoscope className="w-5 h-5" />
            Medicine Interview Calendar
          </h3>
          <p className="text-sm text-blue-800">
            Showing tutors and interviews for medicine programs
          </p>
        </div>
      )}
      {activeTab === 'dentistry' && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="font-semibold text-purple-900 flex items-center gap-2">
            <Smile className="w-5 h-5" />
            Dentistry Interview Calendar
          </h3>
          <p className="text-sm text-purple-800">
            Showing tutors and interviews for dentistry programs
          </p>
        </div>
      )}
      {activeTab === 'ucat' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            UCAT Tutoring Calendar
          </h3>
          <p className="text-sm text-green-800">
            Showing tutors and sessions for UCAT preparation
          </p>
        </div>
      )}
      {activeTab === 'alevels' && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h3 className="font-semibold text-orange-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            A-Levels Tutoring Calendar
          </h3>
          <p className="text-sm text-orange-800">
            Showing tutors and sessions for A-Level subjects
          </p>
        </div>
      )}

      {/* Commit Changes Bar */}
      <CommitChangesBar />

      {/* Unassigned Interviews */}
      <UnassignedInterviews
        onInterviewClick={onInterviewClick}
        field={activeTab}
      />

      {/* Calendar Grid */}
      <TutorCalendar onSlotClick={onSlotClick} isAdmin={isAdmin} />

      {/* Modals */}
      <AvailabilityModal />
      <InterviewDetailsModal />
    </div>
  );
};

export default FieldAwareTutorCalendar;
