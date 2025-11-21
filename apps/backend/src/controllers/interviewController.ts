import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { createSupabaseClient } from '../../supabase/config';

// Validation schemas
const createInterviewSchema = z.object({
  university_id: z.string().uuid().optional(),
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
      .order('created_at', { ascending: true });

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

    res.json({
      success: true,
      data: {
        ...interview,
        tutor,
        booking,
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

    // Update interview with tutor and scheduled time
    const { data: interview, error: interviewError } = await supabase
      .from('interviews')
      .update({
        tutor_id: validatedData.tutor_id,
        scheduled_at: validatedData.scheduled_at,
        updated_at: new Date().toISOString(),
      })
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

    // Get interview to check if it has an availability slot
    const { data: interview } = await supabase
      .from('interviews')
      .select('id')
      .eq('id', id)
      .single();

    if (!interview) {
      res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
      return;
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

    // Send confirmation emails
    const emailService = require('../services/emailService').default;
    await emailService.sendInterviewConfirmationEmail(
      tutor.email,
      tutor_name,
      student_email,
      student_name,
      scheduled_at,
      id
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
