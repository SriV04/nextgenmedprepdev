import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { createSupabaseClient } from '../../supabase/config';
import zoomService from '../services/zoomService';
import emailService from '../services/emailService';

// Validation schemas
const createInterviewSchema = z.object({
  university: z.string().nonempty(),
  student_id: z.string().uuid().optional(),
  tutor_id: z.string().uuid().optional(),
  booking_id: z.string().uuid().optional(),
  scheduled_at: z.string().datetime(),
  notes: z.string().optional(),
});

const updateInterviewSchema = z.object({
  university_id: z.string().uuid().optional(),
  student_id: z.string().uuid().optional(),
  tutor_id: z.string().uuid().optional(),
  booking_id: z.string().uuid().optional(),
  scheduled_at: z.string().datetime().optional(),
  completed: z.boolean().optional(),
  student_feedback: z.string().optional(),
  notes: z.string().optional(),
});

const assignInterviewSchema = z.object({
  tutor_id: z.string().uuid(),
  scheduled_at: z.string().datetime(),
  availability_slot_id: z.string().uuid().optional(),
});

/**
 * Create a new interview
 */
export const createInterview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = createInterviewSchema.parse(req.body);
    const supabase = createSupabaseClient();

    const { data: interview, error } = await supabase
      .from('interviews')
      .insert(validatedData)
      .select()
      .single();

    if (error) {
      console.error('Error creating interview:', error);
      throw new Error(error.message);
    }

    console.log('Created new interview:', interview.id);

    res.status(201).json({
      success: true,
      message: 'Interview created successfully',
      data: interview,
    });
  } catch (error: any) {
    console.error('Error in createInterview:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      });
      return;
    }
    next(error);
  }
};

/**
 * Get all interviews with optional filters
 */
export const getAllInterviews = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { tutor_id, student_id, booking_id, unassigned, completed } = req.query;
    const supabase = createSupabaseClient();

    let query = supabase
      .from('interviews')
      .select(`
        *,
        tutor:tutors!interviews_tutor_id_fkey(id, name, email),
        booking:bookings(id, email, package, universities, field, phone)
      `)
      .order('scheduled_at', { ascending: true });

    // Filter by tutor
    if (tutor_id) {
      query = query.eq('tutor_id', tutor_id as string);
    }

    // Filter by student
    if (student_id) {
      query = query.eq('student_id', student_id as string);
    }

    // Filter by booking
    if (booking_id) {
      query = query.eq('booking_id', booking_id as string);
    }

    // Filter unassigned (no tutor)
    if (unassigned === 'true') {
      query = query.is('tutor_id', null);
    }

    // Filter completed status
    if (completed !== undefined) {
      query = query.eq('completed', completed === 'true');
    }

    const { data: interviews, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    res.json({
      success: true,
      data: interviews || [],
    });
  } catch (error: any) {
    console.error('Error in getAllInterviews:', error);
    next(error);
  }
};

/**
 * Get unassigned interviews
 */
export const getUnassignedInterviews = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const supabase = createSupabaseClient();

    const cutoffDate = new Date('2025-11-29T00:00:00Z').toISOString();

    const { data: interviews, error } = await supabase
      .from('interviews')
      .select(`
      *,
      booking:bookings(
        id,
        email,
        package,
        universities,
        field,
        preferred_time,
        created_at
      )
      `)
      .is('tutor_id', null)
      .eq('completed', false)
      .gt('updated_at', cutoffDate)
      .order('updated_at', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    res.json({
      success: true,
      data: interviews || [],
    });
  } catch (error: any) {
    console.error('Error in getUnassignedInterviews:', error);
    next(error);
  }
};

/**
 * Get interview by ID
 */
export const getInterview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const supabase = createSupabaseClient();

    // Fetch interview
    const { data: interview, error } = await supabase
      .from('interviews')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !interview) {
      console.error('Error fetching interview:', error);
      res.status(404).json({
        success: false,
        message: 'Interview not found',
        error: error?.message,
      });
      return;
    }

    // Fetch related tutor if exists
    let tutor = null;
    if (interview.tutor_id) {
      const { data: tutorData } = await supabase
        .from('tutors')
        .select('id, name, email, subjects')
        .eq('id', interview.tutor_id)
        .single();
      tutor = tutorData;
    }

    // Fetch related booking if exists
    let booking = null;
    if (interview.booking_id) {
      const { data: bookingData } = await supabase
        .from('bookings')
        .select('id, email, package, universities, field, phone, preferred_time, notes')
        .eq('id', interview.booking_id)
        .single();
      booking = bookingData;
    }

    // Fetch related university if exists
    let university = null;
    if (interview.university_id) {
      const { data: universityData } = await supabase
        .from('universities')
        .select('id, name')
        .eq('id', interview.university_id)
        .single();
      university = universityData;
    }

    res.json({
      success: true,
      data: {
        ...interview,
        tutor,
        booking,
        university,
      },
    });
  } catch (error: any) {
    console.error('Error in getInterview:', error);
    next(error);
  }
};

