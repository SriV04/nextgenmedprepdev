import { Router } from 'express';
import { SubscriptionController } from '@/controllers/subscriptionController';
import { EmailController } from '@/controllers/emailController';
import { 
  validate, 
  validateParams, 
  validateQuery,
  subscriptionSchema, 
  updateSubscriptionSchema, 
  emailSchema,
  paginationSchema,
  subscriptionFiltersSchema
} from '@/middleware/validation';
import { asyncHandler } from '@/middleware/errorHandler';

const router = Router();
const subscriptionController = new SubscriptionController();
const emailController = new EmailController();

// Subscription routes
router.post(
  '/subscriptions',
  validate(subscriptionSchema),
  asyncHandler(subscriptionController.createSubscription.bind(subscriptionController))
);

router.get(
  '/subscriptions/:email',
  validateParams(emailSchema),
  asyncHandler(subscriptionController.getSubscription.bind(subscriptionController))
);

router.put(
  '/subscriptions/:email',
  validateParams(emailSchema),
  validate(updateSubscriptionSchema),
  asyncHandler(subscriptionController.updateSubscription.bind(subscriptionController))
);

router.delete(
  '/subscriptions/:email',
  validateParams(emailSchema),
  asyncHandler(subscriptionController.deleteSubscription.bind(subscriptionController))
);

router.post(
  '/subscriptions/:email/unsubscribe',
  validateParams(emailSchema),
  asyncHandler(subscriptionController.unsubscribe.bind(subscriptionController))
);

router.post(
  '/subscriptions/:email/resubscribe',
  validateParams(emailSchema),
  asyncHandler(subscriptionController.resubscribe.bind(subscriptionController))
);

router.get(
  '/subscriptions',
  validateQuery(paginationSchema.merge(subscriptionFiltersSchema)),
  asyncHandler(subscriptionController.getSubscriptions.bind(subscriptionController))
);

router.get(
  '/subscriptions/:email/access',
  validateParams(emailSchema),
  asyncHandler(subscriptionController.checkAccess.bind(subscriptionController))
);

// Email routes
router.post(
  '/emails/newsletter',
  asyncHandler(emailController.sendNewsletter.bind(emailController))
);

router.post(
  '/emails/welcome',
  asyncHandler(emailController.sendWelcomeEmail.bind(emailController))
);

router.post(
  '/emails/custom',
  asyncHandler(emailController.sendCustomEmail.bind(emailController))
);

router.get(
  '/emails/test-config',
  asyncHandler(emailController.testEmailConfig.bind(emailController))
);

router.get(
  '/emails/stats',
  asyncHandler(emailController.getEmailStats.bind(emailController))
);

router.post(
  '/emails/event-update',
  asyncHandler(emailController.sendEmailByPackage.bind(emailController))
);

export default router;
