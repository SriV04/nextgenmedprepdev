'use client';

import React, { useState, useMemo } from 'react';
import { Calendar, User, GraduationCap, Clock, Search, Filter, X } from 'lucide-react';
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
  const { unassignedInterviews, openInterviewDetailsModal, selectedInterviewDetails } = useTutorCalendar();
  const [searchQuery, setSearchQuery] = useState('');
  const [packageFilter, setPackageFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Get unique packages for filter
  const uniquePackages = useMemo(() => {
    const packages = new Set(unassignedInterviews.map(i => i.package));
    return Array.from(packages).sort();
  }, [unassignedInterviews]);
  
  // Filter interviews based on search and filters
  const filteredInterviews = useMemo(() => {
    return unassignedInterviews.filter(interview => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          interview.studentName.toLowerCase().includes(query) ||
          interview.studentEmail.toLowerCase().includes(query) ||
          interview.universities.toLowerCase().includes(query) ||
          interview.package.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      
      // Package filter
      if (packageFilter !== 'all' && interview.package !== packageFilter) {
        return false;
      }
      
      return true;
    });
  }, [unassignedInterviews, searchQuery, packageFilter]);
  
  const interviews = filteredInterviews;
  const handleDragStart = async (e: React.DragEvent, interviewId: string) => {
    e.dataTransfer.setData('interviewId', interviewId);
    e.dataTransfer.effectAllowed = 'move';
    
    // Fetch and pass student availability for this interview
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';
      const interviewRes = await fetch(`${backendUrl}/api/v1/interviews/${interviewId}`);
      const interviewData = await interviewRes.json();
      
      if (interviewData.success && interviewData.data.student_id) {
        const availRes = await fetch(
          `${backendUrl}/api/v1/students/${interviewData.data.student_id}/availability`
        );
        const availData = await availRes.json();
        
        if (availData.success && availData.data) {
          // Store availability in dataTransfer
          e.dataTransfer.setData('studentAvailability', JSON.stringify(availData.data));
        }
      }
    } catch (err) {
      console.error('Error fetching student availability:', err);
    }
  };

  const handleInterviewClick = (interview: UnassignedInterview) => {
    openInterviewDetailsModal(interview.id);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-orange-600" />
          <h3 className="text-base font-semibold text-gray-900">
            Unassigned Interviews
          </h3>
        </div>
        <div className="text-xs text-gray-500 bg-orange-50 px-2 py-1 rounded-full">
          {filteredInterviews.length} of {unassignedInterviews.length}
        </div>
        <p className="text-sm text-gray-500 ml-auto">
          Drag and drop to assign to a tutor
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-3 space-y-2">
        <div className="flex gap-2">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student, email, university, or package..."
              className="w-full pl-9 pr-8 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
              showFilters || packageFilter !== 'all'
                ? 'bg-orange-100 text-orange-700 border-2 border-orange-300'
                : 'bg-gray-100 text-gray-700 border-2 border-gray-300 hover:bg-gray-200'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
            {packageFilter !== 'all' && (
              <span className="bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                1
              </span>
            )}
          </button>

          {/* Clear All Button */}
          {(searchQuery || packageFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setPackageFilter('all');
              }}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 space-y-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Package Type
              </label>
              <select
                value={packageFilter}
                onChange={(e) => setPackageFilter(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
              >
                <option value="all">All Packages ({unassignedInterviews.length})</option>
                {uniquePackages.map(pkg => {
                  const count = unassignedInterviews.filter(i => i.package === pkg).length;
                  return (
                    <option key={pkg} value={pkg}>
                      {pkg} ({count})
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        )}

        {/* Results Summary */}
        {(searchQuery || packageFilter !== 'all') && (
          <div className="text-xs text-gray-600 px-1">
            {filteredInterviews.length === 0 ? (
              <span className="text-orange-600">No interviews match your search criteria</span>
            ) : (
              <span>
                Showing {filteredInterviews.length} of {unassignedInterviews.length} interviews
              </span>
            )}
          </div>
        )}
      </div>

      {/* Interviews List */}
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
              onClick={() => handleInterviewClick(interview)}
              className="flex-shrink-0 w-64 bg-gradient-to-br from-orange-50 to-white border-2 border-orange-200 rounded-lg p-3 hover:shadow-lg hover:border-orange-300 transition-all cursor-pointer"
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
