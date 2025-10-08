import { Router } from 'express';
import { paymentController } from '../controllers/paymentController';

const router = Router();

// Payment routes
router.post('/payments/create', paymentController.createPayment.bind(paymentController));
router.post('/payments/subscription', paymentController.createSubscription.bind(paymentController));
router.get('/payments/status/:session_id', paymentController.getPaymentStatus.bind(paymentController));
router.post('/payments/refund/:payment_intent_id', paymentController.refundPayment.bind(paymentController));
router.post('/payments/capture/:payment_intent_id', paymentController.capturePayment.bind(paymentController));
router.get('/payments/subscription/:subscription_id', paymentController.getSubscription.bind(paymentController));
router.post('/payments/subscription/:subscription_id/cancel', paymentController.cancelSubscription.bind(paymentController));

// Stripe webhook (this should be accessible without authentication)
router.post('/payments/stripe/webhook', paymentController.handleWebhook.bind(paymentController));

export default router;