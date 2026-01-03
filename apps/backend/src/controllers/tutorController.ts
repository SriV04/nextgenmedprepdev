import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { createSupabaseClient } from '../../supabase/config';

// Validation schemas
const createTutorSchema = z.object({
  user_id: z.string().uuid(),
  name: z.string().min(2),
  email: z.string().email(),
  subjects: z.array(z.string()).min(1).optional().default(['General']),
  role: z.string().optional().default('tutor'),
});

const updateTutorSchema = z.object({
  name: z.string().min(2).optional(),
  subjects: z.array(z.string()).min(1).optional(),
  role: z.string().optional(),
});

const addAvailabilitySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  hour_start: z.number().int().min(0).max(23),
  hour_end: z.number().int().min(1).max(24),
  type: z.enum(['available', 'interview', 'blocked']).optional().default('available'),
  interview_id: z.string().uuid().optional(),
});

const bulkAvailabilitySchema = z.object({
  slots: z.array(z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    hour_start: z.number().int().min(0).max(23),
    hour_end: z.number().int().min(1).max(24),
    type: z.enum(['available', 'interview', 'blocked']).optional().default('available'),
  }))
});

/**
 * Create a new tutor account
 * Called after successful authentication
 */
export const createTutor = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = createTutorSchema.parse(req.body);
    const supabase = createSupabaseClient();

    // Check if tutor already exists
    const { data: existing } = await supabase
      .from('tutors')
      .select('id, email')
      .eq('email', validatedData.email)
      .single();

    if (existing) {
      res.json({
        success: true,
        message: 'Tutor already exists',
        data: existing,
      });
      return;
    }

    // Create new tutor
    const { data: tutor, error } = await supabase
      .from('tutors')
      .insert({
        id: validatedData.user_id, // Use the auth user ID
        name: validatedData.name,
        email: validatedData.email,
        subjects: validatedData.subjects,
        role: validatedData.role, // Defaults to 'tutor' from schema
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating tutor:', error);
      throw new Error(error.message);
    }

    console.log('Created new tutor:', tutor.id);

    res.status(201).json({
      success: true,
      message: 'Tutor created successfully',
      data: tutor,
    });
  } catch (error: any) {
    console.error('Error in createTutor:', error);
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
 * Get tutor by ID or email
 */
export const getTutor = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id, email } = req.query;
    const supabase = createSupabaseClient();

    let query = supabase.from('tutors').select('*');

    if (id) {
      query = query.eq('id', id as string);
    } else if (email) {
      query = query.eq('email', email as string);
    } else {
      res.status(400).json({
        success: false,
        message: 'Either id or email must be provided',
      });
      return;
    }

    const { data: tutor, error } = await query.single();

    if (error || !tutor) {
      res.status(404).json({
        success: false,
        message: 'Tutor not found',
      });
      return;
    }

    res.json({
      success: true,
      data: tutor,
    });
  } catch (error: any) {
    console.error('Error in getTutor:', error);
    next(error);
  }
};

/**
 * Get all tutors
 */
export const getAllTutors = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const supabase = createSupabaseClient();

    const { data: tutors, error } = await supabase
      .from('tutors')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    res.json({
      success: true,
      data: tutors || [],
    });
  } catch (error: any) {
    console.error('Error in getAllTutors:', error);
    next(error);
  }
};

/**
 * Update tutor information
 */
