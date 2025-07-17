import express from 'express';
import orderController from '../controllers/orderController.js';

const router = express.Router();

// GET /api/orders/user/:userId - get all orders for a user
router.get('/user/:userId', orderController.getUserOrders);

// Admin dashboard stats
router.get('/admin-dashboard-stats', orderController.adminDashboardStats);
// Supplier dashboard stats
router.get('/supplier-dashboard-stats', orderController.supplierDashboardStats);

export default router; 