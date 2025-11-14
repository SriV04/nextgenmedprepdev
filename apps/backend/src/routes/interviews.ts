import { Router } from 'express';
import {
  createInterview,
  getAllInterviews,
  getUnassignedInterviews,
  getInterview,
  updateInterview,
  assignInterviewToTutor,
  completeInterview,
  deleteInterview,
} from '../controllers/interviewController';

const router = Router();

// Interview management routes
router.post('/interviews', createInterview);
router.get('/interviews', getAllInterviews);
router.get('/interviews/unassigned', getUnassignedInterviews);
router.get('/interviews/:id', getInterview);
router.put('/interviews/:id', updateInterview);
router.post('/interviews/:id/assign', assignInterviewToTutor);
router.post('/interviews/:id/complete', completeInterview);
router.delete('/interviews/:id', deleteInterview);

export default router;