export const updateTutor = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const validatedData = updateTutorSchema.parse(req.body);
    const supabase = createSupabaseClient();

    const { data: tutor, error } = await supabase
      .from('tutors')
      .update(validatedData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    res.json({
      success: true,
      message: 'Tutor updated successfully',
      data: tutor,
    });
  } catch (error: any) {
    console.error('Error in updateTutor:', error);
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
 * Add availability slots for a tutor
 */
export const addAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { tutorId } = req.params;
    const validatedData = addAvailabilitySchema.parse(req.body);
    const supabase = createSupabaseClient();

    // Verify tutor exists
    const { data: tutor } = await supabase
      .from('tutors')
      .select('id')
      .eq('id', tutorId)
      .single();

    if (!tutor) {
      res.status(404).json({
        success: false,
        message: 'Tutor not found',
      });
      return;
    }

    // Check for overlapping availability
    const { data: existing } = await supabase
      .from('tutor_availability')
      .select('*')
      .eq('tutor_id', tutorId)
      .eq('date', validatedData.date)
      .or(
        `and(hour_start.lte.${validatedData.hour_end},hour_end.gte.${validatedData.hour_start})`
      );

    if (existing && existing.length > 0) {
      res.status(400).json({
        success: false,
        message: 'Overlapping availability already exists',
      });
      return;
    }

    // Add availability
    const { data: availability, error } = await supabase
      .from('tutor_availability')
      .insert({
        tutor_id: tutorId,
        date: validatedData.date,
        hour_start: validatedData.hour_start,
        hour_end: validatedData.hour_end,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    res.status(201).json({
      success: true,
      message: 'Availability added successfully',
      data: availability,
    });
  } catch (error: any) {
    console.error('Error in addAvailability:', error);
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
 * Get tutor availability with optional interview details
 */
export const getTutorAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { tutorId } = req.params;
    const { start_date, end_date } = req.query;
    const supabase = createSupabaseClient();

    let query = supabase
      .from('tutor_availability')
      .select(`
        *,
        interview:interviews(
          id,
          scheduled_at,
          booking:bookings(
            id,
            email,
            package,
            universities
          )
        )
      `)
      .eq('tutor_id', tutorId)
      .order('date', { ascending: true })
      .order('hour_start', { ascending: true });

    if (start_date) {
      query = query.gte('date', start_date as string);
    }

    if (end_date) {
      query = query.lte('date', end_date as string);
    }

    const { data: availability, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    res.json({
      success: true,
      data: availability || [],
    });
  } catch (error: any) {
    console.error('Error in getTutorAvailability:', error);
    next(error);
  }
};

/**
 * Get all tutors with their availability for a date range
 */
export const getAllTutorsWithAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { start_date, end_date } = req.query;
    const supabase = createSupabaseClient();

    // Get all tutors except managers (managers don't appear in calendar)
    const { data: tutors, error: tutorsError } = await supabase
      .from('tutors')
      .select('*')
      .neq('role', 'manager')
      .order('name', { ascending: true });

    if (tutorsError) {
      throw new Error(tutorsError.message);
    }

    // Get availability for all tutors
    let availQuery = supabase
      .from('tutor_availability')
      .select(`
        *,
        interview:interviews(
          id,
          scheduled_at,
          completed,
          booking:bookings(
            id,
            email,
            package,
            universities
          )
        )
      `)
      .order('date', { ascending: true })
      .order('hour_start', { ascending: true });

    if (start_date) {
      availQuery = availQuery.gte('date', start_date as string);
    }

    if (end_date) {
      availQuery = availQuery.lte('date', end_date as string);
    }

    const { data: availability, error: availError } = await availQuery;

    if (availError) {
      throw new Error(availError.message);
    }

    // Group availability by tutor
    const tutorsWithAvailability = tutors?.map(tutor => ({
      ...tutor,
      availability: availability?.filter(slot => slot.tutor_id === tutor.id) || []
    }));

    res.json({
      success: true,
      data: tutorsWithAvailability || [],
    });
  } catch (error: any) {
    console.error('Error in getAllTutorsWithAvailability:', error);
    next(error);
  }
};

/**
 * Add multiple availability slots at once
 */
