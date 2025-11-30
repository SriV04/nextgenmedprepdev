'use client';

import React, { useState } from 'react';
import { useTutorCalendar } from '../../contexts/TutorCalendarContext';
import type { TutorCalendarProps } from '../../types/tutor-calendar';
import { CalendarHeader } from './calendarHeader';
import { SelectionToolbar } from './SelectionToolbar';
import { TimeSlotCell } from './TimeSlotCell';
import { CreateInterviewModal } from './CreateInterviewModal';
import { useCalendarInteractions } from './hooks/useCalendarInteractions';
import { 
  TIME_SLOTS, 
  formatDate, 
  generateSlotKey, 
  isStudentAvailable 
} from './utils/calendarUtils';

const TutorCalendar: React.FC<TutorCalendarProps> = ({ onSlotClick, isAdmin = false }) => {
  const {
    tutors,
    selectedDate,
    selectedInterviewDetails,
    isInterviewDetailsModalOpen,
    createInterview
  } = useTutorCalendar();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const {
    isSelecting,
    selectedSlots,
    dragOverSlot,
    draggedStudentAvailability,
    handleSlotMouseDown,
    handleSlotMouseEnter,
    toggleSlotSelection,
    clearSelection,
    handleBatchAvailability,
    handleBatchRemove,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDragEnd,
    handleDropOnSlot,
  } = useCalendarInteractions();

  const dateStr = formatDate(selectedDate);
  
  // Determine selection toolbar props
  const hasEmptySlots = Array.from(selectedSlots).some(key => key.endsWith('::empty'));
  const hasExistingSlots = Array.from(selectedSlots).some(key => !key.endsWith('::empty'));

  return (
    <>
      <CreateInterviewModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateInterview={createInterview}
      />
      
      <div className="flex flex-col h-full bg-white rounded-lg shadow overflow-hidden">
        <CalendarHeader onCreateInterview={() => setIsCreateModalOpen(true)} isAdmin={isAdmin} />
      
      <SelectionToolbar
        selectedCount={selectedSlots.size}
        hasEmptySlots={hasEmptySlots}
        hasExistingSlots={hasExistingSlots}
        onMarkAvailable={handleBatchAvailability}
        onRemoveAvailability={handleBatchRemove}
        onClear={clearSelection}
      />

      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto -webkit-overflow-scrolling-touch">
        <div className="w-max min-w-full">
          {/* Time Header */}
          <div className="sticky top-0 bg-gray-50 border-b-2 border-gray-300 z-10">
            <div className="flex">
              <div className="w-32 sm:w-48 shrink-0 sticky left-0 bg-gray-50 p-2 sm:p-3 border-r border-gray-300 font-medium text-xs sm:text-sm text-gray-700 z-20">
                Tutor
              </div>
              {TIME_SLOTS.map((time) => (
                <div
                  key={time}
                  className="flex-1 min-w-[80px] sm:min-w-[100px] shrink-0 p-2 sm:p-3 text-center border-r border-gray-200 font-medium text-xs sm:text-sm text-gray-700"
                >
                  {time}
                </div>
              ))}
            </div>
          </div>

          {/* Tutor Rows */}
          {tutors.map((tutor) => {
            const daySlots = tutor.schedule[dateStr] || [];
            
            return (
              <div key={tutor.tutorId} className="flex w-full border-b border-gray-200 hover:bg-gray-50 transition-colors min-h-[60px] sm:min-h-[80px]">
                {/* Tutor Info Column */}
                <div className="w-32 sm:w-48 shrink-0 sticky left-0 bg-white p-2 sm:p-4 border-r border-gray-300 z-10">
                  <div className="flex items-center gap-2 sm:gap-3 h-full">
                    <div 
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm flex-shrink-0"
                      style={{ backgroundColor: tutor.color }}
                    >
                      {tutor.tutorName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-gray-900 truncate text-xs sm:text-sm">{tutor.tutorName}</div>
                      <div className="text-[10px] sm:text-xs text-gray-500 truncate hidden sm:block">{tutor.tutorEmail}</div>
                    </div>
                  </div>
                </div>

                {/* Time Slot Columns */}
                {TIME_SLOTS.map((time) => {
                  const slot = daySlots.find(s => s.startTime === time);
                  const slotKey = generateSlotKey(tutor.tutorId, time, slot?.id);
                  const isDragOver = dragOverSlot === slotKey;
                  const isSelected = selectedSlots.has(slotKey);
                  const isSelectable = !slot || slot.type === 'blocked' || slot.type === 'available';
                  const showStudentAvailability = isStudentAvailable(
                    dateStr, 
                    time, 
                    draggedStudentAvailability,
                    isInterviewDetailsModalOpen ? selectedInterviewDetails?.studentAvailability : undefined
                  );
                  const hasMatchingTutor = showStudentAvailability && slot?.type === 'available';

                  return (
                    <TimeSlotCell
                      key={slotKey}
                      tutor={tutor}
                      time={time}
                      slot={slot}
                      isSelected={isSelected}
                      isDragOver={isDragOver}
                      showStudentAvailability={showStudentAvailability}
                      hasMatchingTutor={hasMatchingTutor}
                      isSelectable={isSelectable}
                      onMouseDown={(e) => handleSlotMouseDown(tutor.tutorId, time, slot)}
                      onMouseEnter={() => handleSlotMouseEnter(tutor.tutorId, time, slot)}
                      onClick={() => {
                        if (slot && slot.type === 'interview') {
                          onSlotClick(slot, tutor);
                        } else if (isSelectable) {
                          toggleSlotSelection(tutor.tutorId, time, slot);
                        }
                      }}
                      onDragOver={(e) => !isSelecting && handleDragOver(e, slotKey)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => !isSelecting && handleDropOnSlot(e, tutor.tutorId, dateStr, time)}
                      onDragEnd={handleDragEnd}
                      onDragStart={slot?.bookingId ? (e) => handleDragStart(e, slot.bookingId!) : undefined}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
    </>
  );
};

export default TutorCalendar;
