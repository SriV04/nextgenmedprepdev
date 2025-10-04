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
  fondy_subscription_status: z.enum(['active', 'canceled', 'past_due', 'trialing', 'incomplete', 'incomplete_expired', 'unpaid']).optional(),
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
