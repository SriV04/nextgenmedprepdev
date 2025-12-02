import { useState, useEffect } from 'react';
import { useTutorCalendar } from '@/contexts/TutorCalendarContext';
import { generateSlotKey, parseSlotKey, formatDate } from '../utils/calendarUtils';
import { TimeSlot, StudentAvailabilitySlot } from '@/types/tutor-calendar';

export const useCalendarInteractions = () => {
  const { markSlotsAvailable, removeAvailability, assignInterview, selectedDate, currentUserId, userRole } = useTutorCalendar();

  // --- Selection State ---
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());
  const [selectionStartTutor, setSelectionStartTutor] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // --- Drag State ---
  const [draggedBooking, setDraggedBooking] = useState<string | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<string | null>(null);
  const [draggedStudentAvailability, setDraggedStudentAvailability] = useState<StudentAvailabilitySlot[]>([]);

  // --- Selection Handlers ---
  
  // Simplified mouse down - only initiates drag selection
  const handleSlotMouseDown = (tutorId: string, time: string, slot: TimeSlot | undefined, isCtrlOrCmd: boolean) => {
    if (slot?.type === 'interview') return;
    
    // Permission check: tutors can only select their own slots
    if (userRole === 'tutor' && currentUserId && tutorId !== currentUserId) {
      return;
    }
    
    // Reset drag flag
    setIsDragging(false);
    
    // Check if clicking on a different tutor than current selection
    const existingSelections = Array.from(selectedSlots);
    const existingTutorIds = existingSelections.map(k => parseSlotKey(k).tutorId);
    const hasDifferentTutor = existingTutorIds.length > 0 && existingTutorIds.some(id => id !== tutorId);
    
    // If clicking on a different tutor, start fresh selection
    if (hasDifferentTutor) {
      setSelectionStartTutor(tutorId);
      setSelectedSlots(new Set());
    } else {
      setSelectionStartTutor(tutorId);
    }
    
    // Start drag selection
    setIsSelecting(true);
  };

  const handleSlotMouseEnter = (tutorId: string, time: string, slot: TimeSlot | undefined) => {
    if (isSelecting && tutorId === selectionStartTutor) {
      if (!slot || slot.type === 'blocked' || slot.type === 'available') {
        setIsDragging(true); // Mark that we've dragged to another slot
        const key = generateSlotKey(tutorId, time, slot?.id);
        setSelectedSlots(prev => new Set([...prev, key]));
      }
    }
  };

  // Dedicated click handler for toggling individual slots
  const handleSlotClick = (tutorId: string, time: string, slot: TimeSlot | undefined) => {
    // Don't toggle if user was dragging
    if (isDragging) return;
    
    if (slot?.type === 'interview') return;
    
    // Permission check: tutors can only select their own slots
    if (userRole === 'tutor' && currentUserId && tutorId !== currentUserId) {
      return;
    }
    
    const slotKey = generateSlotKey(tutorId, time, slot?.id);
    
    // Check if clicking on a different tutor than current selection
    const existingSelections = Array.from(selectedSlots);
    const existingTutorIds = existingSelections.map(k => parseSlotKey(k).tutorId);
    const hasDifferentTutor = existingTutorIds.length > 0 && existingTutorIds.some(id => id !== tutorId);
    
    // If clicking on a different tutor, clear previous selection and start fresh
    if (hasDifferentTutor) {
      setSelectionStartTutor(tutorId);
      setSelectedSlots(new Set([slotKey]));
      return;
    }
    
    // Same tutor - toggle selection
    setSelectionStartTutor(tutorId);
    setSelectedSlots(prev => {
      const newSet = new Set(prev);
      if (newSet.has(slotKey)) {
        newSet.delete(slotKey);
      } else {
        newSet.add(slotKey);
      }
      return newSet;
    });
  };

  const clearSelection = () => {
    setSelectedSlots(new Set());
    setSelectionStartTutor(null);
    setIsSelecting(false);
  };

  // --- Batch Actions ---
  const handleBatchAvailability = () => {
    if (selectedSlots.size === 0) return;
    const dateStr = formatDate(selectedDate);

    const slotsToMark = Array.from(selectedSlots)
      .map(parseSlotKey)
      .filter(item => item.slotId === 'empty')
      .map(({ tutorId, time }) => ({ tutorId, date: dateStr, time }));

    if (slotsToMark.length === 0) {
      alert('No empty slots selected. Please select empty time slots to mark as available.');
      return;
    }
    
    markSlotsAvailable(slotsToMark);
    clearSelection();
  };

  const handleBatchRemove = () => {
    if (selectedSlots.size === 0) return;

    const slotsToRemove = Array.from(selectedSlots)
      .map(parseSlotKey)
      .filter(item => item.slotId !== 'empty')
      .map(({ tutorId, slotId }) => ({ tutorId, slotId }));

    if (slotsToRemove.length === 0) {
      alert('No available slots selected. Please select existing availability slots to remove.');
      return;
    }
    
    if (confirm(`Remove ${slotsToRemove.length} availability slot(s)?`)) {
      removeAvailability(slotsToRemove);
      clearSelection();
    }
  };

  // --- Drag Handlers ---
  const handleDragStart = (e: React.DragEvent, bookingId: string): void => {
    setDraggedBooking(bookingId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedStudentAvailability([]);
  };

  const handleDragOver = (e: React.DragEvent, slotKey: string): void => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverSlot(slotKey);
    
    // Try to get student availability from drag data
    const availabilityData = e.dataTransfer.getData('studentAvailability');
    if (availabilityData && draggedStudentAvailability.length === 0) {
      try {
        const availability = JSON.parse(availabilityData);
        setDraggedStudentAvailability(availability);
      } catch (err) {
        console.error('Error parsing student availability:', err);
      }
    }
  };

  const handleDragLeave = (): void => {
    setDragOverSlot(null);
  };
  
  const handleDragEnd = (): void => {
    setDraggedStudentAvailability([]);
    setDragOverSlot(null);
  };

  const handleDropOnSlot = (e: React.DragEvent, tutorId: string, date: string, time: string): void => {
    e.preventDefault();
    setDragOverSlot(null);
    setDraggedStudentAvailability([]);
    
    // Try to get interview ID from dataTransfer (from UnassignedInterviews)
    const interviewId = e.dataTransfer.getData('interviewId');
    
    if (interviewId) {
      // Stage the interview assignment (no backend call yet)
      assignInterview(tutorId, date, time, interviewId);
    } else if (draggedBooking) {
      // Handle internal drag from within calendar
      assignInterview(tutorId, date, time, draggedBooking);
      setDraggedBooking(null);
    }
  };

  // --- Global Mouse Up ---
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsSelecting(false);
      // Reset drag flag after a short delay to allow click handler to check it
      setTimeout(() => setIsDragging(false), 50);
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  return {
    isSelecting,
    selectedSlots,
    dragOverSlot,
    draggedStudentAvailability,
    handleSlotMouseDown,
    handleSlotMouseEnter,
    handleSlotClick,
    clearSelection,
    handleBatchAvailability,
    handleBatchRemove,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDragEnd,
    handleDropOnSlot,
  };
};