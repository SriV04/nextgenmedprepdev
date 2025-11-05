import { Router } from 'express';
import { bookingController } from '../controllers/bookingController';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Admin routes - get all bookings and stats
router.get('/bookings/all',
  asyncHandler(bookingController.getAllBookings.bind(bookingController))
);

router.get('/bookings/stats',
  asyncHandler(bookingController.getBookingStats.bind(bookingController))
);

// Career consultation booking routes
router.post('/bookings/career-consultation', 
  asyncHandler(bookingController.createCareerConsultation.bind(bookingController))
);

// Conference/event booking routes
router.post('/bookings/event', 
  asyncHandler(bookingController.createEventBooking.bind(bookingController))
);

// Get booking by ID
router.get('/bookings/:id', 
  asyncHandler(bookingController.getBookingById.bind(bookingController))
);

// Get user bookings
router.get('/bookings/user/:userId', 
  asyncHandler(bookingController.getUserBookings.bind(bookingController))
);

// Get bookings by email
router.get('/bookings/email/:email', 
  asyncHandler(bookingController.getBookingsByEmail.bind(bookingController))
);

// Update booking
router.put('/bookings/:id',
  asyncHandler(bookingController.updateBooking.bind(bookingController))
);

export default router;