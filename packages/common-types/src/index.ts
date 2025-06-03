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
