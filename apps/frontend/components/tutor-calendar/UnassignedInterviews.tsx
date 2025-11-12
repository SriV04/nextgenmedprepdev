'use client';

import React from 'react';
import { Calendar, User, GraduationCap, Clock } from 'lucide-react';
import { useTutorCalendar } from '../../contexts/TutorCalendarContext';

interface UnassignedInterview {
  id: string;
  studentName: string;
  studentEmail: string;
  package: string;
  universities: string;
  preferredTime?: string;
  createdAt: string;
}

interface UnassignedInterviewsProps {
  onInterviewClick: (interview: UnassignedInterview) => void;
}

const UnassignedInterviews: React.FC<UnassignedInterviewsProps> = ({
  onInterviewClick
}) => {
  const { unassignedInterviews } = useTutorCalendar();
  const interviews = unassignedInterviews;
  const handleDragStart = (e: React.DragEvent, interviewId: string) => {
    e.dataTransfer.setData('interviewId', interviewId);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-orange-600" />
          <h3 className="text-base font-semibold text-gray-900">
            Unassigned Interviews
          </h3>
        </div>
        <div className="text-xs text-gray-500 bg-orange-50 px-2 py-1 rounded-full">
          {interviews.length} pending
        </div>
        <p className="text-sm text-gray-500 ml-auto">
          Drag and drop to assign to a tutor
        </p>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
        {interviews.length === 0 ? (
          <div className="flex-1 text-center py-6 text-gray-500">
            <Calendar className="w-10 h-10 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No unassigned interviews</p>
          </div>
        ) : (
          interviews.map((interview) => (
            <div
              key={interview.id}
              draggable
              onDragStart={(e) => handleDragStart(e, interview.id)}
              onClick={() => onInterviewClick(interview)}
              className="flex-shrink-0 w-64 bg-gradient-to-br from-orange-50 to-white border-2 border-orange-200 rounded-lg p-3 hover:shadow-lg hover:border-orange-300 transition-all cursor-move"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm truncate">
                    {interview.studentName}
                  </h4>
                  <p className="text-xs text-gray-500 truncate">{interview.studentEmail}</p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-gray-700">
                  <GraduationCap className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" />
                  <span className="font-medium truncate">{interview.package}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" />
                  <span className="truncate">{interview.universities}</span>
                </div>
                {interview.preferredTime && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" />
                    <span className="truncate">Preferred: {interview.preferredTime}</span>
                  </div>
                )}
              </div>

              <div className="mt-3 pt-2 border-t border-orange-100">
                <span className="text-xs text-gray-500">
                  Created {new Date(interview.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UnassignedInterviews;
