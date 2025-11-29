import { SlotType, StudentAvailabilitySlot } from "@/types/tutor-calendar";

// Consistent Key Generation
export const generateSlotKey = (tutorId: string, time: string, slotId: string = 'empty') => 
  `${tutorId}::${time}::${slotId}`;

// Consistent Key Parsing
export const parseSlotKey = (key: string) => {
  const [tutorId, time, slotId] = key.split('::');
  return { tutorId, time, slotId };
};

export const getSlotColor = (type: SlotType): string => {
  switch (type) {
    case 'available': return 'bg-green-100 border-green-300 hover:bg-green-200';
    case 'interview': return 'bg-blue-100 border-blue-300 hover:bg-blue-200';
    case 'blocked': return 'bg-gray-100 border-gray-300';
    default: return 'bg-white border-gray-200';
  }
};

export const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00', '13:00', 
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
];

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const formatDateHeader = (date: Date): string => {
  return date.toLocaleDateString('en-GB', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
};

// Check if a time slot matches student availability
export const isStudentAvailable = (
  date: string,
  time: string,
  draggedAvailability: StudentAvailabilitySlot[],
  selectedInterviewAvailability: StudentAvailabilitySlot[] | undefined
): boolean => {
  // Check dragged availability first (takes priority during drag operations)
  if (draggedAvailability.length > 0) {
    const slotDate = new Date(date);
    const dayOfWeek = slotDate.getDay();
    const hour = parseInt(time.split(':')[0], 10);
    
    return draggedAvailability.some((avail) => {
      if (avail.dayOfWeek !== dayOfWeek) return false;
      return hour >= avail.hourStart && hour < avail.hourEnd;
    });
  }
  
  // Check selected interview availability (when modal is open)
  if (selectedInterviewAvailability) {
    const availability = selectedInterviewAvailability.filter(avail => avail.date === date);
    if (availability.length === 0) return false;
    
    const hour = parseInt(time.split(':')[0], 10);
    return availability.some((avail) => {
      return hour >= avail.hourStart && hour < avail.hourEnd;
    });
  }
  
  return false;
};