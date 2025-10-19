import { Router } from 'express';
import { interviewBookingController } from '../controllers/interviewBookingController';
import { asyncHandler } from '../middleware/errorHandler';
import { parseFormData } from '../middleware/parseFormData';
import fileUploadService from '../services/fileUploadService';

const router = Router();

// Configure multer for personal statement upload
const upload = fileUploadService.getMulterConfig();

// Create interview booking with personal statement upload
router.post('/interview-bookings',
  upload.single('personalStatement'),
  parseFormData,
  asyncHandler(interviewBookingController.createInterviewBooking.bind(interviewBookingController))
);

// Get interview booking by ID
router.get('/interview-bookings/:id',
  asyncHandler(interviewBookingController.getInterviewBookingById.bind(interviewBookingController))
);

// Get interview bookings by email
router.get('/interview-bookings/email/:email',
  asyncHandler(interviewBookingController.getInterviewBookingsByEmail.bind(interviewBookingController))
);

// Update interview booking
router.put('/interview-bookings/:id',
  asyncHandler(interviewBookingController.updateInterviewBooking.bind(interviewBookingController))
);

// Download personal statement for an interview booking
router.get('/interview-bookings/:id/personal-statement',
  asyncHandler(interviewBookingController.downloadPersonalStatement.bind(interviewBookingController))
);

export default router;
