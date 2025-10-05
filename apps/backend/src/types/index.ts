// Types for the NextGen MedPrep backend

export interface User {
  id: string;
  email: string;
  full_name?: string;
  role: 'student' | 'tutor' | 'admin';
  email_verified_at?: string;
  fondy_customer_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  email: string;
  user_id?: string;
  subscription_tier: 'free' | 'newsletter_only' | 'premium_basic' | 'premium_plus';
  opt_in_newsletter: boolean;
  fondy_subscription_id?: string;
  fondy_subscription_status?: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete' | 'incomplete_expired' | 'unpaid';
  current_period_starts_at?: string;
  current_period_ends_at?: string;
  canceled_at?: string;
  subscribed_at: string;
  unsubscribed_at?: string | null;
  updated_at: string;
}

export interface CreateSubscriptionRequest {
  email: string;
  subscription_tier?: 'free' | 'newsletter_only' | 'premium_basic' | 'premium_plus';
  opt_in_newsletter?: boolean;
}

export interface UpdateSubscriptionRequest {
  subscription_tier?: 'free' | 'newsletter_only' | 'premium_basic' | 'premium_plus';
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
  fondy_subscription_status?: string;
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

// Fondy Payment Types
export interface FondyPaymentRequest {
  order_id: string;
  order_desc: string;
  currency: string;
  amount: string; // Amount in cents
  response_url?: string;
  server_callback_url?: string;
  sender_email?: string;
  product_id?: string;
  merchant_data?: string;
  lifetime?: number;
  preauth?: 'Y' | 'N';
  delayed?: 'Y' | 'N';
  lang?: 'uk' | 'ru' | 'en';
  recurring_data?: {
    every: number;
    period: 'day' | 'week' | 'month' | 'year';
    amount: number;
    start_time: string;
    state: 'y' | 'n';
    readonly: 'y' | 'n';
  };
}

export interface FondyPaymentResponse {
  response_status: 'success' | 'failure';
  checkout_url?: string;
  payment_id?: string;
  order_id?: string;
  error_message?: string;
  error_code?: number;
}

export interface FondyCallbackData {
  order_id: string;
  merchant_id: string;
  amount: string;
  currency: string;
  order_status: 'approved' | 'declined' | 'processing' | 'expired' | 'reversed';
  response_status: 'success' | 'failure';
  signature: string;
  tran_type: 'purchase' | 'reverse';
  sender_email?: string;
  payment_system?: string;
  masked_card?: string;
  card_bin?: string;
  card_type?: string;
  approval_code?: string;
  response_code?: string;
  response_description?: string;
  reversal_amount?: string;
  settlement_amount?: string;
  settlement_currency?: string;
  settlement_date?: string;
  eci?: string;
  fee?: string;
  actual_amount?: string;
  actual_currency?: string;
  merchant_data?: string;
  verification_status?: string;
  rectoken?: string;
  rectoken_lifetime?: string;
}

export interface CreatePaymentRequest {
  amount: number;
  currency: string;
  description: string;
  customer_email?: string;
  product_id?: string;
  return_url?: string;
}

export interface PaymentStatus {
  order_id: string;
  status: 'approved' | 'declined' | 'processing' | 'expired' | 'reversed';
  amount: string;
  currency: string;
  payment_system?: string;
  masked_card?: string;
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