/**
 * Update interview
 */
export const updateInterview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const validatedData = updateInterviewSchema.parse(req.body);
    const supabase = createSupabaseClient();

    const { data: interview, error } = await supabase
      .from('interviews')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    res.json({
      success: true,
      message: 'Interview updated successfully',
      data: interview,
    });
  } catch (error: any) {
    console.error('Error in updateInterview:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      });
      return;
    }
    next(error);
  }
};

/**
 * Assign interview to tutor
 */
export const assignInterviewToTutor = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const validatedData = assignInterviewSchema.parse(req.body);
    const supabase = createSupabaseClient();

    // If availability slot ID provided, verify it's available first
    if (validatedData.availability_slot_id) {
      const { data: slot, error: slotCheckError } = await supabase
        .from('tutor_availability')
        .select('id, type, tutor_id, interview_id')
        .eq('id', validatedData.availability_slot_id)
        .single();

      if (slotCheckError || !slot) {
        res.status(404).json({
          success: false,
          message: 'Availability slot not found',
        });
        return;
      }

      // Check if slot belongs to the correct tutor
      if (slot.tutor_id !== validatedData.tutor_id) {
        res.status(400).json({
          success: false,
          message: 'Availability slot does not belong to this tutor',
        });
        return;
      }

      // Check if slot is available
      if (slot.type !== 'available') {
        res.status(400).json({
          success: false,
          message: `Time slot is not available. Current status: ${slot.type}`,
        });
        return;
      }

      // Check if slot already has an interview
      if (slot.interview_id) {
        res.status(400).json({
          success: false,
          message: 'Time slot is already booked for another interview',
        });
        return;
      }
    }

    // Get interview details including booking info
    const { data: existingInterview } = await supabase
      .from('interviews')
      .select(`
        *,
        booking:bookings(
          id,
          email,
          universities
        )
      `)
      .eq('id', id)
      .single();

    // Create Zoom meeting if Zoom is configured
    let zoomMeetingId: string | undefined;
    let zoomJoinUrl: string | undefined;
    let zoomStartUrl: string | undefined;
    let zoomHostEmail: string | undefined;

    if (zoomService.isConfigured()) {
      try {
        console.log('Creating Zoom meeting for interview...');
        const scheduledDate = new Date(validatedData.scheduled_at);
        
        // Get student name from booking
        const studentName = existingInterview?.booking?.email?.split('@')[0] || 'Student';
        const universityName = existingInterview?.university || existingInterview?.booking?.universities?.split(',')[0] || undefined;

        const zoomMeeting = await zoomService.createInterviewMeeting({
          studentName,
          universityName,
          startTime: scheduledDate,
          duration: 60, // Default 60 minutes
        });

        zoomMeetingId = zoomMeeting.meetingId;
        zoomJoinUrl = zoomMeeting.joinUrl;
        zoomStartUrl = zoomMeeting.startUrl;
        zoomHostEmail = zoomMeeting.hostEmail;

        console.log('Zoom meeting created:', {
          meetingId: zoomMeetingId,
          joinUrl: zoomJoinUrl,
          hostEmail: zoomHostEmail,
        });
      } catch (error) {
        console.error('Failed to create Zoom meeting:', error);
        // Continue without Zoom meeting - it can be created manually
      }
    } else {
      console.warn('Zoom is not configured - skipping Zoom meeting creation');
    }

    // Update interview with tutor, scheduled time, and Zoom details
    const updateData: any = {
      tutor_id: validatedData.tutor_id,
      scheduled_at: validatedData.scheduled_at,
      updated_at: new Date().toISOString(),
    };

    if (zoomMeetingId) {
      updateData.zoom_meeting_id = zoomMeetingId;
      updateData.zoom_join_url = zoomJoinUrl;
      updateData.zoom_host_email = zoomHostEmail;
    }

    const { data: interview, error: interviewError } = await supabase
      .from('interviews')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (interviewError) {
      throw new Error(interviewError.message);
    }

    // Update the availability slot to mark it as an interview
    if (validatedData.availability_slot_id) {
      const { error: slotError } = await supabase
        .from('tutor_availability')
        .update({
          type: 'interview',
          interview_id: id,
        })
        .eq('id', validatedData.availability_slot_id);

      if (slotError) {
        console.error('Error updating availability slot:', slotError);
        // Rollback interview assignment if slot update fails
        await supabase
          .from('interviews')
          .update({
            tutor_id: null,
            scheduled_at: validatedData.scheduled_at,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id);
        
        throw new Error('Failed to update availability slot');
      }

      console.log(`Updated availability slot ${validatedData.availability_slot_id} to interview type`);
    }

    res.json({
      success: true,
      message: 'Interview assigned successfully',
      data: interview,
    });
  } catch (error: any) {
    console.error('Error in assignInterviewToTutor:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      });
      return;
    }
    next(error);
  }
};

