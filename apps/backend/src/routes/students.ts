import { Router } from 'express';
import {
  getStudentDashboard,
  updateStudentProfile,
  submitStudentAvailability,
  getStudentAvailability,
  updateBookingUniversity,
} from '@/controllers/studentController';

import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Get student dashboard data by email (profile, bookings, interviews, availability)
router.get('/students/email/:email/dashboard', asyncHandler(getStudentDashboard));

// Get student availability by student ID
router.get('/students/:studentId/availability', asyncHandler(getStudentAvailability));

// Update student profile
router.put('/students/:userId/profile', asyncHandler(updateStudentProfile));

// Submit student availability
router.post('/students/:userId/availability', asyncHandler(submitStudentAvailability));

// Update university preference on a booking
router.put('/students/bookings/:bookingId/university', asyncHandler(updateBookingUniversity));

export default router;
