import { Request, Response } from 'express';
import { fondyService } from '../services/fondyService';
import { CreatePaymentRequest, FondyCallbackData, AppError } from '../types';
import { z } from 'zod';

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

const orderIdSchema = z.object({
  order_id: z.string().min(1)
});

export class PaymentController {
  /**
   * Create a one-time payment
   */
  async createPayment(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = createPaymentSchema.parse(req.body);
      
      const paymentResponse = await fondyService.createCheckoutPayment(validatedData);
      
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
      
      const paymentResponse = await fondyService.createSubscription(validatedData);
      
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
      const { order_id } = orderIdSchema.parse(req.params);
      
      const status = await fondyService.getPaymentStatus(order_id);
      
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
      const { order_id } = orderIdSchema.parse(req.params);
      const amount = req.body.amount ? parseFloat(req.body.amount) : undefined;
      
      const refundResponse = await fondyService.refundPayment(order_id, amount);
      
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
   * Handle Fondy callback
   */
  async handleCallback(req: Request, res: Response): Promise<void> {
    try {
      const callbackData: FondyCallbackData = req.body;
      
      const result = await fondyService.processCallback(callbackData);
      
      // Fondy expects a simple \"OK\" response for successful callbacks
      res.status(200).send('OK');
    } catch (error: any) {
      console.error('Handle callback error:', error);
      
      // Even on error, we should return OK to prevent Fondy from retrying
      // But log the error for investigation
      res.status(200).send('OK');
    }
  }

  /**
   * Get transaction list for an order
   */
  async getTransactionList(req: Request, res: Response): Promise<void> {
    try {
      const { order_id } = orderIdSchema.parse(req.params);
      
      const transactions = await fondyService.getTransactionList(order_id);
      
      res.json({
        success: true,
        data: transactions
      });
    } catch (error: any) {
      console.error('Get transaction list error:', error);
      
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
      const { order_id } = orderIdSchema.parse(req.params);
      const amount = req.body.amount ? parseFloat(req.body.amount) : undefined;
      
      const captureResponse = await fondyService.capturePayment(order_id, amount);
      
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
   * Get payment reports
   */
  async getReports(req: Request, res: Response): Promise<void> {
    try {
      const { date_from, date_to } = req.query;
      
      if (!date_from || !date_to) {
        res.status(400).json({
          success: false,
          error: 'date_from and date_to query parameters are required'
        });
        return;
      }
      
      const dateFrom = new Date(date_from as string);
      const dateTo = new Date(date_to as string);
      
      if (isNaN(dateFrom.getTime()) || isNaN(dateTo.getTime())) {
        res.status(400).json({
          success: false,
          error: 'Invalid date format'
        });
        return;
      }
      
      const reports = await fondyService.getReports(dateFrom, dateTo);
      
      res.json({
        success: true,
        data: reports
      });
    } catch (error: any) {
      console.error('Get reports error:', error);
      
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