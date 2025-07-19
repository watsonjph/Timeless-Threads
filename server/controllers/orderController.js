import Order from '../models/order.js';
import User from '../models/user.js';
import ProductVariant from '../models/productVariant.js';
import SupplierOrder from '../models/supplierOrder.js';

const orderController = {
  async getUserOrders(req, res) {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required.' });
    }
    try {
      const orders = await Order.getOrdersByUserId(userId);
      res.json({ orders });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch orders.' });
    }
  },

  // Admin dashboard stats
  async adminDashboardStats(req, res) {
    try {
      console.log('Admin dashboard stats request received');
      
      const [totalUsers, totalOrders, completedOrders, lowStock] = await Promise.all([
        User.getTotal(),
        Order.getTotalOrders(),
        Order.getCompletedOrders(),
        ProductVariant.getLowStock(),
      ]);
      
      console.log('Admin dashboard stats calculated:', { totalUsers, totalOrders, completedOrders, lowStockCount: lowStock.length });
      
      // lowStock now includes stock_quantity and restock_threshold
      res.json({ totalUsers, totalOrders, completedOrders, lowStock });
    } catch (err) {
      console.error('Admin dashboard stats error:', err);
      res.status(500).json({ error: 'Failed to fetch dashboard stats.', details: err.message });
    }
  },

  // Supplier dashboard stats
  async supplierDashboardStats(req, res) {
    const supplierId = req.query.supplierId;
    if (!supplierId) return res.status(400).json({ error: 'Supplier ID required' });
    try {
      const [activeOrders, completedOrders] = await Promise.all([
        SupplierOrder.getActiveCount(supplierId),
        SupplierOrder.getCompletedCount(supplierId),
      ]);
      res.json({ activeOrders, completedOrders });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch supplier dashboard stats.' });
    }
  },
};

export default orderController; 