/**
 * Mark interview as completed
 */
export const completeInterview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { student_feedback, notes } = req.body;
    const supabase = createSupabaseClient();

    const updateData: any = {
      completed: true,
      updated_at: new Date().toISOString(),
    };

    if (student_feedback) {
      updateData.student_feedback = student_feedback;
    }

    if (notes) {
      updateData.notes = notes;
    }

    const { data: interview, error } = await supabase
      .from('interviews')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    res.json({
      success: true,
      message: 'Interview marked as completed',
      data: interview,
    });
  } catch (error: any) {
    console.error('Error in completeInterview:', error);
    next(error);
  }
};

/**
 * Cancel/Unassign interview (keeps interview record but removes assignment)
 */
export const cancelInterview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { cancellation_notes } = req.body;
    const supabase = createSupabaseClient();

    // Get interview with full details including tutor and booking info
    const { data: interview } = await supabase
      .from('interviews')
      .select(`
        id,
        zoom_meeting_id,
        tutor_id,
        scheduled_at,
        university,
        tutor:tutors!interviews_tutor_id_fkey(id, name, email),
        booking:bookings(id, email, universities)
      `)
      .eq('id', id)
      .single();

    if (!interview) {
      res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
      return;
    }

    // Extract data for email notifications
    const tutorData = interview.tutor as any;
    const bookingData = interview.booking as any;
    
    const tutorEmail = tutorData?.email;
    const tutorName = tutorData?.name;
    const studentEmail = Array.isArray(bookingData) && bookingData.length > 0 
      ? bookingData[0].email 
      : bookingData?.email;
    const universities = interview.university || 
      (Array.isArray(bookingData) && bookingData.length > 0 
        ? bookingData[0].universities?.split(',')[0] 
        : bookingData?.universities?.split(',')[0]) || 
      'Not specified';
    
    // Get student name from email (basic extraction)
    const studentName = studentEmail?.split('@')[0] || 'Student';

    // Delete Zoom meeting if exists
    if (interview.zoom_meeting_id && zoomService.isConfigured()) {
      try {
        await zoomService.deleteMeeting(interview.zoom_meeting_id);
        console.log('Deleted Zoom meeting:', interview.zoom_meeting_id);
      } catch (error) {
        console.error('Failed to delete Zoom meeting:', error);
        // Continue with cancellation even if Zoom deletion fails
      }
    }

    // Clear the availability slot if exists
    await supabase
      .from('tutor_availability')
      .update({
        type: 'available',
        interview_id: null,
      })
      .eq('interview_id', id);

    // Unassign interview - clear tutor_id, scheduled_at, and Zoom details
    const { error } = await supabase
      .from('interviews')
      .update({
        tutor_id: null,
        scheduled_at: null,
        zoom_meeting_id: null,
        zoom_join_url: null,
        zoom_host_email: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    // Send cancellation emails if student email exists
    if (studentEmail) {
      try {
        await emailService.sendInterviewCancellationEmail(
          tutorEmail,
          tutorName,
          studentEmail,
          studentName,
          interview.scheduled_at,
          universities,
          cancellation_notes
        );
        console.log('Sent cancellation emails successfully');
      } catch (emailError) {
        console.error('Failed to send cancellation emails:', emailError);
        // Don't fail the cancellation if email fails
      }
    } else {
      console.warn('No student email found, skipping cancellation email');
    }

    res.json({
      success: true,
      message: 'Interview cancelled and unassigned successfully',
    });
  } catch (error: any) {
    console.error('Error in cancelInterview:', error);
    next(error);
  }
};

/**
 * Delete interview
 */
