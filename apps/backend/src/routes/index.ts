import { Router } from 'express';
import subscriptionRoutes from './subscriptions';

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

export default router;
