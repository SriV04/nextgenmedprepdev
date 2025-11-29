import { Router, Request, Response, NextFunction } from 'express';
import { createSupabaseClient } from '../../supabase/config';


const router = Router();

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

export default router;
