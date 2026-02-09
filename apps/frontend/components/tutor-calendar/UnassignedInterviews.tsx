'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, User, GraduationCap, Clock, Search, Filter, X, Mail, CalendarClock, BookOpen } from 'lucide-react';
import { useTutorCalendar } from '../../contexts/TutorCalendarContext';
import type { UnassignedInterviewsProps, StudentAvailabilitySlot } from '../../types/tutor-calendar';

const UnassignedInterviews: React.FC<UnassignedInterviewsProps> = ({
  onInterviewClick,
  field
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
  
  // Filter interviews based on search, field, and filters
  const filteredInterviews = useMemo(() => {
    return unassignedInterviews.filter(interview => {
      // Field filter - if field is specified, only show interviews for that field
      if (field && interview.field !== field) {
        return false;
      }
      
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
  }, [unassignedInterviews, searchQuery, packageFilter, field]);
  
  const interviews = filteredInterviews;
  const [studentAvailabilities, setStudentAvailabilities] = useState<Record<string, StudentAvailabilitySlot[]>>({});
  const [fetchedStudentIds, setFetchedStudentIds] = useState<Set<string>>(new Set());
  
  // Fetch student availability for interviews we haven't fetched yet
  useEffect(() => {
    const fetchAvailabilities = async () => {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';
      
      // Find interviews with studentIds we haven't fetched yet
      const studentIdsToFetch = new Set<string>();
      const interviewsByStudent = new Map<string, string[]>(); // studentId -> interviewIds[]
      
      for (const interview of unassignedInterviews) {
        if (interview.studentId && !fetchedStudentIds.has(interview.studentId)) {
          studentIdsToFetch.add(interview.studentId);
          if (!interviewsByStudent.has(interview.studentId)) {
            interviewsByStudent.set(interview.studentId, []);
          }
          interviewsByStudent.get(interview.studentId)!.push(interview.id);
        }
      }
      
      if (studentIdsToFetch.size === 0) return;
      
      const availMap: Record<string, StudentAvailabilitySlot[]> = {};
      const newlyFetchedIds = new Set(fetchedStudentIds);
      
      // Fetch only for new student IDs
      for (const studentId of studentIdsToFetch) {
        try {
          const availRes = await fetch(
            `${backendUrl}/api/v1/students/${studentId}/availability`
          );
          const availData = await availRes.json();
          
          if (availData.success && availData.data) {
            // Transform backend format to frontend format
            const slots = availData.data.map((slot: any) => ({
              id: slot.id,
              date: slot.date,
              dayOfWeek: slot.day_of_week,
              hourStart: slot.hour_start,
              hourEnd: slot.hour_end,
              type: slot.type,
            }));
            
            // Apply to all interviews for this student
            const interviewIds = interviewsByStudent.get(studentId) || [];
            for (const interviewId of interviewIds) {
              availMap[interviewId] = slots;
            }
            
            newlyFetchedIds.add(studentId);
          }
        } catch (err) {
          console.error(`Error fetching availability for ${studentId}:`, err);
        }
      }
      
      setStudentAvailabilities(prev => ({ ...prev, ...availMap }));
      setFetchedStudentIds(newlyFetchedIds);
    };
    
    fetchAvailabilities();
  }, [unassignedInterviews]);
  
  const handleDragStart = (e: React.DragEvent, interviewId: string): void => {
    e.dataTransfer.setData('interviewId', interviewId);
    e.dataTransfer.effectAllowed = 'move';
    
    // Pass student availability if available
    if (studentAvailabilities[interviewId]) {
      e.dataTransfer.setData('studentAvailability', JSON.stringify(studentAvailabilities[interviewId]));
    }
  };

  const handleInterviewClick = (interview: any): void => {
    openInterviewDetailsModal(interview.id);
  };
  
  // Format availability into a readable summary
  const formatAvailability = (availability: StudentAvailabilitySlot[]): JSX.Element | null => {
    if (!availability || availability.length === 0) return null;
    
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Group by day
    const dayGroups = availability.reduce((acc, slot) => {
      const dayIndex = typeof slot.dayOfWeek === 'number' ? slot.dayOfWeek : parseInt(String(slot.dayOfWeek));
      if (isNaN(dayIndex) || dayIndex < 0 || dayIndex > 6) return acc;
      
      const day = dayNames[dayIndex];
      if (!acc[day]) acc[day] = 0;
      acc[day]++;
      return acc;
    }, {} as Record<string, number>);
    
    const days = Object.keys(dayGroups);
    
    return (
      <div className="flex flex-wrap gap-1.5">
        {days.map((day) => (
          <span key={day} className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">
            {day}
            <span className="bg-green-200 text-green-800 rounded-full px-1.5 py-0.5 text-[10px] font-bold">
              {dayGroups[day]}
            </span>
          </span>
        ))}
      </div>
    );
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
          interviews.map((interview) => {
            const availability = studentAvailabilities[interview.id];
            const hasAvailability = availability && availability.length > 0;
            
            return (
              <div
                key={interview.id}
                draggable
                onDragStart={(e) => handleDragStart(e, interview.id)}
                onClick={() => handleInterviewClick(interview)}
                className="flex-shrink-0 w-72 bg-gradient-to-br from-orange-50 to-white border-2 border-orange-200 rounded-lg p-3 hover:shadow-lg hover:border-orange-300 transition-all cursor-pointer"
              >
                {/* Header with Student Info */}
                <div className="flex items-start gap-2 mb-2 pb-2 border-b border-orange-100">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-gray-900 text-sm mb-0.5 truncate">
                      {interview.studentName}
                    </h4>
                    <div className="flex items-center gap-1 text-xs text-gray-600 truncate">
                      <Mail className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{interview.studentEmail}</span>
                    </div>
                  </div>
                </div>

                {/* Package and University Info */}
                <div className="space-y-1.5 mb-2">
                  <div className="flex items-start gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-semibold text-gray-900 block">{interview.package}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-gray-700 line-clamp-1">{interview.universities}</span>
                  </div>
                </div>

                {/* Student Availability */}
                {hasAvailability ? (
                  <div className="bg-green-50 rounded-md p-2 mb-2 border border-green-200">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <CalendarClock className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-xs font-semibold text-green-800">
                        Available ({availability.length} slots)
                      </span>
                    </div>
                    {formatAvailability(availability)}
                  </div>
                ) : (
                  <div className="bg-yellow-50 rounded-md p-2 mb-2 border border-yellow-200">
                    <div className="flex items-center gap-1.5">
                      <CalendarClock className="w-3.5 h-3.5 text-yellow-600" />
                      <span className="text-xs text-yellow-800">No availability set</span>
                    </div>
                  </div>
                )}

                {/* Preferred Time */}
                {interview.preferredTime && (
                  <div className="bg-blue-50 rounded-md p-1.5 mb-2 border border-blue-200">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-blue-600 flex-shrink-0" />
                      <span className="text-xs text-blue-700 truncate">
                        Prefers: {interview.preferredTime}
                      </span>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {interview.notes && (
                  <div className="bg-gray-50 rounded-md p-1.5 mb-2 border border-gray-200">
                    <p className="text-xs text-gray-700 line-clamp-2">{interview.notes}</p>
                  </div>
                )}

                {/* Footer */}
                <div className="pt-2 border-t border-orange-100 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {new Date(interview.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-[10px] font-medium text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                    Drag to assign
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default UnassignedInterviews;
