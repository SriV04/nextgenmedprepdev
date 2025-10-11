import { Request, Response } from 'express';
import supabaseService from '@/services/supabaseService';
import fileUploadService from '@/services/fileUploadService';
import { stripeService } from '@/services/stripeService';
import { AppError, ApiResponse, PersonalStatement, CreatePersonalStatementRequest } from '@nextgenmedprep/common-types';
import { z } from 'zod';

// Validation schemas
const createPersonalStatementSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  statementType: z.enum(['medicine', 'dentistry']),
});

export class PersonalStatementController {
  /**
   * Submit personal statement for review with payment
   */
  async submitForReview(req: Request, res: Response): Promise<void> {
    try {
      console.log('=== Personal Statement Submission Started ===');
      console.log('Request body:', req.body);
      console.log('Request file:', req.file ? {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      } : 'No file');

      // Validate form data
      const validatedData = createPersonalStatementSchema.parse(req.body);
      console.log('Validated data:', validatedData);

      const file = req.file;

      if (!file) {
        console.error('No file provided in request');
        throw new AppError('Personal statement file is required', 400);
      }

      console.log('Starting file upload...');
      // Upload file to storage
      const filePath = await fileUploadService.uploadPersonalStatement(file, validatedData.email);
      console.log('File uploaded successfully to path:', filePath);
      
      console.log('Creating Stripe payment session...');
      // Create Stripe payment session with file path in metadata
      const paymentResponse = await stripeService.createCheckoutPayment({
        amount: 20, // £20 for personal statement review
        currency: 'GBP',
        description: `Personal Statement Review - ${validatedData.statementType}`,
        customer_email: validatedData.email,
        customer_name: `${validatedData.firstName} ${validatedData.lastName}`,
        metadata: {
          type: 'personal_statement_review',
          first_name: validatedData.firstName,
          last_name: validatedData.lastName,
          statement_type: validatedData.statementType,
          personal_statement_file_path: filePath
        }
      });
      console.log('Stripe payment session created:', {
        checkout_url: paymentResponse.checkout_url,
        session_id: paymentResponse.session_id
      });

      const response: ApiResponse = {
        success: true,
        data: {
          checkout_url: paymentResponse.checkout_url,
          session_id: paymentResponse.session_id
        },
        message: 'Personal statement uploaded and payment session created'
      };

      console.log('=== Personal Statement Submission Completed Successfully ===');
      res.json(response);
    } catch (error: any) {
      console.error('=== Personal Statement Submission Error ===');
      console.error('Error details:', error);
      console.error('Error stack:', error.stack);
      
      if (error instanceof z.ZodError) {
        console.error('Validation error details:', error.errors);
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors
        });
        return;
      }
      
