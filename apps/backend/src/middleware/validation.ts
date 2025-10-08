import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '@nextgenmedprep/common-types';

// Validation schemas
export const subscriptionSchema = z.object({
  email: z.string().email('Invalid email format'),
  subscription_tier: z.enum(['free', 'newsletter_only', 'premium_basic', 'premium_plus']).optional().default('free'),
  opt_in_newsletter: z.boolean().optional().default(true),
});

export const updateSubscriptionSchema = z.object({
  subscription_tier: z.enum(['free', 'newsletter_only', 'premium_basic', 'premium_plus']).optional(),
  opt_in_newsletter: z.boolean().optional(),
  stripe_subscription_status: z.enum(['active', 'canceled', 'past_due', 'trialing', 'incomplete', 'incomplete_expired', 'unpaid']).optional(),
});

export const emailSchema = z.object({
  email: z.string().email('Invalid email format'),
});

export const paginationSchema = z.object({
  page: z.string().transform((val) => parseInt(val)).refine((val) => val > 0, 'Page must be greater than 0').optional(),
  limit: z.string().transform((val) => parseInt(val)).refine((val) => val > 0 && val <= 100, 'Limit must be between 1 and 100').optional(),
});

export const subscriptionFiltersSchema = z.object({
  subscription_tier: z.enum(['free', 'newsletter_only', 'premium_basic', 'premium_plus']).optional(),
  opt_in_newsletter: z.string().transform((val) => val === 'true').optional(),
  stripe_subscription_status: z.enum(['active', 'canceled', 'past_due', 'trialing', 'incomplete', 'incomplete_expired', 'unpaid']).optional(),
});

// Resource validation schemas
export const resourceIdSchema = z.object({
  resourceId: z.string().min(1, 'Resource ID is required'),
});

export const resourceDownloadParamsSchema = z.object({
  email: z.string().email('Invalid email format'),
  resourceId: z.string().min(1, 'Resource ID is required'),
});

export const createResourceSchema = z.object({
  id: z.string().min(1, 'Resource ID is required'),
  name: z.string().min(1, 'Resource name is required'),
  description: z.string().optional(),
  file_path: z.string().min(1, 'File path is required'),
  allowed_tiers: z.array(z.enum(['free', 'newsletter_only', 'premium_basic', 'premium_plus'])).min(1, 'At least one tier must be allowed'),
});

export const updateResourceSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  file_path: z.string().min(1).optional(),
  allowed_tiers: z.array(z.enum(['free', 'newsletter_only', 'premium_basic', 'premium_plus'])).min(1).optional(),
  is_active: z.boolean().optional(),
});

// New Joiners validation schemas
const tutoringSubjectEnum = z.enum([
  'UCAT',
  'A-Level Biology',
  'A-Level Chemistry',
  'A-Level Maths',
  'GCSE - Various',
  'Interview Prep',
  'Personal Statement Review'
]);

const availabilitySlotEnum = z.enum([
  'Weekdays',
  'Evenings',
  'Weekends',
  'Flexible'
]);

const ucatScoresSchema = z.object({
  verbal_reasoning: z.number().min(0).max(1000).optional(),
  decision_making: z.number().min(0).max(1000).optional(),
  quantitative_reasoning: z.number().min(0).max(1000).optional(),
  abstract_reasoning: z.number().min(0).max(1000).optional(),
  situational_judgement: z.number().min(0).max(1000).optional(),
  overall_score: z.number().min(0).max(4000).optional(),
  year_taken: z.string().optional(),
});

const bmatScoresSchema = z.object({
  section1_score: z.number().min(0).max(10).optional(),
  section2_score: z.number().min(0).max(10).optional(),
  section3_score: z.number().min(0).max(10).optional(),
  overall_score: z.number().min(0).max(30).optional(),
  year_taken: z.string().optional(),
});

const medDentGradesSchema = z.object({
  interview_scores: z.record(z.any()).optional(),
  admissions_test_scores: z.record(z.any()).optional(),
  other_achievements: z.array(z.string()).optional(),
});

export const newJoinerSchema = z.object({
  // Basic Info
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  phone_number: z.string().optional(),
  
  // Academic Background
  alevel_subjects_grades: z.string().min(10, 'A-Level subjects and grades information is required'),
  university_year: z.string().min(1, 'University year is required'),
  med_dent_grades: medDentGradesSchema,
  
  // Admissions Test Scores
  ucat: ucatScoresSchema.refine((data) => Object.keys(data).length > 0, {
    message: "UCAT scores information is required"
  }),
  bmat: bmatScoresSchema.optional(),
  
  // Offers
  med_school_offers: z.string().min(10, 'Medical school offers information is required'),
  
  // Tutoring Preferences
  subjects_can_tutor: z.array(tutoringSubjectEnum).min(1, 'At least one tutoring subject must be selected'),
  exam_boards: z.string().optional(),
  
  // Experience & Motivation
  tutoring_experience: z.string().min(20, 'Please provide detailed tutoring experience (minimum 20 characters)'),
  why_tutor: z.string().min(50, 'Please provide detailed motivation for tutoring (minimum 50 characters)'),
  
  // Availability
  availability: z.array(availabilitySlotEnum).min(1, 'At least one availability slot must be selected'),
  
  // Documents (cv_url will be set after file upload)
  cv_url: z.string().optional(),
});

export const updateNewJoinerSchema = z.object({
  full_name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone_number: z.string().optional(),
  alevel_subjects_grades: z.string().min(10).optional(),
  university_year: z.string().min(1).optional(),
  med_dent_grades: medDentGradesSchema.optional(),
  ucat: ucatScoresSchema.optional(),
  bmat: bmatScoresSchema.optional(),
  med_school_offers: z.string().min(10).optional(),
  subjects_can_tutor: z.array(tutoringSubjectEnum).min(1).optional(),
  exam_boards: z.string().optional(),
  tutoring_experience: z.string().min(10).optional(),
  why_tutor: z.string().min(20).optional(),
  availability: z.array(availabilitySlotEnum).min(1).optional(),
  cv_url: z.string().optional(),
});

export const newJoinerFiltersSchema = z.object({
  subjects_can_tutor: tutoringSubjectEnum.optional(),
  availability: availabilitySlotEnum.optional(),
  university_year: z.string().optional(),
});

// Validation middleware factory
export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.body);
      
      if (!result.success) {
        const errors = result.error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        throw new AppError(`Validation failed: ${errors.map(e => e.message).join(', ')}`, 400);
      }
      
      req.body = result.data;
      next();
    } catch (error) {
      next(error);
    }
  };
};

// Query parameter validation middleware
export const validateQuery = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.query);
      
      if (!result.success) {
        const errors = result.error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        throw new AppError(`Query validation failed: ${errors.map(e => e.message).join(', ')}`, 400);
      }
      
      req.query = result.data as any;
      next();
    } catch (error) {
      next(error);
    }
  };
};

// Parameter validation middleware
export const validateParams = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.params);
      
      if (!result.success) {
        const errors = result.error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        throw new AppError(`Parameter validation failed: ${errors.map(e => e.message).join(', ')}`, 400);
      }
      
      req.params = result.data;
      next();
    } catch (error) {
      next(error);
    }
  };
};

// Specific validation middleware for new joiners
export const validateNewJoiner = validate(newJoinerSchema);
export const validateUpdateNewJoiner = validate(updateNewJoinerSchema);
export const validateNewJoinerFilters = validateQuery(newJoinerFiltersSchema);
