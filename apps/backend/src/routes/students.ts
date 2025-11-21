import { Router, Request, Response, NextFunction } from 'express';
import { createSupabaseClient } from '../../supabase/config';


const router = Router();

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
