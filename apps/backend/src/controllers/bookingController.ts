import { Request, Response } from 'express';
import { stripeService } from '../services/stripeService';
import supabaseService from '../services/supabaseService';
import { AppError, ApiResponse } from '@nextgenmedprep/common-types';
import { z } from 'zod';

// Validation schemas
const careerConsultationSchema = z.object({
  email: z.string().email('Valid email is required'),
  name: z.string().min(1, 'Name is required'),
  preferredDate: z.string().optional(),
  message: z.string().optional(),
});

const eventBookingSchema = z.object({
  email: z.string().email('Valid email is required'),
  name: z.string().min(1, 'Name is required'),
  numberOfTickets: z.number().int().positive().default(1),
  ticketPrice: z.number().positive('Ticket price must be positive'),
  eventId: z.string().optional(),
  eventName: z.string().optional(),
});

export class BookingController {
  /**
   * Create a career consultation booking
   */
  async createCareerConsultation(req: Request, res: Response): Promise<void> {
    try {
      console.log('=== Career Consultation Booking Started ===');
      console.log('Request body:', req.body);

      // Validate request data
      const validatedData = careerConsultationSchema.parse(req.body);
      console.log('Validated data:', validatedData);

      // Create Stripe payment session
      console.log('Creating Stripe payment session...');
      const paymentResponse = await stripeService.createCheckoutPayment({
        amount: 30, // £30 for 30-minute career consultation
        currency: 'GBP',
        description: `30-Minute Career Consultation`,
        customer_email: validatedData.email,
        customer_name: validatedData.name,
        metadata: {
          type: 'career_consultation',
          preferred_date: validatedData.preferredDate || '',
          message: validatedData.message || ''
        }
      });
      console.log('Stripe payment session created:', {
        checkout_url: paymentResponse.checkout_url,
        session_id: paymentResponse.session_id
      });

      const response: ApiResponse = {
        success: true,
        data: {
          checkout_url: paymentResponse.checkout_url,
          session_id: paymentResponse.session_id
        },
        message: 'Career consultation booking initiated'
      };

      console.log('=== Career Consultation Booking Initiated Successfully ===');
      res.json(response);
    } catch (error: any) {
      console.error('=== Career Consultation Booking Error ===');
      console.error('Error details:', error);
      console.error('Error stack:', error.stack);
      
      if (error instanceof z.ZodError) {
        console.error('Validation error details:', error.errors);
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors
        });
        return;
      }
      
      if (error instanceof AppError) {
        console.error('App error:', error.message, 'Status:', error.statusCode);
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
   * Create an event booking
   */
  async createEventBooking(req: Request, res: Response): Promise<void> {
    try {
      console.log('=== Event Booking Started ===');
      console.log('Request body:', req.body);

      // Validate request data
      const validatedData = eventBookingSchema.parse(req.body);
      console.log('Validated data:', validatedData);

      // Calculate total amount based on number of tickets and price from request
      const totalAmount = validatedData.ticketPrice * validatedData.numberOfTickets;

      // Create Stripe payment session
      console.log('Creating Stripe payment session...');
      const eventName = validatedData.eventName || 'Medical Conference';
      const paymentResponse = await stripeService.createCheckoutPayment({
        amount: totalAmount,
        currency: 'GBP',
        description: `Event Ticket - ${eventName} (${validatedData.numberOfTickets} ${validatedData.numberOfTickets > 1 ? 'tickets' : 'ticket'})`,
        customer_email: validatedData.email,
        customer_name: validatedData.name,
        metadata: {
          type: 'event_booking',
          event_id: validatedData.eventId || '',
          event_name: eventName,
          number_of_tickets: validatedData.numberOfTickets.toString(),
          price_per_ticket: validatedData.ticketPrice.toString()
        }
      });
      console.log('Stripe payment session created:', {
        checkout_url: paymentResponse.checkout_url,
        session_id: paymentResponse.session_id
      });

      const response: ApiResponse = {
        success: true,
        data: {
          checkout_url: paymentResponse.checkout_url,
          session_id: paymentResponse.session_id
        },
        message: 'Event booking initiated'
      };

      console.log('=== Event Booking Initiated Successfully ===');
      res.json(response);
    } catch (error: any) {
      console.error('=== Event Booking Error ===');
      console.error('Error details:', error);
      console.error('Error stack:', error.stack);
      
      if (error instanceof z.ZodError) {
        console.error('Validation error details:', error.errors);
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors
        });
        return;
      }
      
      if (error instanceof AppError) {
        console.error('App error:', error.message, 'Status:', error.statusCode);
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
   * Get booking by ID
   */
  async getBookingById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = z.object({ id: z.string().uuid() }).parse(req.params);

      const booking = await supabaseService.getBookingById(id);
      
      if (!booking) {
        throw new AppError('Booking not found', 404);
      }

      const response: ApiResponse = {
        success: true,
        data: booking
      };

      res.json(response);
    } catch (error: any) {
      console.error('Get booking error:', error);
      
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: 'Invalid ID parameter'
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
   * Get bookings by user ID
   */
  async getUserBookings(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = z.object({ userId: z.string().uuid() }).parse(req.params);

      const bookings = await supabaseService.getUserBookings(userId);

      const response: ApiResponse = {
        success: true,
        data: bookings
      };

      res.json(response);
    } catch (error: any) {
      console.error('Get user bookings error:', error);
      
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: 'Invalid user ID parameter'
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
   * Get bookings by email
   */
  async getBookingsByEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email } = z.object({ email: z.string().email() }).parse(req.params);

      // Get bookings by email (not currently supported in supabaseService, but would need to be added)
      // For now, we'll get the user by email and then get their bookings
      const user = await supabaseService.getUserByEmail(email);
      
      if (!user) {
        // Return empty array if user not found
        const response: ApiResponse = {
          success: true,
          data: []
        };
        res.json(response);
        return;
      }

      const bookings = await supabaseService.getUserBookings(user.id);

      const response: ApiResponse = {
        success: true,
        data: bookings
      };

      res.json(response);
    } catch (error: any) {
      console.error('Get bookings by email error:', error);
      
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: 'Invalid email parameter'
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
   * Update booking
   */
  async updateBooking(req: Request, res: Response): Promise<void> {
    try {
      const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
      
      const updateSchema = z.object({
        start_time: z.string().datetime().optional(),
        end_time: z.string().datetime().optional(),
        status: z.enum(['confirmed', 'cancelled', 'completed', 'no_show']).optional(),
        payment_status: z.enum(['pending', 'paid', 'failed', 'refunded']).optional(),
        tutor_id: z.string().uuid().optional(),
        preferred_time: z.string().optional(),
        reschedule_requested: z.boolean().optional(),
        rescheduled_time: z.string().datetime().optional(),
        feedback: z.string().optional(),
        rating: z.number().min(1).max(5).optional(),
      });

      const updates = updateSchema.parse(req.body);

      // If updating status to completed, set complete flag
      if (updates.status === 'completed') {
        (updates as any).complete = true;
      }

      const booking = await supabaseService.updateBooking(id, updates);

      const response: ApiResponse = {
        success: true,
        data: booking,
        message: 'Booking updated successfully'
      };

      res.json(response);
    } catch (error: any) {
      console.error('Update booking error:', error);
      
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
}

export const bookingController = new BookingController();