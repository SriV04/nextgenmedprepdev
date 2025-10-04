import { Request, Response, NextFunction } from 'express';
import { AppError } from '@nextgenmedprep/common-types';

// Middleware to parse form data from multipart requests
export const parseFormData = (req: Request, res: Response, next: NextFunction) => {
  try {
    // If we have a file upload, the form data will be in req.body as strings
    // We need to parse the JSON strings back to objects
    if (req.body) {
      const parsedBody: any = {};
      
      for (const [key, value] of Object.entries(req.body)) {
        if (typeof value === 'string') {
          try {
            // Try to parse JSON strings
            if ((key === 'med_dent_grades' || key === 'ucat' || key === 'bmat') && value) {
              parsedBody[key] = JSON.parse(value as string);
            } else if (key === 'subjects_can_tutor' || key === 'availability') {
              // Handle arrays
              const arrayValue = JSON.parse(value as string);
              parsedBody[key] = Array.isArray(arrayValue) ? arrayValue : [arrayValue];
            } else {
              parsedBody[key] = value;
            }
          } catch (parseError) {
            // If parsing fails, keep as string
            parsedBody[key] = value;
          }
        } else {
          parsedBody[key] = value;
        }
      }
      
      req.body = parsedBody;
    }
    
    next();
  } catch (error) {
    console.error('Error parsing form data:', error);
    next(new AppError('Invalid form data format', 400));
  }
};