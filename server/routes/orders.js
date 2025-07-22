import express from 'express';
import orderController from '../controllers/orderController.js';

const router = express.Router();

// Admin dashboard stats (must come before /:orderId to avoid conflicts)
router.get('/admin-dashboard-stats', orderController.adminDashboardStats);
// Supplier dashboard stats (must come before /:orderId to avoid conflicts)
router.get('/supplier-dashboard-stats', orderController.supplierDashboardStats);

// GET /api/orders/admin/all - get all orders (admin)
router.get('/admin/all', orderController.getAllOrders);

// GET /api/orders/user/:userId - get all orders for a user
router.get('/user/:userId', orderController.getUserOrders);

// POST /api/orders/:orderId/complete - mark order as completed by customer
router.post('/:orderId/complete', orderController.markOrderCompleted);

// PATCH /api/orders/:orderId - update order fields
router.patch('/:orderId', orderController.updateOrder);
// PATCH /api/orders/:orderId/fulfillment - update fulfillment status
router.patch('/:orderId/fulfillment', orderController.updateFulfillmentStatus);
// DELETE /api/orders/:orderId - delete order
router.delete('/:orderId', orderController.deleteOrder);

// GET /api/orders/:orderId - get specific order details
router.get('/:orderId', orderController.getOrderById);

// POST /api/orders - create a new order
router.post('/', orderController.createOrder);

export default router; 