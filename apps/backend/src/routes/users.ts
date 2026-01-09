import { Router } from 'express';
import { 
  getUserByEmail, 
  createUser, 
  getUserById,
  getUserAvailability,
  addUserAvailability,
  deleteUserAvailability,
  deleteUserFutureAvailability,
} from '../controllers/userController';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Get user by email
router.get('/users/email/:email', asyncHandler(getUserByEmail));

// Get user by ID
router.get('/users/:id', asyncHandler(getUserById));

// Create user
router.post('/users', asyncHandler(createUser));

// User availability routes
router.get('/users/:userId/availability', asyncHandler(getUserAvailability));
router.post('/users/:userId/availability', asyncHandler(addUserAvailability));
router.delete('/users/:userId/availability/future', asyncHandler(deleteUserFutureAvailability));
router.delete('/users/:userId/availability/:slotId', asyncHandler(deleteUserAvailability));

export default router;
