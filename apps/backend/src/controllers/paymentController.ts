import { Request, Response } from 'express';
import { stripeService } from '../services/stripeService';
import { CreatePaymentRequest, AppError, StripeWebhookEvent } from '../types';
import { z } from 'zod';
import Stripe from 'stripe';

// Validation schemas
const createPaymentSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().length(3),
  description: z.string().min(1),
  customer_email: z.string().email().optional(),
  product_id: z.string().optional(),
  return_url: z.string().url().optional()
});

const createSubscriptionSchema = createPaymentSchema.extend({
  recurring: z.object({
    every: z.number().positive(),
    period: z.enum(['day', 'week', 'month', 'year']),
    start_time: z.string().optional()
  })
});

// Removed orderIdSchema as we now use specific validation for each endpoint

export class PaymentController {
  /**
   * Create a one-time payment
   */
  async createPayment(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = createPaymentSchema.parse(req.body);
      
      const paymentResponse = await stripeService.createCheckoutPayment(validatedData);
      
      res.json({
        success: true,
        data: paymentResponse
      });
    } catch (error: any) {
      console.error('Create payment error:', error);
      
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors
        });
        return;
      }
      
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Create a subscription payment
   */
  async createSubscription(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = createSubscriptionSchema.parse(req.body);
      
      const paymentResponse = await stripeService.createSubscription(validatedData);
      
      res.json({
        success: true,
        data: paymentResponse
      });
    } catch (error: any) {
      console.error('Create subscription error:', error);
      
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors
        });
        return;
      }
      
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(req: Request, res: Response): Promise<void> {
    try {
      const { session_id } = z.object({ session_id: z.string().min(1) }).parse(req.params);
      
      const status = await stripeService.getPaymentStatus(session_id);
      
      res.json({
        success: true,
        data: status
      });
    } catch (error: any) {
      console.error('Get payment status error:', error);
      
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: 'Invalid order ID'
        });
        return;
      }
      
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Refund a payment
   */
  async refundPayment(req: Request, res: Response): Promise<void> {
    try {
      const { payment_intent_id } = z.object({ payment_intent_id: z.string().min(1) }).parse(req.params);
      const amount = req.body.amount ? parseFloat(req.body.amount) : undefined;
      
      const refundResponse = await stripeService.refundPayment(payment_intent_id, amount);
      
      res.json({
        success: true,
        data: refundResponse
      });
    } catch (error: any) {
      console.error('Refund payment error:', error);
      
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Handle Stripe webhook
   */
  async handleWebhook(req: Request, res: Response): Promise<void> {
    try {
      const signature = req.headers['stripe-signature'] as string;
      
      if (!signature) {
        res.status(400).json({ error: 'Missing stripe-signature header' });
        return;
      }

      const event = stripeService.verifyWebhookSignature(req.body, signature);
      const result = await stripeService.processWebhook(event);
      
      res.status(200).json({ received: true });
    } catch (error: any) {
      console.error('Handle webhook error:', error);
      
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
        return;
      }
      
      res.status(400).json({ error: 'Webhook handler failed' });
    }
  }

  /**
   * Get subscription details
   */
  async getSubscription(req: Request, res: Response): Promise<void> {
    try {
      const { subscription_id } = z.object({ subscription_id: z.string().min(1) }).parse(req.params);
      
      const subscription = await stripeService.getSubscription(subscription_id);
      
      res.json({
        success: true,
        data: subscription
      });
    } catch (error: any) {
      console.error('Get subscription error:', error);
      
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Capture pre-authorized payment
   */
  async capturePayment(req: Request, res: Response): Promise<void> {
    try {
      const { payment_intent_id } = z.object({ payment_intent_id: z.string().min(1) }).parse(req.params);
      const amount = req.body.amount ? parseFloat(req.body.amount) : undefined;
      
      const captureResponse = await stripeService.capturePayment(payment_intent_id, amount);
      
      res.json({
        success: true,
        data: captureResponse
      });
    } catch (error: any) {
      console.error('Capture payment error:', error);
      
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(req: Request, res: Response): Promise<void> {
    try {
      const { subscription_id } = z.object({ subscription_id: z.string().min(1) }).parse(req.params);
      
      const subscription = await stripeService.cancelSubscription(subscription_id);
      
      res.json({
        success: true,
        data: subscription
      });
    } catch (error: any) {
      console.error('Cancel subscription error:', error);
      
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
}

export const paymentController = new PaymentController();