import { Router } from 'express';
import { paymentController } from '../controllers/paymentController';

const router = Router();

// Payment routes
router.post('/payments/create', paymentController.createPayment.bind(paymentController));
router.post('/payments/subscription', paymentController.createSubscription.bind(paymentController));
router.get('/payments/status/:order_id', paymentController.getPaymentStatus.bind(paymentController));
router.post('/payments/refund/:order_id', paymentController.refundPayment.bind(paymentController));
router.post('/payments/capture/:order_id', paymentController.capturePayment.bind(paymentController));
router.get('/payments/transactions/:order_id', paymentController.getTransactionList.bind(paymentController));
router.get('/payments/reports', paymentController.getReports.bind(paymentController));

// Fondy webhook callback (this should be accessible without authentication)
router.post('/payments/fondy/callback', paymentController.handleCallback.bind(paymentController));

export default router;