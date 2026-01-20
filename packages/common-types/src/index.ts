// Types for the NextGen MedPrep backend

export interface User {
  id: string;
  email: string;
  full_name?: string;
  role: 'student' | 'tutor' | 'admin';
  email_verified_at?: string;
  stripe_customer_id?: string;
  created_at: string;
  updated_at: string;
  phone_number?: string;
}

export interface Subscription {
  email: string;
  user_id?: string;
  subscription_tier: 'free' | 'medical_free' | 'dentist_free';
  opt_in_newsletter: boolean;
  stripe_subscription_id?: string;
  stripe_subscription_status?: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete' | 'incomplete_expired' | 'unpaid';
  current_period_starts_at?: string;
  current_period_ends_at?: string;
  canceled_at?: string;
  subscribed_at: string;
  unsubscribed_at?: string | null;
  updated_at: string;
}

export interface Resource {
  id: string;
  name: string;
  description?: string;
  file_path: string;
  allowed_tiers: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ResourceDownload {
  id: string;
  email: string;
  resource_id: string;
  download_source?: string;
  downloaded_at: string;
}

export interface CreateSubscriptionRequest {
  email: string;
  subscription_tier?: 'free' | 'medical_free' | 'dentist_free';
  opt_in_newsletter?: boolean;
}

export interface UpdateSubscriptionRequest {
  subscription_tier?: 'free' | 'medical_free' | 'dentist_free';
  opt_in_newsletter?: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SubscriptionFilters {
  subscription_tier?: string;
  opt_in_newsletter?: boolean;
  stripe_subscription_status?: string;
}

// Error types
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export interface StripeWebhookEvent {
  type: string;
  data: {
    object: any;
  };
}

// New Joiners Types
export type TutoringSubject = 
  | 'UCAT'
  | 'A-Level Biology'
  | 'A-Level Chemistry'
  | 'A-Level Maths'
  | 'GCSE - Various'
  | 'Interview Prep'
  | 'Personal Statement Review';

export type AvailabilitySlot = 
  | 'Weekdays'
  | 'Evenings'
  | 'Weekends'
  | 'Flexible';

export interface UCATScores {
  verbal_reasoning?: number;
  decision_making?: number;
  quantitative_reasoning?: number;
  abstract_reasoning?: number;
  situational_judgement?: number;
  overall_score?: number;
  year_taken?: string;
}

export interface BMATScores {
  section1_score?: number;
  section2_score?: number;
  section3_score?: number;
  overall_score?: number;
  year_taken?: string;
}

export interface MedDentGrades {
  interview_scores?: Record<string, any>;
  admissions_test_scores?: Record<string, any>;
  other_achievements?: string[];
}

export interface NewJoiner {
  id: string;
  created_at: string;
  
  // Basic Info
  full_name: string;
  email: string;
  phone_number?: string;
  
  // Academic Background
  alevel_subjects_grades: string;
  university_year: string;
  med_dent_grades: MedDentGrades;
  
  // Admissions Test Scores
  ucat: UCATScores;
  bmat?: BMATScores;
  
  // Offers
  med_school_offers: string;
  
  // Tutoring Preferences
  subjects_can_tutor: TutoringSubject[];
  exam_boards?: string;
  
  // Experience & Motivation
  tutoring_experience: string;
  why_tutor: string;
  
  // Availability
  availability: AvailabilitySlot[];
  
  // Documents
  cv_url?: string;
}

export interface CreateNewJoinerRequest {
  // Basic Info
  full_name: string;
  email: string;
  phone_number?: string;
  
  // Academic Background
  alevel_subjects_grades: string;
  university_year: string;
  med_dent_grades: MedDentGrades;
  
  // Admissions Test Scores
  ucat: UCATScores;
  bmat?: BMATScores;
  
  // Offers
  med_school_offers: string;
  
  // Tutoring Preferences
  subjects_can_tutor: TutoringSubject[];
  exam_boards?: string;
  
  // Experience & Motivation
  tutoring_experience: string;
  why_tutor: string;
  
  // Availability
  availability: AvailabilitySlot[];
  
  // Documents
  cv_url?: string;
}

export interface UpdateNewJoinerRequest {
  // All fields optional for updates
  full_name?: string;
  email?: string;
  phone_number?: string;
  alevel_subjects_grades?: string;
  university_year?: string;
  med_dent_grades?: MedDentGrades;
  ucat?: UCATScores;
  bmat?: BMATScores;
  med_school_offers?: string;
  subjects_can_tutor?: TutoringSubject[];
  exam_boards?: string;
  tutoring_experience?: string;
  why_tutor?: string;
  availability?: AvailabilitySlot[];
  cv_url?: string;
}

// Booking Types
export interface Booking {
  id: string;
  user_id: string;
  tutor_id?: string;
  start_time: string;
  status: 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  created_at: string;
  updated_at: string;
  package?: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  amount?: number;
  complete?: boolean;
  preferred_time?: string;
  reschedule_requested?: boolean;
  rescheduled_time?: string;
  feedback?: string;
  rating?: number;
  email?: string;
  file_path?: string;
  notes?: string;
  universities?: string;
  field?: 'medicine' | 'dentistry';
  phone?: string;
}

export interface CreateBookingRequest {
  user_id: string;
  tutor_id?: string;
  start_time?: string;
  package?: string;
  amount?: number;
  preferred_time?: string;
  email?: string;
  payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
  file_path?: string;
  notes?: string;
  universities?: string;
  field?: 'medicine' | 'dentistry';
  phone?: string;
}

export interface UpdateBookingRequest {
  tutor_id?: string;
  start_time?: string;
  status?: 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
  amount?: number;
  complete?: boolean;
  preferred_time?: string;
  reschedule_requested?: boolean;
  rescheduled_time?: string;
  feedback?: string;
  rating?: number;
}

// Personal Statement Types
export interface PersonalStatement {
  id: string;
  created_at: string;
  updated_at: string;
  email: string;
  personal_statement_file_path: string;
  notes?: string;
  reviewed: boolean;
  reviewed_at?: string;
  reviewer_email?: string;
  version: number;
  status: 'pending' | 'in_review' | 'complete';
  feedback_url?: string;
  feedback_file_path?: string;
}

export interface CreatePersonalStatementRequest {
  email: string;
  personal_statement_file_path: string;
  notes?: string;
}

export interface UpdatePersonalStatementRequest {
  notes?: string;
  reviewed?: boolean;
  reviewed_at?: string;
  reviewer_email?: string;
  status?: 'pending' | 'in_review' | 'complete';
  feedback_url?: string;
  feedback_file_path?: string;
}

// Payment Types
export interface CreatePaymentRequest {
  amount: number;
  currency: string;
  description: string;
  customer_email?: string;
  customer_name?: string;
  product_id?: string;
  return_url?: string;
  metadata?: {
    [key: string]: string;
  };
}

export interface PaymentStatus {
  order_id: string;
  status: 'approved' | 'declined' | 'processing' | 'expired' | 'reversed';
  amount: string;
  currency: string;
  payment_system?: string;
  masked_card?: string;
}
