import { Router } from 'express';
import {
  createTutor,
  getTutor,
  getAllTutors,
  updateTutor,
  addAvailability,
  getTutorAvailability,
  getAllTutorsWithAvailability,
  addBulkAvailability,
  deleteAvailability,
  getTutorUpcomingSessions,
  getTutorSessionStats,
} from '../controllers/tutorController';

const router = Router();

// Tutor management routes
router.post('/tutors', createTutor);
router.get('/tutors/with-availability', getAllTutorsWithAvailability); // Must be before /tutors/:id
router.get('/tutors', getAllTutors);
router.get('/tutor', getTutor); // Query by id or email
router.put('/tutors/:id', updateTutor);

// Tutor dashboard routes
router.get('/tutors/:tutorId/upcoming-sessions', getTutorUpcomingSessions);
router.get('/tutors/:tutorId/session-stats', getTutorSessionStats);

// Availability management routes
router.post('/tutors/:tutorId/availability', addAvailability);
router.post('/tutors/:tutorId/availability/bulk', addBulkAvailability);
router.get('/tutors/:tutorId/availability', getTutorAvailability);
router.delete('/tutors/availability/:availabilityId', deleteAvailability);

export default router;
