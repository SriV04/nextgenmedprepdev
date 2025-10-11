import { createClient, SupabaseClient } from '@supabase/supabase-js';
import multer from 'multer';
import { Request } from 'express';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

class FileUploadService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration for file upload');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  // Configure multer for memory storage
  getMulterConfig() {
    return multer({
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
      fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
        // Allow PDF, DOC, and DOCX files
        const allowedTypes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        
        if (allowedTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Only PDF, DOC, and DOCX files are allowed for CV upload'));
        }
      }
    });
  }

  // Upload CV to Supabase storage
  async uploadCV(file: Express.Multer.File, email: string): Promise<string> {
    try {
      // Generate a unique filename
      const timestamp = Date.now();
      const sanitizedEmail = email.replace(/[^a-zA-Z0-9]/g, '_');
      const fileExtension = this.getFileExtension(file.originalname);
      const fileName = `${sanitizedEmail}_${timestamp}${fileExtension}`;
      const filePath = `cvs/${fileName}`;

      console.log('Uploading CV to Supabase storage:', {
        fileName,
        filePath,
        size: file.size,
        mimetype: file.mimetype
      });

      // Upload file to Supabase storage
      const { data, error } = await this.supabase.storage
        .from('Applicant Cvs')
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false
        });

      if (error) {
        console.error('Supabase storage upload error:', error);
        throw new Error(`Failed to upload CV: ${error.message}`);
      }

      console.log('CV uploaded successfully:', data);

      // Get the public URL for the uploaded file
      const { data: urlData } = this.supabase.storage
        .from('Applicant Cvs')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading CV:', error);
      throw error;
    }
  }

  // Upload Personal Statement to Supabase storage
  async uploadPersonalStatement(file: Express.Multer.File, email: string): Promise<string> {
    try {
      // Generate a unique filename
      const timestamp = Date.now();
      const sanitizedEmail = email.replace(/[^a-zA-Z0-9]/g, '_');
      const fileExtension = this.getFileExtension(file.originalname);
      const fileName = `${sanitizedEmail}_${timestamp}${fileExtension}`;
      const filePath = `statements/${fileName}`;

      console.log('Uploading Personal Statement to Supabase storage:', {
        fileName,
        filePath,
        size: file.size,
        mimetype: file.mimetype
      });

      // Upload file to Supabase storage
      const { data, error } = await this.supabase.storage
        .from('Personal Statements')
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false
        });

      if (error) {
        console.error('Supabase storage upload error:', error);
        throw new Error(`Failed to upload Personal Statement: ${error.message}`);
      }

      console.log('Personal Statement uploaded successfully:', data);

      // Return the file path (not public URL since these should be private)
      return filePath;
    } catch (error) {
      console.error('Error uploading Personal Statement:', error);
      throw error;
    }
  }

  // Delete CV from Supabase storage
  async deleteCV(cvUrl: string): Promise<void> {
    try {
      // Extract file path from URL
      const filePath = this.extractFilePathFromUrl(cvUrl);
      
      if (!filePath) {
        throw new Error('Invalid CV URL format');
      }

      const { error } = await this.supabase.storage
        .from('Applicant Cvs')
        .remove([filePath]);

      if (error) {
        console.error('Error deleting CV:', error);
        throw new Error(`Failed to delete CV: ${error.message}`);
      }

      console.log('CV deleted successfully:', filePath);
    } catch (error) {
      console.error('Error deleting CV:', error);
      throw error;
    }
  }

  // Delete Personal Statement from Supabase storage
  async deletePersonalStatement(filePath: string): Promise<void> {
    try {
      const { error } = await this.supabase.storage
        .from('Personal Statements')
        .remove([filePath]);

      if (error) {
        console.error('Error deleting Personal Statement:', error);
        throw new Error(`Failed to delete Personal Statement: ${error.message}`);
      }

      console.log('Personal Statement deleted successfully:', filePath);
    } catch (error) {
      console.error('Error deleting Personal Statement:', error);
      throw error;
    }
  }

  // Generate a signed URL for CV download (for admin access)
  async getSignedUrl(cvUrl: string, expiresIn: number = 3600): Promise<string> {
    try {
      const filePath = this.extractFilePathFromUrl(cvUrl);
      
      if (!filePath) {
        throw new Error('Invalid CV URL format');
      }

      const { data, error } = await this.supabase.storage
        .from('Applicant Cvs')
        .createSignedUrl(filePath, expiresIn);

      if (error) {
        throw new Error(`Failed to generate signed URL: ${error.message}`);
      }

      return data.signedUrl;
    } catch (error) {
      console.error('Error generating signed URL:', error);
      throw error;
    }
  }

  // Generate a signed URL for Personal Statement download (for reviewer access)
  async getPersonalStatementSignedUrl(filePath: string, expiresIn: number = 3600): Promise<string> {
    try {
      const { data, error } = await this.supabase.storage
        .from('Personal Statements')
        .createSignedUrl(filePath, expiresIn);

      if (error) {
        throw new Error(`Failed to generate Personal Statement signed URL: ${error.message}`);
      }

      return data.signedUrl;
    } catch (error) {
      console.error('Error generating Personal Statement signed URL:', error);
      throw error;
    }
  }

  // Upload feedback file for Personal Statement review
  async uploadPersonalStatementFeedback(file: Express.Multer.File, personalStatementId: string, reviewerEmail: string): Promise<string> {
    try {
      // Generate a unique filename for feedback
      const timestamp = Date.now();
      const sanitizedReviewer = reviewerEmail.replace(/[^a-zA-Z0-9]/g, '_');
      const fileExtension = this.getFileExtension(file.originalname);
      const fileName = `feedback_${personalStatementId}_${sanitizedReviewer}_${timestamp}${fileExtension}`;
      const filePath = `feedback/${fileName}`;

      console.log('Uploading Personal Statement Feedback to Supabase storage:', {
        fileName,
        filePath,
        size: file.size,
        mimetype: file.mimetype
      });

      // Upload file to Supabase storage
      const { data, error } = await this.supabase.storage
        .from('Personal Statements')
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false
        });

      if (error) {
        console.error('Supabase storage upload error:', error);
        throw new Error(`Failed to upload Personal Statement Feedback: ${error.message}`);
      }

      console.log('Personal Statement Feedback uploaded successfully:', data);

      // Return the file path
      return filePath;
    } catch (error) {
      console.error('Error uploading Personal Statement Feedback:', error);
      throw error;
    }
  }

  private getFileExtension(filename: string): string {
    const lastDotIndex = filename.lastIndexOf('.');
    return lastDotIndex !== -1 ? filename.substring(lastDotIndex) : '';
  }

  private extractFilePathFromUrl(url: string): string | null {
    try {
      // Extract the file path from Supabase public URL
      // Format: https://[project].supabase.co/storage/v1/object/public/Applicant%20Cvs/[filepath]
      const match = url.match(/\/storage\/v1\/object\/public\/Applicant%20Cvs\/(.+)$/);
      return match ? decodeURIComponent(match[1]) : null;
    } catch (error) {
      console.error('Error extracting file path from URL:', error);
      return null;
    }
  }
}

export default new FileUploadService();