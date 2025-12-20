import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { createSupabaseClient } from '../../supabase/config';

const router = Router();

// Validation schemas
const availabilitySchema = z.object({
  student_id: z.string().uuid(),
  timezone: z.string().optional().default('UTC'),
  weekly_availability: z.array(z.object({
    day: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
    slots: z.array(z.object({
      start: z.string(), // HH:MM format
      end: z.string(), // HH:MM format
    })),
  })).optional(),
  specific_dates: z.array(z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    hour_start: z.number().int().min(0).max(23),
    hour_end: z.number().int().min(1).max(24),
    type: z.enum(['interview', 'tutoring', 'consultation']).optional().default('interview'),
  })).optional(),
  notes: z.string().optional(),
});

/**
 * Search students by email
 */
router.get('/students', async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { search } = req.query;
    const supabase = createSupabaseClient();

    if (!search || typeof search !== 'string') {
      res.json({
        success: true,
        data: [],
      });
      return;
    }

    const { data: students, error } = await supabase
      .from('bookings')
      .select('id, email, package')
      .ilike('email', `%${search}%`)
      .limit(10);

    if (error) {
      throw new Error(error.message);
    }

    // Transform to student format
    const studentList = students?.map(s => ({
      id: s.id,
      email: s.email,
      name: s.email.split('@')[0], // Extract name from email
    })) || [];

    res.json({
      success: true,
      data: studentList,
    });
  } catch (error: any) {
    console.error('Error searching students:', error);
    next(error);
  }
});

/**
 * Get student availability by student ID
 */
router.get('/students/:studentId/availability', async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { studentId } = req.params;
    const supabase = createSupabaseClient();

    const { data: availability, error } = await supabase
      .from('student_availability')
      .select('*')
      .eq('student_id', studentId)
      .order('date', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    res.json({
      success: true,
      data: availability || [],
    });
  } catch (error: any) {
    console.error('Error fetching student availability:', error);
    next(error);
  }
});

/**
 * POST /api/v1/student/availability
 * Submit or update student availability
 * Auth required (student must be authenticated)
 */
router.post('/student/availability', async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = availabilitySchema.parse(req.body);
    const supabase = createSupabaseClient();

    console.log('=== Submitting Student Availability ===');
    console.log('Student ID:', validatedData.student_id);

    // 1. Upsert student profile with timezone and weekly availability
    const { data: profile, error: profileError } = await supabase
      .from('student_profiles')
      .upsert({
        user_id: validatedData.student_id,
        timezone: validatedData.timezone,
        weekly_availability: validatedData.weekly_availability || [],
        preferences: validatedData.notes || null,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id',
      })
      .select()
      .single();

    if (profileError) {
      console.error('Error upserting student profile:', profileError);
      throw new Error(profileError.message);
    }

    console.log('Upserted student profile:', profile.id);

    // 2. Insert specific date availability if provided
    let availabilityRecords = [];
    if (validatedData.specific_dates && validatedData.specific_dates.length > 0) {
      // Delete existing availability for these dates to allow updates
      const dates = validatedData.specific_dates.map(d => d.date);
      await supabase
        .from('student_availability')
        .delete()
        .eq('student_id', validatedData.student_id)
        .in('date', dates);

      // Insert new availability records
      const { data: availability, error: availabilityError } = await supabase
        .from('student_availability')
        .insert(validatedData.specific_dates.map(slot => ({
          student_id: validatedData.student_id,
          date: slot.date,
          hour_start: slot.hour_start,
          hour_end: slot.hour_end,
          type: slot.type,
        })))
        .select();

      if (availabilityError) {
        console.error('Error inserting availability:', availabilityError);
        throw new Error(availabilityError.message);
      }

      availabilityRecords = availability || [];
      console.log('Inserted availability records:', availabilityRecords.length);
    }

    res.status(200).json({
      success: true,
      message: 'Availability submitted successfully',
      data: {
        profile,
        availability: availabilityRecords,
      },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      });
      return;
    }
    console.error('Error submitting availability:', error);
    next(error);
  }
});

/**
 * GET /api/v1/student/sessions?filter=upcoming|previous
 * Get student's interview sessions
 * Auth required (student must be authenticated)
 */
router.get('/student/sessions', async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { filter, student_id } = req.query;
    const supabase = createSupabaseClient();

    if (!student_id || typeof student_id !== 'string') {
      res.status(400).json({
        success: false,
        message: 'student_id query parameter is required',
      });
      return;
    }

    console.log('=== Fetching Student Sessions ===');
    console.log('Student ID:', student_id);
    console.log('Filter:', filter);

    const now = new Date().toISOString();

    let query = supabase
      .from('interviews')
      .select(`
        id,
        university,
        scheduled_at,
        completed,
        status,
        notes,
        zoom_join_url,
        student_feedback,
        tutor_id,
        tutors (
          id,
          name,
          email
        )
      `)
      .eq('student_id', student_id);

    // Apply filters based on query parameter
    if (filter === 'upcoming') {
      query = query
        .gte('scheduled_at', now)
        .in('status', ['scheduled', 'confirmed'])
        .order('scheduled_at', { ascending: true });
    } else if (filter === 'previous') {
      query = query
        .or(`completed.eq.true,scheduled_at.lt.${now}`)
        .order('scheduled_at', { ascending: false });
    } else {
      // No filter, return all sorted by date
      query = query.order('scheduled_at', { ascending: false });
    }

    const { data: sessions, error } = await query;

    if (error) {
      console.error('Error fetching sessions:', error);
      throw new Error(error.message);
    }

    console.log('Fetched sessions:', sessions?.length || 0);

    res.json({
      success: true,
      data: sessions || [],
    });
  } catch (error: any) {
    console.error('Error fetching student sessions:', error);
    next(error);
  }
});

/**
 * GET /api/v1/student/profile
 * Get student profile and settings
 */
router.get('/student/profile', async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { student_id } = req.query;
    const supabase = createSupabaseClient();

    if (!student_id || typeof student_id !== 'string') {
      res.status(400).json({
        success: false,
        message: 'student_id query parameter is required',
      });
      return;
    }

    const { data: profile, error } = await supabase
      .from('student_profiles')
      .select(`
        *,
        users (
          id,
          email,
          full_name,
          phone_number
        )
      `)
      .eq('user_id', student_id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw new Error(error.message);
    }

    res.json({
      success: true,
      data: profile || null,
    });
  } catch (error: any) {
    console.error('Error fetching student profile:', error);
    next(error);
  }
});

export default router;
