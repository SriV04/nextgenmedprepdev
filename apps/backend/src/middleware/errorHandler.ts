import { Request, Response, NextFunction } from 'express';
import { AppError } from '@nextgenmedprep/common-types';

// Global error handler
export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let isOperational = false;

  // Handle known AppError instances
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    isOperational = error.isOperational;
  }
  // Handle Supabase errors
  else if (error.message.includes('duplicate key value violates unique constraint')) {
    statusCode = 409;
    message = 'Resource already exists';
    isOperational = true;
  }
  // Handle validation errors
  else if (error.message.includes('Validation failed')) {
    statusCode = 400;
    message = error.message;
    isOperational = true;
  }
  // Handle other specific errors
  else if (error.message.includes('not found')) {
    statusCode = 404;
    message = 'Resource not found';
    isOperational = true;
  }

  // Log errors (in production, you might want to use a proper logging service)
  if (!isOperational || statusCode >= 500) {
    console.error('Error:', {
      message: error.message,
      stack: error.stack,
      statusCode,
      url: req.url,
      method: req.method,
      timestamp: new Date().toISOString(),
    });
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};

// Async error wrapper for route handlers
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 404 handler
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};

// Rate limiting error handler
export const rateLimitHandler = (req: Request, res: Response, next: NextFunction) => {
  res.status(429).json({
    success: false,
    error: 'Too many requests, please try again later',
  });
};
