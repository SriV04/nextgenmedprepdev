import { Request, Response } from 'express';
import supabaseService from '@/services/supabaseService';
import emailService from '@/services/emailService';
import { AppError, ApiResponse, NewJoiner, CreateNewJoinerRequest, UpdateNewJoinerRequest } from '@nextgenmedprep/common-types';

export class NewJoinersController {
  // Create a new joiner application
  async createNewJoiner(req: Request, res: Response): Promise<void> {
    const newJoinerData: CreateNewJoinerRequest = req.body;

    console.log("NewJoinersController: Creating new joiner application for:", newJoinerData.email);

    // Check if application already exists
    const existingApplication = await supabaseService.getNewJoinerByEmail(newJoinerData.email);
    if (existingApplication) {
      throw new AppError('Application with this email already exists', 409);
    }

    // Validate required fields
    this.validateNewJoinerData(newJoinerData);

    const newJoiner = await supabaseService.createNewJoiner(newJoinerData);

    // Send confirmation email to applicant
    try {
      await emailService.sendNewJoinerConfirmationEmail(newJoiner.email, newJoiner.full_name);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the application creation if email fails
    }

    // Send notification email to admin
    try {
      await emailService.sendNewJoinerNotificationEmail(newJoiner);
    } catch (emailError) {
      console.error('Failed to send admin notification email:', emailError);
    }

    const response: ApiResponse<NewJoiner> = {
      success: true,
      data: newJoiner,
      message: 'Application submitted successfully',
    };

    res.status(201).json(response);
  }

  // Get a new joiner application by ID
  async getNewJoiner(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const newJoiner = await supabaseService.getNewJoinerById(id);
    if (!newJoiner) {
      throw new AppError('Application not found', 404);
    }

    const response: ApiResponse<NewJoiner> = {
      success: true,
      data: newJoiner,
    };

    res.json(response);
  }

  // Get a new joiner application by email
  async getNewJoinerByEmail(req: Request, res: Response): Promise<void> {
    const { email } = req.params;

    const newJoiner = await supabaseService.getNewJoinerByEmail(email);
    if (!newJoiner) {
      throw new AppError('Application not found', 404);
    }

    const response: ApiResponse<NewJoiner> = {
      success: true,
      data: newJoiner,
    };

    res.json(response);
  }

  // Update a new joiner application
  async updateNewJoiner(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const updates: UpdateNewJoinerRequest = req.body;

    // Check if application exists
    const existingApplication = await supabaseService.getNewJoinerById(id);
    if (!existingApplication) {
      throw new AppError('Application not found', 404);
    }

    // If email is being updated, check for duplicates
    if (updates.email && updates.email !== existingApplication.email) {
      const emailExists = await supabaseService.getNewJoinerByEmail(updates.email);
      if (emailExists) {
        throw new AppError('Application with this email already exists', 409);
      }
    }

    const updatedNewJoiner = await supabaseService.updateNewJoiner(id, updates);

    const response: ApiResponse<NewJoiner> = {
      success: true,
      data: updatedNewJoiner,
      message: 'Application updated successfully',
    };

    res.json(response);
  }

  // Delete a new joiner application
  async deleteNewJoiner(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    // Check if application exists
    const existingApplication = await supabaseService.getNewJoinerById(id);
    if (!existingApplication) {
      throw new AppError('Application not found', 404);
    }

    await supabaseService.deleteNewJoiner(id);

    const response: ApiResponse = {
      success: true,
      message: 'Application deleted successfully',
    };

    res.json(response);
  }

  // Get all new joiner applications (admin only)
  async getAllNewJoiners(req: Request, res: Response): Promise<void> {
    const filters = req.query as any;
    const pagination = {
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
    };

    const result = await supabaseService.getAllNewJoiners(filters, pagination);

    const response: ApiResponse<{ newJoiners: NewJoiner[]; pagination: any }> = {
      success: true,
      data: {
        newJoiners: result.newJoiners,
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          total: result.total,
          totalPages: Math.ceil(result.total / pagination.limit),
        },
      },
    };

    res.json(response);
  }

  // Get applications by tutoring subject
  async getNewJoinersBySubject(req: Request, res: Response): Promise<void> {
    const { subject } = req.params;

    const newJoiners = await supabaseService.getNewJoinersBySubject(subject);

    const response: ApiResponse<NewJoiner[]> = {
      success: true,
      data: newJoiners,
    };

    res.json(response);
  }

  // Get applications by availability
  async getNewJoinersByAvailability(req: Request, res: Response): Promise<void> {
    const { availability } = req.params;

    const newJoiners = await supabaseService.getNewJoinersByAvailability(availability);

    const response: ApiResponse<NewJoiner[]> = {
      success: true,
      data: newJoiners,
    };

    res.json(response);
  }

  private validateNewJoinerData(data: CreateNewJoinerRequest): void {
    const requiredFields = [
      'full_name',
      'email',
      'alevel_subjects_grades',
      'university_year',
      'med_dent_grades',
      'ucat',
      'med_school_offers',
      'subjects_can_tutor',
      'tutoring_experience',
      'why_tutor',
      'availability',
    ];

    for (const field of requiredFields) {
      if (!data[field as keyof CreateNewJoinerRequest]) {
        throw new AppError(`${field} is required`, 400);
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new AppError('Invalid email format', 400);
    }

    // Validate arrays are not empty
    if (!data.subjects_can_tutor || data.subjects_can_tutor.length === 0) {
      throw new AppError('At least one tutoring subject must be selected', 400);
    }

    if (!data.availability || data.availability.length === 0) {
      throw new AppError('At least one availability slot must be selected', 400);
    }

    // Validate UCAT scores are provided
    if (!data.ucat || Object.keys(data.ucat).length === 0) {
      throw new AppError('UCAT scores information is required', 400);
    }
  }
}