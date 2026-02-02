import { Request, Response } from 'express';
import { stripeService } from '../services/stripeService';
import supabaseService from '../services/supabaseService';
import emailService from '../services/emailService';
import fileUploadService from '../services/fileUploadService';
import zoomService from '../services/zoomService';
import { AppError, ApiResponse } from '@nextgenmedprep/common-types';
import { z } from 'zod';

// Validation schema for interview booking
const interviewBookingSchema = z.object({
  email: z.string().email('Valid email is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  field: z.enum(['medicine', 'dentistry'], {
    required_error: 'Field (medicine or dentistry) is required'
  }),
  phone: z.string().optional(),
  packageType: z.enum(['essentials', 'core', 'premium'], {
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
  interviewDates: z.array(z.object({
    universityId: z.string(),
    date: z.string(),
    timeSlot: z.string()
  })).optional().or(z.string().transform((val) => {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  })),
  availability: z.union([
    z.string(),
    z.array(z.object({
      date: z.string(),
      timeSlot: z.string()
    }))
  ]).optional(),
  notes: z.string().optional(),
  amount: z.number().positive('Amount must be positive').or(z.string().transform((val) => parseFloat(val))),
  preferredDate: z.string().optional(),
});

export class InterviewBookingController {
  /**
   * Condense availability array to compact string format (max 500 chars)
   * Format: date1|startHour-endHour;date2|startHour-endHour;...
   */
  private condenseAvailability(availability: Array<{ date: string; timeSlot: string }>): string {
    if (!availability || availability.length === 0) return '';
    
    return availability.map(slot => {
      // Parse timeSlot format "HH:mm - HH:mm" to extract hours
      const [startTime, endTime] = slot.timeSlot.split(' - ');
      const hourStart = startTime.split(':')[0].padStart(2, '0');
      const hourEnd = endTime.split(':')[0].padStart(2, '0');
      
      // Format: YYYY-MM-DD|HH-HH
      return `${slot.date}|${hourStart}-${hourEnd}`;
    }).join(';').substring(0, 500); // Ensure max 500 chars
  }

  /**
   * Parse condensed availability string back to array format
   * Format: date1|startHour-endHour;date2|startHour-endHour;...
   */
  private parseCondensedAvailability(condensed: string): Array<{ date: string; timeSlot: string }> {
    if (!condensed || condensed.trim() === '') return [];
    
    try {
      return condensed.split(';').map(entry => {
        const [date, hours] = entry.split('|');
        const [hourStart, hourEnd] = hours.split('-');
        
        return {
          date: date,
          timeSlot: `${hourStart}:00 - ${hourEnd}:00`
        };
      });
    } catch (error) {
      console.error('Error parsing condensed availability:', error);
      return [];
    }
  }

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
      console.log('Availability type:', typeof validatedData.availability);
      console.log('Availability value:', validatedData.availability);

      // Upload personal statement to Supabase storage if provided
      let filePath: string | null = null;
      if (req.file) {
        console.log('Uploading personal statement...');
        filePath = await fileUploadService.uploadPersonalStatement(
          req.file,
          validatedData.email
        );
        console.log('Personal statement uploaded:', filePath);
      } else {
        console.log('No personal statement file provided - proceeding without it');
      }

      // Ensure universities is an array
      const universitiesArray = Array.isArray(validatedData.universities) 
        ? validatedData.universities 
        : [validatedData.universities];

      // Create full name from first and last name
      const fullName = `${validatedData.firstName} ${validatedData.lastName}`;

      // Create Stripe payment session
      console.log('Creating Stripe payment session...');
      const packageLabel = validatedData.packageType === 'essentials' ? 'Essentials (Single Session)' : 
                          validatedData.packageType === 'core' ? 'Core Interview Preparation' : 
                          'Premium Interview Intensive';
      const serviceLabel = validatedData.serviceType === 'generated' ? 'AI-Generated Mock Questions' : 'Live Tutor Session';
      
      // Create package identifier for Supabase: packageType_serviceType
      const packageIdentifier = `${validatedData.packageType}_${validatedData.serviceType}`;
      
      const paymentResponse = await stripeService.createCheckoutPayment({
        amount: validatedData.amount,
        currency: 'GBP',
        description: `Interview Preparation - ${packageLabel} (${serviceLabel})`,
        customer_email: validatedData.email,
        customer_name: fullName,
        metadata: {
          type: 'interview_booking',
          package_type: validatedData.packageType,
          service_type: validatedData.serviceType,
          package_identifier: packageIdentifier,
          universities: universitiesArray.join(','),
          interview_dates: validatedData.interviewDates ? JSON.stringify(validatedData.interviewDates) : '',
          availability: (() => {
            // If it's already a string (condensed format), use it directly
            if (typeof validatedData.availability === 'string') {
              console.log('Using availability string directly:', validatedData.availability);
              return validatedData.availability;
            }
            // If it's an array, condense it
            if (Array.isArray(validatedData.availability)) {
              const condensed = this.condenseAvailability(validatedData.availability);
              console.log('Condensed availability array:', condensed);
              return condensed;
            }
            // Otherwise empty
            return '';
          })(),
          file_path: filePath || '',
          first_name: validatedData.firstName,
          last_name: validatedData.lastName,
          field: validatedData.field,
          phone: validatedData.phone || '',
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
      interview_dates?: string;
      availability?: string;
      file_path: string;
      first_name: string;
      last_name: string;
      field: string;
      phone?: string;
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

      // Get or create user using first and last name from metadata
      const fullName = `${metadata.first_name} ${metadata.last_name}`;
      let user = await supabaseService.getUserByEmail(customerEmail);
      if (!user) {
        console.log('Creating new user...');
        user = await supabaseService.createUser({
          email: customerEmail,
          full_name: fullName,
          role: 'student',
          phone_number: metadata.phone || undefined
        });
        console.log('New user created:', user.id);
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
        field: metadata.field as 'medicine' | 'dentistry',
        phone: metadata.phone || undefined,
      });

      console.log('Booking created:', booking);

      // Parse and create student availability if provided
      if (metadata.availability && metadata.availability !== '') {
        try {
          // Parse condensed availability format: date1|HH-HH;date2|HH-HH;...
          const availabilitySlots = this.parseCondensedAvailability(metadata.availability);
          console.log('Parsed availability slots:', availabilitySlots);
          
          if (availabilitySlots.length > 0) {
            const availabilityRecords = availabilitySlots.map((slot: { date: string; timeSlot: string }) => {
              // Parse timeSlot format "HH:mm - HH:mm" to extract hours
              const [startTime, endTime] = slot.timeSlot.split(' - ');
              const hourStart = parseInt(startTime.split(':')[0]);
              const hourEnd = parseInt(endTime.split(':')[0]);
              
              return {
                student_id: user.id,
                date: slot.date,
                hour_start: hourStart,
                hour_end: hourEnd,
                type: 'interview' as const
              };
            });
            
            await supabaseService.createBulkStudentAvailability(availabilityRecords);
            console.log('Student availability records created');
          }
        } catch (error) {
          console.error('Error creating student availability:', error);
          // Continue even if availability creation fails
        }
      }

      // Only create interview records for live sessions, not for generated questions
      if (metadata.service_type === 'live') {
        // Determine number of interviews based on package type
        let numberOfInterviews = 1; // default for essentials
        if (metadata.package_type === 'core') {
          numberOfInterviews = 3;
        } else if (metadata.package_type === 'premium') {
          numberOfInterviews = 4; // Premium has 4 live sessions
        }

        // Create interview records
        console.log(`Creating ${numberOfInterviews} interview records for live sessions...`);
        const interviewRecords = [];
        
        for (let i = 0; i < numberOfInterviews; i++) {
          interviewRecords.push({
            student_id: user.id,
            booking_id: booking.id,
            university: universitiesArray[i] || undefined, // Assign university if available, undefined if not
            notes: metadata.notes || undefined,
            field: metadata.field || undefined
          });
        }

        const createdInterviews = await supabaseService.createBulkInterviews(interviewRecords);
        console.log(`${numberOfInterviews} interview records created for live sessions`);
      } else {
        console.log('Service type is "generated" - skipping interview record creation');
      }

      // Note: Zoom meetings will be created when interviews are scheduled with specific times
      // via the assignInterviewToTutor method in interviewController.ts

      // Send confirmation email to customer
      console.log('Sending confirmation email to customer...');
      await emailService.sendInterviewBookingConfirmationEmail(
        customerEmail,
        {
          bookingId: booking.id,
          userName: fullName,
          packageType: metadata.package_type,
          serviceType: metadata.service_type,
          universities: universitiesArray,
          amount: amount,
          preferredDate: metadata.preferred_date,
          notes: metadata.notes,
          studentId: user.id, // Include student ID for dashboard link
        }
      );

      // Generate signed URL for personal statement download (if provided)
      let downloadUrl: string | undefined;
      if (metadata.file_path) {
        console.log('Generating signed URL for personal statement...');
        try {
          downloadUrl = await supabaseService.getPersonalStatementSignedUrl(metadata.file_path);
          console.log('Generated download URL:', downloadUrl);
        } catch (error) {
          console.error('Error generating signed URL:', error);
          // Continue without download URL - admin can still access via dashboard
        }
      } else {
        console.log('No personal statement provided - skipping download URL generation');
      }

      // Send notification email to admin
      console.log('Sending notification email to admin...');
      
      // Parse condensed availability format for email
      let availabilitySlots: Array<{ date: string; timeSlot: string }> | undefined;
      if (metadata.availability && metadata.availability !== '') {
        try {
          // Use the parseCondensedAvailability method to convert back to array format
          availabilitySlots = this.parseCondensedAvailability(metadata.availability);
        } catch (error) {
          console.error('Error parsing availability for email:', error);
        }
      }
      
      await emailService.sendInterviewBookingNotificationEmail({
        bookingId: booking.id,
        customerEmail: customerEmail,
        customerName: fullName,
        packageType: metadata.package_type,
        serviceType: metadata.service_type,
        universities: universitiesArray,
        amount: amount,
        field: metadata.field as 'medicine' | 'dentistry',
        filePath: metadata.file_path,
        downloadUrl: downloadUrl,
        notes: metadata.notes,
        preferredDate: metadata.preferred_date,
        availability: availabilitySlots,
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
