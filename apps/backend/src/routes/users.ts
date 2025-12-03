import { Router } from 'express';
import { getUserByEmail, createUser, getUserById } from '../controllers/userController';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Get user by email
router.get('/users/email/:email', asyncHandler(getUserByEmail));

// Get user by ID
router.get('/users/:id', asyncHandler(getUserById));

// Create user
router.post('/users', asyncHandler(createUser));

export default router;
