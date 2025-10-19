import { Request, Response } from 'express';
import { stripeService } from '../services/stripeService';
import supabaseService from '../services/supabaseService';
import emailService from '../services/emailService';
import fileUploadService from '../services/fileUploadService';
import { AppError, ApiResponse } from '@nextgenmedprep/common-types';
import { z } from 'zod';

// Validation schema for interview booking
const interviewBookingSchema = z.object({
  email: z.string().email('Valid email is required'),
  name: z.string().min(1, 'Name is required'),
  packageType: z.enum(['single', 'package'], {
    required_error: 'Package type is required'
  }),
  serviceType: z.enum(['generated', 'live'], {
    required_error: 'Service type is required'
  }),
  universities: z.array(z.string()).min(1, 'At least one university must be selected').or(z.string().transform((val) => {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return [val];
    }
  })),
  notes: z.string().optional(),
  amount: z.number().positive('Amount must be positive').or(z.string().transform((val) => parseFloat(val))),
  preferredDate: z.string().optional(),
});

export class InterviewBookingController {
  /**
   * Create an interview booking with personal statement upload
   */
  async createInterviewBooking(req: Request, res: Response): Promise<void> {
    try {
      console.log('=== Interview Booking Started ===');
      console.log('Request body:', req.body);
      console.log('Request file:', req.file);

      // Validate request data
      const validatedData = interviewBookingSchema.parse(req.body);
      console.log('Validated data:', validatedData);

      // Check if personal statement file is uploaded
      if (!req.file) {
        console.error('No file uploaded in request');
        throw new AppError('Personal statement file is required', 400);
      }

      // Upload personal statement to Supabase storage
      console.log('Uploading personal statement...');
      const filePath = await fileUploadService.uploadPersonalStatement(
        req.file,
        validatedData.email
      );
      console.log('Personal statement uploaded:', filePath);

      // Ensure universities is an array
      const universitiesArray = Array.isArray(validatedData.universities) 
        ? validatedData.universities 
        : [validatedData.universities];

      // Create Stripe payment session
      console.log('Creating Stripe payment session...');
      const packageLabel = validatedData.packageType === 'single' ? 'Single Session' : 'Package Deal';
      const serviceLabel = validatedData.serviceType === 'generated' ? 'AI-Generated Mock Questions' : 'Live Tutor Session';
      
      const paymentResponse = await stripeService.createCheckoutPayment({
        amount: validatedData.amount,
        currency: 'GBP',
        description: `Interview Preparation - ${packageLabel} (${serviceLabel})`,
        customer_email: validatedData.email,
        customer_name: validatedData.name,
        metadata: {
          type: 'interview_booking',
          package_type: validatedData.packageType,
          service_type: validatedData.serviceType,
          universities: universitiesArray.join(','),
          file_path: filePath,
          notes: validatedData.notes || '',
          preferred_date: validatedData.preferredDate || ''
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
          session_id: paymentResponse.session_id,
          file_path: filePath
        },
        message: 'Interview booking initiated. Please complete payment to confirm.'
      };

      console.log('=== Interview Booking Initiated Successfully ===');
      res.json(response);
    } catch (error: any) {
      console.error('=== Interview Booking Error ===');
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
   * Handle successful payment and create booking record
   * This is called after Stripe payment is completed
   */
  async confirmInterviewBooking(
    sessionId: string,
    metadata: {
      type: string;
      package_type: string;
      service_type: string;
      universities: string;
      file_path: string;
      notes?: string;
      preferred_date?: string;
    },
    customerEmail: string,
    customerName: string,
    amount: number
  ): Promise<any> {
    try {
      console.log('=== Confirming Interview Booking ===');
      console.log('Session ID:', sessionId);
      console.log('Metadata:', metadata);
      console.log('Customer:', customerEmail, customerName);
      console.log('Amount:', amount);

      // Get or create user
      let user = await supabaseService.getUserByEmail(customerEmail);
      if (!user) {
        console.log('Creating new user...');
        user = await supabaseService.createUser({
          email: customerEmail,
          full_name: customerName,
          role: 'student'
        });
      }

      // Create booking record
      console.log('Creating booking record...');
      const universitiesArray = metadata.universities.split(',').filter(u => u.trim());
      
      const booking = await supabaseService.createBooking({
        user_id: user.id,
        email: customerEmail,
        package: `${metadata.package_type}_${metadata.service_type}`,
        amount: amount,
        payment_status: 'paid',
        preferred_time: metadata.preferred_date || undefined,
        file_path: metadata.file_path,
        notes: metadata.notes || '',
        universities: universitiesArray.join(', '),
      });

      console.log('Booking created:', booking);

      // Send confirmation email to customer
      console.log('Sending confirmation email to customer...');
      await emailService.sendInterviewBookingConfirmationEmail(
        customerEmail,
        {
          bookingId: booking.id,
          userName: customerName,
          packageType: metadata.package_type,
          serviceType: metadata.service_type,
          universities: universitiesArray,
          amount: amount,
          preferredDate: metadata.preferred_date,
          notes: metadata.notes,
        }
      );

      // Generate signed URL for personal statement download
      console.log('Generating signed URL for personal statement...');
      let downloadUrl: string | undefined;
      try {
        downloadUrl = await supabaseService.getPersonalStatementSignedUrl(metadata.file_path);
        console.log('Generated download URL:', downloadUrl);
      } catch (error) {
        console.error('Error generating signed URL:', error);
        // Continue without download URL - admin can still access via dashboard
      }

      // Send notification email to admin
      console.log('Sending notification email to admin...');
      await emailService.sendInterviewBookingNotificationEmail({
        bookingId: booking.id,
        customerEmail: customerEmail,
        customerName: customerName,
        packageType: metadata.package_type,
        serviceType: metadata.service_type,
        universities: universitiesArray,
        amount: amount,
        filePath: metadata.file_path,
        downloadUrl: downloadUrl,
        notes: metadata.notes,
        preferredDate: metadata.preferred_date,
      });

      console.log('=== Interview Booking Confirmed Successfully ===');
      return booking;
    } catch (error) {
      console.error('Error confirming interview booking:', error);
      throw error;
    }
  }

  /**
   * Get interview booking by ID
   */
  async getInterviewBookingById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = z.object({ id: z.string().uuid() }).parse(req.params);

      const booking = await supabaseService.getBookingById(id);
      
      if (!booking) {
        throw new AppError('Interview booking not found', 404);
      }

      const response: ApiResponse = {
        success: true,
        data: booking
      };

      res.json(response);
    } catch (error: any) {
      console.error('Get interview booking error:', error);
      
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
   * Get interview bookings by email
   */
  async getInterviewBookingsByEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email } = z.object({ email: z.string().email() }).parse(req.params);

      const user = await supabaseService.getUserByEmail(email);
      
      if (!user) {
        const response: ApiResponse = {
          success: true,
          data: []
        };
        res.json(response);
        return;
      }

      const bookings = await supabaseService.getUserBookings(user.id);
      
      // Filter for interview bookings only
      const interviewBookings = bookings.filter(booking => 
        booking.package && 
        (booking.package.includes('single') || booking.package.includes('package')) &&
        booking.file_path // Interview bookings have personal statements
      );

      const response: ApiResponse = {
        success: true,
        data: interviewBookings
      };

      res.json(response);
    } catch (error: any) {
      console.error('Get interview bookings by email error:', error);
      
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
   * Update interview booking
   */
  async updateInterviewBooking(req: Request, res: Response): Promise<void> {
    try {
      const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
      
      const updateSchema = z.object({
        tutor_id: z.string().uuid().optional(),
        start_time: z.string().datetime().optional(),
        end_time: z.string().datetime().optional(),
        status: z.enum(['confirmed', 'cancelled', 'completed', 'no_show']).optional(),
        notes: z.string().optional(),
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
        message: 'Interview booking updated successfully'
      };

      res.json(response);
    } catch (error: any) {
      console.error('Update interview booking error:', error);
      
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
   * Download personal statement for an interview booking
   */
  async downloadPersonalStatement(req: Request, res: Response): Promise<void> {
    try {
      const { id } = z.object({ id: z.string().uuid() }).parse(req.params);

      const booking = await supabaseService.getBookingById(id);
      
      if (!booking) {
        throw new AppError('Interview booking not found', 404);
      }

      if (!booking.file_path) {
        throw new AppError('No personal statement file associated with this booking', 404);
      }

      // Generate a signed URL for the personal statement
      const signedUrl = await fileUploadService.getPersonalStatementSignedUrl(
        booking.file_path,
        3600 // 1 hour expiry
      );

      const response: ApiResponse = {
        success: true,
        data: {
          download_url: signedUrl,
          file_path: booking.file_path
        }
      };

      res.json(response);
    } catch (error: any) {
      console.error('Download personal statement error:', error);
      
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: 'Invalid booking ID'
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

export const interviewBookingController = new InterviewBookingController();
