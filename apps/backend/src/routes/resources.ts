import { Router } from 'express';
import { ResourceController } from '@/controllers/resourceController';
import { 
  validate, 
  validateParams, 
  emailSchema,
  resourceIdSchema,
  resourceDownloadParamsSchema,
  createResourceSchema,
  updateResourceSchema
} from '@/middleware/validation';
import { asyncHandler } from '@/middleware/errorHandler';

const router = Router();
const resourceController = new ResourceController();

// Public resource routes (require subscription validation)
router.get(
  '/resources/:email/:resourceId/download',
  validateParams(resourceDownloadParamsSchema),
  asyncHandler(resourceController.getResourceDownloadUrl.bind(resourceController))
);

router.get(
  '/resources/:email',
  validateParams(emailSchema),
  asyncHandler(resourceController.getUserResources.bind(resourceController))
);

// Admin resource management routes (would need auth middleware in production)
router.get(
  '/admin/resources',
  asyncHandler(resourceController.getAllResources.bind(resourceController))
);

router.post(
  '/admin/resources',
  validate(createResourceSchema),
  asyncHandler(resourceController.createResource.bind(resourceController))
);

router.put(
  '/admin/resources/:resourceId',
  validateParams(resourceIdSchema),
  validate(updateResourceSchema),
  asyncHandler(resourceController.updateResource.bind(resourceController))
);

router.delete(
  '/admin/resources/:resourceId',
  validateParams(resourceIdSchema),
  asyncHandler(resourceController.deleteResource.bind(resourceController))
);

export default router;
