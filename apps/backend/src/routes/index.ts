import { Router } from 'express';
import subscriptionRoutes from './subscriptions';
import resourceRoutes from './resources';
import newJoinersRoutes from './newJoiners';
import paymentRoutes from './payments';

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

export default router;
