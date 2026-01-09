import { Router } from 'express';
import healthRouter from './health';
import prometheusRouter from './prometheus';

const router = Router();

router.use('/health', healthRouter);
router.use('/prometheus', prometheusRouter);

export default router;
