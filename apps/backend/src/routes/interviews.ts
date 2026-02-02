import { Router } from 'express';
import {
  createInterview,
  getAllInterviews,
  getUnassignedInterviews,
  getInterview,
  updateInterview,
  assignInterviewToTutor,
  completeInterview,
  cancelInterview,
  deleteInterview,
  confirmInterview,
  getInterviewsByStudentEmail,
  getPendingInterviewsWithAvailableTutors,
  assignTutorToPendingInterview,
} from '../controllers/interviewController';

const router = Router();

// Interview management routes
router.post('/interviews', createInterview);
router.get('/interviews', getAllInterviews);
router.get('/interviews/unassigned', getUnassignedInterviews);
router.get('/interviews/pending-with-tutors', getPendingInterviewsWithAvailableTutors);
router.get('/interviews/student/email/:email', getInterviewsByStudentEmail);
router.get('/interviews/:id', getInterview);
router.put('/interviews/:id', updateInterview);
router.patch('/interviews/:id', updateInterview);
router.post('/interviews/:id/assign', assignInterviewToTutor);
router.post('/interviews/:id/assign-tutor', assignTutorToPendingInterview);
router.post('/interviews/:id/complete', completeInterview);
router.post('/interviews/:id/cancel', cancelInterview);
router.post('/interviews/:id/confirm', confirmInterview);
router.delete('/interviews/:id', deleteInterview);

export default router;