export const addBulkAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { tutorId } = req.params;
    const validatedData = bulkAvailabilitySchema.parse(req.body);
    const supabase = createSupabaseClient();

    // Verify tutor exists
    const { data: tutor } = await supabase
      .from('tutors')
      .select('id')
      .eq('id', tutorId)
      .single();

    if (!tutor) {
      res.status(404).json({
        success: false,
        message: 'Tutor not found',
      });
      return;
    }

    // Prepare all slots
    const slotsToInsert = validatedData.slots.map(slot => ({
      tutor_id: tutorId,
      date: slot.date,
      hour_start: slot.hour_start,
      hour_end: slot.hour_end,
      type: slot.type || 'available',
    }));

    // Insert all slots
    const { data: availability, error } = await supabase
      .from('tutor_availability')
      .insert(slotsToInsert)
      .select();

    if (error) {
      throw new Error(error.message);
    }

    res.status(201).json({
      success: true,
      message: `Added ${availability?.length || 0} availability slots`,
      data: availability,
    });
  } catch (error: any) {
    console.error('Error in addBulkAvailability:', error);
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
 * Delete availability slot
 */
export const deleteAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { availabilityId } = req.params;
    const supabase = createSupabaseClient();

    const { error } = await supabase
      .from('tutor_availability')
      .delete()
      .eq('id', availabilityId);

    if (error) {
      throw new Error(error.message);
    }

    res.json({
      success: true,
      message: 'Availability deleted successfully',
    });
  } catch (error: any) {
    console.error('Error in deleteAvailability:', error);
    next(error);
  }
};

/**
 * Get tutor's upcoming sessions
 */
export const getTutorUpcomingSessions = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { tutorId } = req.params;
    const supabase = createSupabaseClient();

    // Get upcoming interviews for this tutor (not completed, with scheduled_at in the future)
    const { data: interviews, error } = await supabase
      .from('interviews')
      .select(`
        id,
        scheduled_at,
        completed,
        notes,
        zoom_join_url,
        zoom_host_email,
        student_id,
        booking_id,
        bookings (
          email,
          package,
          universities,
          field,
          notes
        ),
        users (
          full_name,
          email
        )
      `)
      .eq('tutor_id', tutorId)
      .eq('completed', false)
      .not('scheduled_at', 'is', null)
      .gte('scheduled_at', new Date().toISOString())
      .order('scheduled_at', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    // Transform data
    const sessions = interviews?.map((interview: any) => ({
      id: interview.id,
      scheduled_at: interview.scheduled_at,
      studentName: interview.students?.name || interview.bookings?.email?.split('@')[0] || 'Unknown',
      studentEmail: interview.students?.email || interview.bookings?.email || 'No email',
      universities: interview.bookings?.universities,
      package: interview.bookings?.package || 'Unknown package',
      zoom_join_url: interview.zoom_join_url,
      notes: interview.notes || interview.bookings?.notes,
    })) || [];

    res.json({
      success: true,
      data: sessions,
    });
  } catch (error: any) {
    console.error('Error in getTutorUpcomingSessions:', error);
    next(error);
  }
};

/**
 * Get tutor's session statistics
 */
export const getTutorSessionStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { tutorId } = req.params;
    const supabase = createSupabaseClient();

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get all completed interviews
    const { data: completedInterviews, error: completedError } = await supabase
      .from('interviews')
      .select('id, scheduled_at')
      .eq('tutor_id', tutorId)
      .eq('completed', true);

    if (completedError) {
      throw new Error(completedError.message);
    }

    // Get upcoming interviews count
    const { count: upcomingCount, error: upcomingError } = await supabase
      .from('interviews')
      .select('*', { count: 'exact', head: true })
      .eq('tutor_id', tutorId)
      .eq('completed', false)
      .not('scheduled_at', 'is', null)
      .gte('scheduled_at', now.toISOString());

    if (upcomingError) {
      throw new Error(upcomingError.message);
    }

    // Calculate stats
    const totalCompleted = completedInterviews?.length || 0;
    const thisWeekCompleted = completedInterviews?.filter((interview: any) => 
      new Date(interview.scheduled_at) >= oneWeekAgo
    ).length || 0;
    const thisMonthCompleted = completedInterviews?.filter((interview: any) => 
      new Date(interview.scheduled_at) >= oneMonthAgo
    ).length || 0;

    res.json({
      success: true,
      data: {
        totalCompleted,
        totalUpcoming: upcomingCount || 0,
        thisWeekCompleted,
        thisMonthCompleted,
      },
    });
  } catch (error: any) {
    console.error('Error in getTutorSessionStats:', error);
    next(error);
  }
};