export const deleteInterview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const supabase = createSupabaseClient();

    // Get interview to check if it has an availability slot and Zoom meeting
    const { data: interview } = await supabase
      .from('interviews')
      .select('id, zoom_meeting_id')
      .eq('id', id)
      .single();

    if (!interview) {
      res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
      return;
    }

    // Delete Zoom meeting if exists
    if (interview.zoom_meeting_id && zoomService.isConfigured()) {
      try {
        await zoomService.deleteMeeting(interview.zoom_meeting_id);
        console.log('Deleted Zoom meeting:', interview.zoom_meeting_id);
      } catch (error) {
        console.error('Failed to delete Zoom meeting:', error);
        // Continue with interview deletion even if Zoom deletion fails
      }
    }

    // Clear the availability slot if exists
    await supabase
      .from('tutor_availability')
      .update({
        type: 'available',
        interview_id: null,
      })
      .eq('interview_id', id);

    // Delete interview
    const { error } = await supabase
      .from('interviews')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    res.json({
      success: true,
      message: 'Interview deleted successfully',
    });
  } catch (error: any) {
    console.error('Error in deleteInterview:', error);
    next(error);
  }
};

/**
 * Confirm interview and send confirmation emails
 */
export const confirmInterview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { tutor_id, tutor_name, scheduled_at, student_email, student_name } = req.body;

    // Validate required fields
    if (!tutor_id || !tutor_name || !scheduled_at || !student_email || !student_name) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: tutor_id, tutor_name, scheduled_at, student_email, student_name',
      });
      return;
    }

    const supabase = createSupabaseClient();

    // Get tutor email
    const { data: tutor, error: tutorError } = await supabase
      .from('tutors')
      .select('email')
      .eq('id', tutor_id)
      .single();

    if (tutorError || !tutor) {
      res.status(404).json({
        success: false,
        message: 'Tutor not found',
      });
      return;
    }

    // Get interview to check if Zoom meeting exists and get booking details
    const { data: interview } = await supabase
      .from('interviews')
      .select(`
        zoom_meeting_id, 
        zoom_join_url, 
        zoom_host_email,
        booking:bookings(universities)
      `)
      .eq('id', id)
      .single();

    // If no Zoom meeting exists, create one
    let zoomJoinUrl = interview?.zoom_join_url;
    let zoomHostEmail = interview?.zoom_host_email;
    
    if (!zoomJoinUrl && zoomService.isConfigured()) {
      try {
        console.log('Creating Zoom meeting for confirmation...');
        const scheduledDate = new Date(scheduled_at);
        
        const zoomMeeting = await zoomService.createInterviewMeeting({
          studentName: student_name,
          tutorName: tutor_name,
          startTime: scheduledDate,
          duration: 60,
        });

        // Update interview with Zoom details
        await supabase
          .from('interviews')
          .update({
            zoom_meeting_id: zoomMeeting.meetingId,
            zoom_join_url: zoomMeeting.joinUrl,
            zoom_host_email: zoomMeeting.hostEmail,
          })
          .eq('id', id);

        zoomJoinUrl = zoomMeeting.joinUrl;
        zoomHostEmail = zoomMeeting.hostEmail;
        console.log('✅ Zoom meeting created and stored:', {
          meetingId: zoomMeeting.meetingId,
          joinUrl: zoomMeeting.joinUrl,
          hostEmail: zoomMeeting.hostEmail
        });
      } catch (error) {
        console.error('❌ Failed to create Zoom meeting:', error);
        console.error('Error details:', error instanceof Error ? error.message : error);
        // Don't send email if Zoom creation fails - throw error instead
        res.status(500).json({
          success: false,
          message: 'Failed to create Zoom meeting. Please try again or contact support.',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
      }
    }

    if (!zoomJoinUrl) {
      console.error('❌ No Zoom link available - interview may not have been properly assigned');
      res.status(400).json({
        success: false,
        message: 'Interview does not have a Zoom link. Please assign the interview first.',
      });
      return;
    }

    // Get university information
    const bookingData = interview?.booking as any;
    const universities = Array.isArray(bookingData) && bookingData.length > 0 
      ? bookingData[0].universities 
      : bookingData?.universities || 'Not specified';

    // Send confirmation emails
    await emailService.sendInterviewConfirmationEmail(
      tutor.email,
      tutor_name,
      student_email,
      student_name,
      scheduled_at,
      id,
      zoomJoinUrl,
      zoomHostEmail || 'Not specified',
      universities
    );

    res.json({
      success: true,
      message: 'Confirmation emails sent successfully',
      data: {
        interview_id: id,
        tutor_email: tutor.email,
        student_email,
      },
    });
  } catch (error: any) {
    console.error('Error in confirmInterview:', error);
    next(error);
  }
};
