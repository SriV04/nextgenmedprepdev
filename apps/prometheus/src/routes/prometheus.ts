import { Router } from 'express';
import { z } from 'zod';
import prometheusService from '../services/prometheusService';

const router = Router();

const generateSchema = z.object({
  bookingId: z.string(),
  studentEmail: z.string().email(),
  universities: z.array(z.string().min(1)),
  metadata: z
    .object({
      packageType: z.string().optional(),
      serviceType: z.enum(['generated', 'live']).optional()
    })
    .default({})
});

router.post('/generate', async (req, res, next) => {
  try {
    const payload = generateSchema.parse(req.body);
    const session = await prometheusService.queueGeneration(payload);

    res.status(202).json({
      success: true,
      data: session
    });
  } catch (error) {
    next(error);
  }
});

router.get('/sessions/:id', async (req, res, next) => {
  try {
    const session = await prometheusService.getSessionById(req.params.id);
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }

    res.json({ success: true, data: session });
  } catch (error) {
    next(error);
  }
});

export default router;
