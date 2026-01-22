import { Request, Response } from 'express';
import supabaseService from '@/services/supabaseService';

/**
 * Get student availability by student ID
 * Fetches all future availability slots for a student
 */
export async function getStudentAvailability(req: Request, res: Response): Promise<void> {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      res.status(400).json({
        success: false,
        message: 'Student ID is required',
      });
      return;
    }

    // Fetch availability for this student
    const { data: availabilityData, error: availabilityError } = await supabaseService.supabase
      .from('student_availability')
      .select('*')
      .eq('student_id', studentId)
      .gte('date', new Date().toISOString().split('T')[0])
      .order('date', { ascending: true })
      .order('hour_start', { ascending: true });

    if (availabilityError) {
      console.error('Error fetching student availability:', availabilityError);
      throw new Error(`Failed to fetch availability: ${availabilityError.message}`);
    }

    res.json({
      success: true,
      data: availabilityData || [],
    });
  } catch (error: any) {
    console.error('Get student availability error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch student availability',
    });
  }
}

/**
 * Get student dashboard data by email
 * Fetches user, bookings, interviews, and availability for a student
 * Flow: email -> user -> bookings/interviews/availability by user_id
 */
export async function getStudentDashboard(req: Request, res: Response): Promise<void> {
  try {
    const { email } = req.params;

    if (!email) {
      res.status(400).json({
        success: false,
        message: 'Email is required',
      });
      return;
    }

    // Fetch user record by email
    const { data: userData, error: userError } = await supabaseService.supabase
      .from('users')
      .select('*')
      .eq('email', decodeURIComponent(email))
      .single();

    if (userError || !userData) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    const userId = userData.id;

    // Fetch bookings
    const { data: bookingsData, error: bookingsError } = await supabaseService.supabase
      .from('bookings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (bookingsError) {
      console.error('Error fetching bookings:', bookingsError);
    }

    // Fetch interviews with related data
    const { data: interviewsData, error: interviewsError } = await supabaseService.supabase
      .from('interviews')
      .select(`
        *,
        tutor:tutor_id(id, name, email),
        booking:booking_id(*)
      `)
      .eq('student_id', userId)
      .order('scheduled_at', { ascending: false });

    if (interviewsError) {
      console.error('Error fetching interviews:', interviewsError);
    }

    // Fetch existing availability
    const { data: availabilityData, error: availabilityError } = await supabaseService.supabase
      .from('student_availability')
      .select('*')
      .eq('student_id', userId)
      .gte('date', new Date().toISOString().split('T')[0])
      .order('date', { ascending: true });

    if (availabilityError) {
      console.error('Error fetching availability:', availabilityError);
    }

    res.json({
      success: true,
      data: {
        user: userData,
        bookings: bookingsData || [],
        interviews: interviewsData || [],
        availability: availabilityData || [],
      },
    });
  } catch (error: any) {
    console.error('Get student dashboard error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch student dashboard data',
    });
  }
}

/**
 * Update user profile
 */
export async function updateStudentProfile(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = req.params;
    const { full_name, phone_number } = req.body;

    if (!userId) {
      res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
      return;
    }

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };
    
    if (full_name !== undefined) updateData.full_name = full_name;
    if (phone_number !== undefined) updateData.phone_number = phone_number;

    const { data, error } = await supabaseService.supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }

    res.json({
      success: true,
      data,
      message: 'Profile updated successfully',
    });
  } catch (error: any) {
    console.error('Update student profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update student profile',
    });
  }
}

/**
 * Submit student availability
 */
export async function submitStudentAvailability(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = req.params;
    const { slots, notes } = req.body;

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
        message: 'At least one availability slot is required',
      });
      return;
    }

    // Delete existing future availability
    await supabaseService.supabase
      .from('student_availability')
      .delete()
      .eq('student_id', userId)
      .gte('date', new Date().toISOString().split('T')[0]);

    // Insert new availability
    const slotsToInsert = slots.map((slot: any) => ({
      student_id: userId,
      date: slot.date,
      hour_start: slot.hour_start,
      hour_end: slot.hour_end,
      type: 'interview',
      notes: notes || null,
    }));

    const { data, error } = await supabaseService.supabase
      .from('student_availability')
      .insert(slotsToInsert)
      .select();

    if (error) {
      throw new Error(`Failed to submit availability: ${error.message}`);
    }

    res.json({
      success: true,
      data,
      message: 'Availability submitted successfully',
    });
  } catch (error: any) {
    console.error('Submit student availability error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit availability',
    });
  }
}

/**
 * Update university preference on a booking
 */
export async function updateBookingUniversity(req: Request, res: Response): Promise<void> {
  try {
    const { bookingId } = req.params;
    const { university } = req.body;

    if (!bookingId) {
      res.status(400).json({
        success: false,
        message: 'Booking ID is required',
      });
      return;
    }

    if (!university) {
      res.status(400).json({
        success: false,
        message: 'University is required',
      });
      return;
    }

    const { data, error } = await supabaseService.supabase
      .from('bookings')
      .update({
        universities: university,
        updated_at: new Date().toISOString(),
      })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update university: ${error.message}`);
    }

    res.json({
      success: true,
      data,
      message: 'University preference updated successfully',
    });
  } catch (error: any) {
    console.error('Update booking university error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update university preference',
    });
  }
}
