import { Router } from 'express';
import { personalStatementController } from '@/controllers/personalStatementController';
import { asyncHandler } from '@/middleware/errorHandler';
import { parseFormData } from '@/middleware/parseFormData';
import fileUploadService from '@/services/fileUploadService';

const router = Router();

// Configure multer for file uploads
const upload = fileUploadService.getMulterConfig();

// Submit personal statement for review (public endpoint)
router.post('/personal-statements/submit', 
  upload.single('personalStatement'), 
  parseFormData, 
  asyncHandler(personalStatementController.submitForReview.bind(personalStatementController))
);

// Get all personal statements (admin endpoint)
router.get('/personal-statements', 
  asyncHandler(personalStatementController.getAllPersonalStatements.bind(personalStatementController))
);

// Get personal statements by status (admin endpoint)
router.get('/personal-statements/status/:status', 
  asyncHandler(personalStatementController.getPersonalStatementsByStatus.bind(personalStatementController))
);

// Get personal statements by email (customer endpoint)
router.get('/personal-statements/email/:email', 
  asyncHandler(personalStatementController.getPersonalStatementsByEmail.bind(personalStatementController))
);

// Get personal statement by ID (admin/customer endpoint)
router.get('/personal-statements/:id', 
  asyncHandler(personalStatementController.getPersonalStatement.bind(personalStatementController))
);

// Update personal statement (admin endpoint)
router.put('/personal-statements/:id', 
  asyncHandler(personalStatementController.updatePersonalStatement.bind(personalStatementController))
);

// Download personal statement file (admin/reviewer endpoint)
router.get('/personal-statements/:id/download', 
  asyncHandler(personalStatementController.downloadPersonalStatement.bind(personalStatementController))
);

// Upload feedback file (admin/reviewer endpoint)
router.post('/personal-statements/:id/feedback', 
  upload.single('feedback'), 
  parseFormData, 
  asyncHandler(personalStatementController.uploadFeedback.bind(personalStatementController))
);

export default router;