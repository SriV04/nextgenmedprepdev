/**
 * Tutor Calendar Types
 * Centralized type definitions for the tutor calendar system
 */

// ============================================================================
// Time Slot Types
// ============================================================================

export type SlotType = 'available' | 'interview' | 'blocked';

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  type: SlotType;
  title?: string;
  bookingId?: string;
  interviewId?: string;
  student?: string;
  package?: string;
  isPending?: boolean; // For staged assignments not yet committed
}

export interface AvailabilitySlot {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface DateAvailabilitySlot {
  id?: string;
  date: string;
  hour_start: number;
  hour_end: number;
  isExisting: boolean;
}

// ============================================================================
// Student Types
// ============================================================================

export interface StudentAvailabilitySlot {
  id: string;
  date: string;
  dayOfWeek: number;
  hourStart: number;
  hourEnd: number;
  type: string;
}

export interface UnassignedInterview {
  id: string;
  studentName: string;
  studentEmail: string;
  studentId?: string;
  package: string;
  universities: string;
  preferredTime?: string;
  createdAt: string;
  field?: string;
  phone?: string;
  notes?: string;
}

export interface InterviewDetails {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  package: string;
  universities: string;
  preferredTime?: string;
  createdAt: string;
  field?: string;
  phone?: string;
  notes?: string;
  studentAvailability: StudentAvailabilitySlot[];
  tutorId?: string;
  tutorName?: string;
  tutorEmail?: string;
  scheduledAt?: string;
  zoomJoinUrl?: string;
}

// ============================================================================
// Tutor Types
// ============================================================================

export interface TutorSchedule {
  tutorId: string;
  tutorName: string;
  tutorEmail: string;
  avatar?: string;
  color: string;
  schedule: Record<string, TimeSlot[]>; // date -> slots mapping
  availability: AvailabilitySlot[];
}

export interface TutorInfo {
  tutorId: string;
  tutorName: string;
  tutorEmail: string;
}

// ============================================================================
// Change Tracking Types
// ============================================================================

export type ChangeType = 'assignment';

export interface PendingChange {
  id: string;
  type: ChangeType;
  interviewId: string;
  tutorId: string;
  tutorName: string;
  date: string;
  time: string;
  studentName: string;
  studentEmail: string;
}

// ============================================================================
// Context Types
// ============================================================================

export interface TutorCalendarContextType {
  // State
  tutors: TutorSchedule[];
  unassignedInterviews: UnassignedInterview[];
  selectedDate: Date;
  selectedTutor: TutorInfo | null;
  isAvailabilityModalOpen: boolean;
  isInterviewDetailsModalOpen: boolean;
  selectedInterviewDetails: InterviewDetails | null;
  loading: boolean;
  error: string | null;
  pendingChanges: PendingChange[];
  hasPendingChanges: boolean;
  currentUserId: string | null;
  userRole: 'admin' | 'manager' | 'tutor' | null;

  // Actions
  setSelectedDate: (date: Date) => void;
  assignInterview: (tutorId: string, date: string, time: string, interviewId: string) => Promise<void>;
  createInterview: (data: { booking_id: string; student_id: string; university: string; scheduled_at: string; notes?: string }) => Promise<void>;
  cancelInterview: (interviewId: string) => Promise<void>;
  deleteInterview: (interviewId: string) => Promise<void>;
  markSlotsAvailable: (slots: { tutorId: string; date: string; time: string }[]) => Promise<void>;
  removeAvailability: (slots: { tutorId: string; slotId: string }[]) => Promise<void>;
  openAvailabilityModal: (tutorId?: string) => void;
  closeAvailabilityModal: () => void;
  openInterviewDetailsModal: (interviewId: string) => Promise<void>;
  closeInterviewDetailsModal: () => void;
  saveAvailability: (tutorId: string, availability: AvailabilitySlot[]) => Promise<void>;
  refreshData: () => Promise<void>;
  commitChanges: () => Promise<void>;
  discardChanges: () => void;
  setCurrentUserId: (userId: string | null) => void;
  setUserRole: (role: 'admin' | 'manager' | 'tutor' | null) => void;
}

// ============================================================================
// Component Props Types
// ============================================================================

export interface TutorCalendarProps {
  onSlotClick: (slot: TimeSlot, tutor: TutorSchedule) => void;
  isAdmin?: boolean;
}

export interface UnassignedInterviewsProps {
  onInterviewClick: (interview: UnassignedInterview) => void;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface BackendTutorData {
  id: string;
  name: string;
  email: string;
  availability?: BackendAvailabilitySlot[];
}

export interface BackendAvailabilitySlot {
  id: string;
  date: string;
  hour_start: number;
  hour_end: number;
  type: string;
  interview?: {
    id: string;
    booking: {
      id: string;
      email: string;
      package: string;
    };
  };
}

export interface BackendInterviewData {
  id: string;
  student_id?: string;
  booking_id?: string;
  tutor_id?: string;
  university_id?: string;
  university?: string; // Can be string name from interviews table
  notes?: string;
  created_at?: string;
  updated_at?: string;
  scheduled_at?: string;
  zoom_join_url?: string;
  zoom_meeting_id?: string;
  completed?: boolean;
  student_feedback?: string;
  tutor?: {
    id: string;
    name: string;
    email: string;
    subjects?: string[];
  };
  booking?: {
    id: string;
    email: string;
    package: string;
    universities?: string;
    preferred_time?: string;
    field?: string;
    phone?: string;
    notes?: string;
    created_at?: string;
  };
}

// ============================================================================
// Utility Types
// ============================================================================

export type DateString = string; // Format: YYYY-MM-DD
export type TimeString = string; // Format: HH:MM
export type ISODateTimeString = string; // Format: ISO 8601

// Filter options for unassigned interviews
export interface InterviewFilters {
  searchQuery: string;
  packageFilter: string;
}

// Drag and drop data transfer types
export interface DragData {
  interviewId: string;
  studentAvailability?: StudentAvailabilitySlot[];
}
