import { Request, Response, NextFunction } from 'express';
import supabaseService from '../services/supabaseService';

/**
 * Get user by email
 */
export const getUserByEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.params;

    if (!email) {
      res.status(400).json({
        success: false,
        message: 'Email is required',
      });
      return;
    }

    const user = await supabaseService.getUserByEmail(decodeURIComponent(email));

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    console.error('Error getting user by email:', error);
    next(error);
  }
};

/**
 * Create a new user
 */
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, full_name, role, phone_number } = req.body;

    if (!email || !full_name) {
      res.status(400).json({
        success: false,
        message: 'Email and full_name are required',
      });
      return;
    }

    // Check if user already exists
    const existingUser = await supabaseService.getUserByEmail(email);
    if (existingUser) {
      res.status(409).json({
        success: false,
        message: 'User with this email already exists',
        data: existingUser,
      });
      return;
    }

    const user = await supabaseService.createUser({
      email,
      full_name,
      role: role || 'student',
      phone_number: phone_number || undefined,
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user,
    });
  } catch (error: any) {
    console.error('Error creating user:', error);
    next(error);
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
      return;
    }

    const user = await supabaseService.getUserById(id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    console.error('Error getting user by ID:', error);
    next(error);
  }
};

/**
 * Get user availability
 */
export const getUserAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
      return;
    }

    const { data: availability, error } = await supabaseService.supabase
      .from('student_availability')
      .select('*')
      .eq('student_id', userId)
      .order('available_from', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch availability: ${error.message}`);
    }

    res.status(200).json({
      success: true,
      data: availability || [],
    });
  } catch (error: any) {
    console.error('Error getting user availability:', error);
    next(error);
  }
};

/**
 * Add user availability
 */
export const addUserAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { slots } = req.body;

    if (!userId) {
      res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
      return;
    }

    if (!slots || !Array.isArray(slots) || slots.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Availability slots are required',
      });
      return;
    }

    // Add student_id to each slot
    const slotsWithUserId = slots.map((slot) => ({
      ...slot,
      student_id: userId,
    }));

    const { data: availability, error } = await supabaseService.supabase
      .from('student_availability')
      .insert(slotsWithUserId)
      .select();

    if (error) {
      throw new Error(`Failed to add availability: ${error.message}`);
    }

    res.status(201).json({
      success: true,
      message: 'Availability added successfully',
      data: availability,
    });
  } catch (error: any) {
    console.error('Error adding user availability:', error);
    next(error);
  }
};

/**
 * Delete user availability
 */
export const deleteUserAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId, slotId } = req.params;

    if (!userId || !slotId) {
      res.status(400).json({
        success: false,
        message: 'User ID and Slot ID are required',
      });
      return;
    }

    const { error } = await supabaseService.supabase
      .from('student_availability')
      .delete()
      .eq('id', slotId)
      .eq('student_id', userId);

    if (error) {
      throw new Error(`Failed to delete availability: ${error.message}`);
    }

    res.status(200).json({
      success: true,
      message: 'Availability deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting user availability:', error);
    next(error);
  }
};

/**
 * Delete all future availability for a user
 */
export const deleteUserFutureAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
      return;
    }

    const now = new Date().toISOString();

    const { error } = await supabaseService.supabase
      .from('student_availability')
      .delete()
      .eq('student_id', userId)
      .gte('available_from', now);

    if (error) {
      throw new Error(`Failed to delete future availability: ${error.message}`);
    }

    res.status(200).json({
      success: true,
      message: 'Future availability deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting future availability:', error);
    next(error);
  }
};
