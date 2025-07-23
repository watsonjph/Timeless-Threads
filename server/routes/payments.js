import express from 'express';
import orderController from '../controllers/orderController.js';

console.log("Loaded payments routes");

const router = express.Router();

// PATCH /api/payments/:paymentId/verify - verify payment (admin)
router.patch('/:paymentId/verify', orderController.verifyPayment);

// PATCH /api/payments/:paymentId/status-disputed - update payment status and disputed (admin)
router.patch('/:paymentId/status-disputed', orderController.updatePaymentStatusAndDisputed);

export default router; 