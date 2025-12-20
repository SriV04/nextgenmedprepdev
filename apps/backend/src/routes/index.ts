import { Router } from 'express';
import subscriptionRoutes from './subscriptions';
import resourceRoutes from './resources';
import newJoinersRoutes from './newJoiners';
import paymentRoutes from './payments';
import personalStatementRoutes from './personalStatements';
import bookingRoutes from './bookings';
import interviewBookingRoutes from './interviewBookings';
import tutorRoutes from './tutors';
import interviewRoutes from './interviews';
import universityRoutes from './universities';
import userRoutes from './users';

const router = Router();

// Health check route
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'NextGen MedPrep API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// API routes
router.use('/api/v1', subscriptionRoutes);
router.use('/api/v1', resourceRoutes);
router.use('/api/v1', newJoinersRoutes);
router.use('/api/v1', paymentRoutes);
router.use('/api/v1', personalStatementRoutes);
router.use('/api/v1', bookingRoutes);
router.use('/api/v1', interviewBookingRoutes);
router.use('/api/v1', tutorRoutes);
router.use('/api/v1', interviewRoutes);
router.use('/api/v1', universityRoutes);
router.use('/api/v1', userRoutes);

export default router;
