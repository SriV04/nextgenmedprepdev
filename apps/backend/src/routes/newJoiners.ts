import { Router } from 'express';
import { NewJoinersController } from '@/controllers/newJoinersController';
import { validateNewJoiner } from '@/middleware/validation';
import { asyncHandler } from '@/middleware/errorHandler';

const router = Router();
const newJoinersController = new NewJoinersController();

// Create a new joiner application
router.post('/new-joiners', validateNewJoiner, asyncHandler(newJoinersController.createNewJoiner.bind(newJoinersController)));

// Get all new joiners (admin endpoint) - this should come before specific ID routes
router.get('/new-joiners', asyncHandler(newJoinersController.getAllNewJoiners.bind(newJoinersController)));

// Get new joiners by subject
router.get('/new-joiners/subject/:subject', asyncHandler(newJoinersController.getNewJoinersBySubject.bind(newJoinersController)));

// Get new joiners by availability
router.get('/new-joiners/availability/:availability', asyncHandler(newJoinersController.getNewJoinersByAvailability.bind(newJoinersController)));

// Get a new joiner by email
router.get('/new-joiners/email/:email', asyncHandler(newJoinersController.getNewJoinerByEmail.bind(newJoinersController)));

// Get a new joiner by ID
router.get('/new-joiners/:id', asyncHandler(newJoinersController.getNewJoiner.bind(newJoinersController)));

// Update a new joiner application
router.put('/new-joiners/:id', asyncHandler(newJoinersController.updateNewJoiner.bind(newJoinersController)));

// Delete a new joiner application
router.delete('/new-joiners/:id', asyncHandler(newJoinersController.deleteNewJoiner.bind(newJoinersController)));

export default router;