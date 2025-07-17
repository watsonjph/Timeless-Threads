import Order from '../models/order.js';

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
};

export default orderController; 