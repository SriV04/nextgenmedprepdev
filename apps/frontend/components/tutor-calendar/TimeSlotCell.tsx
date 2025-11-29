import React from 'react';
import { TimeSlot, TutorSchedule } from '../../types/tutor-calendar';
import { Check } from 'lucide-react';
import { getSlotColor } from './utils/calendarUtils';

interface TimeSlotCellProps {
  tutor: TutorSchedule;
  time: string;
  slot?: TimeSlot;
  isSelected: boolean;
  isDragOver: boolean;
  showStudentAvailability: boolean;
  hasMatchingTutor: boolean;
  isSelectable: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseEnter: () => void;
  onClick: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  onDragStart?: (e: React.DragEvent) => void;
}

export const TimeSlotCell: React.FC<TimeSlotCellProps> = ({
  slot,
  isSelected,
  isDragOver,
  showStudentAvailability,
  hasMatchingTutor,
  isSelectable,
  onMouseDown,
  onMouseEnter,
  onClick,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  onDragStart
}) => {
  return (
    <div
      className={`flex-1 min-w-[100px] p-2 border-r border-gray-200 transition-all ${
        isSelectable ? 'cursor-pointer' : 'cursor-default'
      } ${
        slot ? getSlotColor(slot.type) : 'bg-white hover:bg-gray-100'
      } ${
        isDragOver ? 'ring-2 ring-blue-500 ring-inset bg-blue-50' : ''
      } ${
        isSelected ? 'ring-4 ring-purple-500 ring-inset bg-purple-100' : ''
      } ${
        showStudentAvailability && !slot ? 'bg-yellow-50 border-yellow-300' : ''
      } ${
        hasMatchingTutor ? 'bg-green-200 border-green-400 ring-2 ring-green-300' : ''
      }`}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
    >
      {slot ? (
        <div 
          className={`h-full p-2 rounded text-xs ${
            slot.type === 'interview' 
              ? slot.isPending 
                ? 'border-2 border-orange-400 bg-orange-50 shadow-sm' 
                : 'border border-blue-400 bg-blue-50'
              : ''
          }`}
          draggable={slot.type === 'interview'}
          onDragStart={onDragStart}
        >
          <div className={`font-semibold truncate ${
            slot.isPending ? 'text-orange-900' : 'text-gray-900'
          }`}>
            {slot.isPending && '⏳ '}{slot.title}
          </div>
          {slot.student && (
            <div className={`truncate mt-1 ${
              slot.isPending ? 'text-orange-700' : 'text-gray-700'
            }`}>{slot.student}</div>
          )}
          {slot.package && (
            <div className={`truncate mt-0.5 text-[10px] ${
              slot.isPending ? 'text-orange-600' : 'text-gray-600'
            }`}>{slot.package}</div>
          )}
          {slot.isPending && (
            <div className="mt-1 text-[10px] text-orange-700 font-medium">Pending commit</div>
          )}
        </div>
      ) : (
        <div className="h-full flex items-center justify-center">
          {isSelected ? (
            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
          ) : (
            <div className="w-2 h-2 bg-gray-200 rounded-full opacity-0 group-hover:opacity-50"></div>
          )}
        </div>
      )}
    </div>
  );
};