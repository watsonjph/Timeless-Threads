import pool from '../config/db.config.js';

const Order = {
  async getOrdersByUserId(userId) { // sort desc so ang naa kay recent orders
    const [rows] = await pool.query(
      `SELECT order_id, order_date, status, total_amount, delivery_status
       FROM orders
       WHERE user_id = ?
       ORDER BY order_date DESC`,
      [userId]
    );
    return rows;
  },

  async getOrderById(orderId) {
    const [rows] = await pool.query(
      `SELECT o.*
       FROM orders o
       WHERE o.order_id = ?`,
      [orderId]
    );
    
    if (rows.length === 0) return null;
    
    const order = rows[0];
    
    // Get order items
    const [items] = await pool.query(
      `SELECT oi.*, pv.sku, p.name as product_name
       FROM order_items oi
       JOIN product_variants pv ON oi.variant_id = pv.variant_id
       JOIN products p ON pv.product_id = p.product_id
       WHERE oi.order_id = ?`,
      [orderId]
    );
    
    order.items = items;
    
    // Get payment info
    const [payments] = await pool.query(
      `SELECT * FROM payments WHERE order_id = ?`,
      [orderId]
    );
    
    if (payments.length > 0) {
      order.payment = payments[0];
    }
    
    return order;
  },

  async create({ userId, totalAmount, shipping, payment }) {
    const [result] = await pool.query(
      `INSERT INTO orders (user_id, total_amount, payment_method, shipping_street_address, status, delivery_status) 
       VALUES (?, ?, ?, ?, 'Pending', 'Pending')`,
      [userId, totalAmount, payment.method, shipping.address]
    );
    return result.insertId;
  },

  async createOrderItem({ orderId, variantId, quantity, unitPrice, subtotal }) {
    const [result] = await pool.query(
      `INSERT INTO order_items (order_id, variant_id, quantity, unit_price, subtotal) 
       VALUES (?, ?, ?, ?, ?)`,
      [orderId, variantId, quantity, unitPrice, subtotal]
    );
    return result.insertId;
  },

  async createPayment({ orderId, amount, status }) {
    const [result] = await pool.query(
      `INSERT INTO payments (order_id, amount, status) 
       VALUES (?, ?, ?)`,
      [orderId, amount, status]
    );
    return result.insertId;
  },

  async getTotalOrders() {
    const [rows] = await pool.query(`SELECT COUNT(*) as total FROM orders`);
    return rows[0].total;
  },

  async getCompletedOrders() {
    const [rows] = await pool.query(`SELECT COUNT(*) as completed FROM orders WHERE delivery_status = 'Delivered'`);
    return rows[0].completed;
  },
};

export default Order; 