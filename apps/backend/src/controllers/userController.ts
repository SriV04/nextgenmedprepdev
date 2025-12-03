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
