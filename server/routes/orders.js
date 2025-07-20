import express from 'express';
import orderController from '../controllers/orderController.js';

const router = express.Router();

// Admin dashboard stats (must come before /:orderId to avoid conflicts)
router.get('/admin-dashboard-stats', orderController.adminDashboardStats);
// Supplier dashboard stats (must come before /:orderId to avoid conflicts)
router.get('/supplier-dashboard-stats', orderController.supplierDashboardStats);

// GET /api/orders/user/:userId - get all orders for a user
router.get('/user/:userId', orderController.getUserOrders);

// GET /api/orders/:orderId - get specific order details
router.get('/:orderId', orderController.getOrderById);

// POST /api/orders - create a new order
router.post('/', orderController.createOrder);

export default router; 