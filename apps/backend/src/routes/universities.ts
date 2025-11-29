import { Router, Request, Response, NextFunction } from 'express';
import { createSupabaseClient } from '../../supabase/config';

const router = Router();

/**
 * Get all universities
 */
router.get('/universities', async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const supabase = createSupabaseClient();

    const { data: universities, error } = await supabase
      .from('universities')
      .select('id, name')
      .order('name', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    res.json({
      success: true,
      data: universities || [],
    });
  } catch (error: any) {
    console.error('Error fetching universities:', error);
    next(error);
  }
});

export default router;