      if (error instanceof AppError) {
        console.error('App error:', error.message, 'Status:', error.statusCode);
        res.status(error.statusCode).json({
          success: false,
          error: error.message
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get all personal statements (admin endpoint)
   */
  async getAllPersonalStatements(req: Request, res: Response): Promise<void> {
    try {
      const personalStatements = await supabaseService.getAllPersonalStatements();

      const response: ApiResponse<PersonalStatement[]> = {
        success: true,
        data: personalStatements
      };

      res.json(response);
    } catch (error: any) {
      console.error('Get all personal statements error:', error);
      
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get personal statements by status
   */
  async getPersonalStatementsByStatus(req: Request, res: Response): Promise<void> {
    try {
      const { status } = z.object({ 
        status: z.enum(['pending', 'in_review', 'complete']) 
      }).parse(req.params);

      const personalStatements = await supabaseService.getPersonalStatementsByStatus(status);

      const response: ApiResponse<PersonalStatement[]> = {
        success: true,
        data: personalStatements
      };

      res.json(response);
    } catch (error: any) {
      console.error('Get personal statements by status error:', error);
      
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: 'Invalid status parameter'
        });
        return;
      }
      
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get personal statement by ID
   */
  async getPersonalStatement(req: Request, res: Response): Promise<void> {
    try {
      const { id } = z.object({ id: z.string().uuid() }).parse(req.params);

      const personalStatement = await supabaseService.getPersonalStatementById(id);
      
      if (!personalStatement) {
        throw new AppError('Personal statement not found', 404);
      }

      const response: ApiResponse<PersonalStatement> = {
        success: true,
        data: personalStatement
      };

      res.json(response);
    } catch (error: any) {
      console.error('Get personal statement error:', error);
      
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: 'Invalid ID parameter'
        });
        return;
      }
      
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get personal statements by email
   */
  async getPersonalStatementsByEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email } = z.object({ email: z.string().email() }).parse(req.params);

      const personalStatements = await supabaseService.getPersonalStatementsByEmail(email);

      const response: ApiResponse<PersonalStatement[]> = {
        success: true,
        data: personalStatements
      };

      res.json(response);
    } catch (error: any) {
      console.error('Get personal statements by email error:', error);
      
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: 'Invalid email parameter'
        });
        return;
      }
      
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Update personal statement (admin endpoint)
   */
  async updatePersonalStatement(req: Request, res: Response): Promise<void> {
    try {
      const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
      
      const updateSchema = z.object({
        notes: z.string().optional(),
        reviewed: z.boolean().optional(),
        reviewer_email: z.string().email().optional(),
        status: z.enum(['pending', 'in_review', 'complete']).optional(),
        feedback_url: z.string().url().optional(),
        feedback_file_path: z.string().optional(),
      });

      const updates = updateSchema.parse(req.body);

      // If marking as reviewed, set reviewed_at timestamp
      if (updates.reviewed === true) {
        (updates as any).reviewed_at = new Date().toISOString();
      }

      const personalStatement = await supabaseService.updatePersonalStatement(id, updates);

      const response: ApiResponse<PersonalStatement> = {
        success: true,
        data: personalStatement,
        message: 'Personal statement updated successfully'
      };

      res.json(response);
    } catch (error: any) {
      console.error('Update personal statement error:', error);
      
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors
        });
        return;
      }
      
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Download personal statement file (admin/reviewer endpoint)
   */
  async downloadPersonalStatement(req: Request, res: Response): Promise<void> {
    try {
      const { id } = z.object({ id: z.string().uuid() }).parse(req.params);

      const personalStatement = await supabaseService.getPersonalStatementById(id);
      
      if (!personalStatement) {
        throw new AppError('Personal statement not found', 404);
      }

      // Generate signed URL for file download
      const signedUrl = await fileUploadService.getPersonalStatementSignedUrl(
        personalStatement.personal_statement_file_path, 
        3600 // 1 hour expiry
      );

      const response: ApiResponse = {
        success: true,
        data: {
          download_url: signedUrl,
          expires_in: 3600
        }
      };

      res.json(response);
    } catch (error: any) {
      console.error('Download personal statement error:', error);
      
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: 'Invalid ID parameter'
        });
        return;
      }
      
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Upload feedback file (admin/reviewer endpoint)
   */
  async uploadFeedback(req: Request, res: Response): Promise<void> {
    try {
      const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
      const { reviewer_email } = z.object({ 
        reviewer_email: z.string().email() 
      }).parse(req.body);
      
      const feedbackFile = req.file;

      if (!feedbackFile) {
        throw new AppError('Feedback file is required', 400);
      }

      const personalStatement = await supabaseService.getPersonalStatementById(id);
      
      if (!personalStatement) {
        throw new AppError('Personal statement not found', 404);
      }

      // Upload feedback file
      const feedbackFilePath = await fileUploadService.uploadPersonalStatementFeedback(
        feedbackFile, 
        id, 
        reviewer_email
      );

      // Update personal statement with feedback info
      const updatedPersonalStatement = await supabaseService.updatePersonalStatement(id, {
        feedback_file_path: feedbackFilePath,
        reviewer_email,
        reviewed: true,
        reviewed_at: new Date().toISOString(),
        status: 'complete'
      });

      const response: ApiResponse<PersonalStatement> = {
        success: true,
        data: updatedPersonalStatement,
        message: 'Feedback uploaded successfully'
      };

      res.json(response);
    } catch (error: any) {
      console.error('Upload feedback error:', error);
      
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors
        });
        return;
      }
      
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
}

export const personalStatementController = new PersonalStatementController();