import pool from '../config/db.config.js';

const Order = {
  async getOrdersByUserId(userId) { // sort desc so ang naa kay recent orders
    const [rows] = await pool.query(
      `SELECT o.order_id, o.order_date, o.status, o.total_amount, f.status AS delivery_status
       FROM orders o
       LEFT JOIN order_fulfillment f ON f.order_id = o.order_id
       WHERE o.user_id = ?
       ORDER BY o.order_date DESC`,
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
      `INSERT INTO orders (
        user_id, shipping_full_name, shipping_contact_number, total_amount, payment_method, shipping_street_address, shipping_barangay, shipping_city, shipping_province, shipping_postal_code, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')`,
      [userId, shipping.fullName, shipping.contact, totalAmount, payment.method, shipping.address, shipping.barangay, shipping.city, shipping.province, shipping.postalCode]
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

  async createPayment({ orderId, amount, status, referenceNumber }) {
    const [result] = await pool.query(
      `INSERT INTO payments (order_id, amount, reference_number, status) 
       VALUES (?, ?, ?, ?)`,
      [orderId, amount, referenceNumber || null, status]
    );
    return result.insertId;
  },

  async updateStatus(orderId, status) {
    const [result] = await pool.query(
      `UPDATE orders SET status = ? WHERE order_id = ?`,
      [status, orderId]
    );
    return result.affectedRows > 0;
  },

  async updateOrder(orderId, fields) {
    // Only allow updating certain fields
    const allowed = ['status', 'payment_verified', 'shipping_street_address', 'shipping_barangay', 'shipping_city', 'shipping_province', 'shipping_postal_code'];
    const updates = [];
    const values = [];
    for (const key of allowed) {
      if (fields[key] !== undefined) {
        updates.push(`${key} = ?`);
        values.push(fields[key]);
      }
    }
    if (updates.length === 0) return false;
    values.push(orderId);
    const [result] = await pool.query(
      `UPDATE orders SET ${updates.join(', ')} WHERE order_id = ?`,
      values
    );
    return result.affectedRows > 0;
  },

  async deleteOrder(orderId) {
    const [result] = await pool.query(
      `DELETE FROM orders WHERE order_id = ?`,
      [orderId]
    );
    return result.affectedRows > 0;
  },

  async updateFulfillmentStatus(orderId, status) {
    // Update the latest fulfillment row for this order
    const [rows] = await pool.query(
      `SELECT order_fulfillment_id FROM order_fulfillment WHERE order_id = ? ORDER BY order_fulfillment_id DESC LIMIT 1`,
      [orderId]
    );
    if (!rows.length) return false;
    const fulfillmentId = rows[0].order_fulfillment_id;
    const [result] = await pool.query(
      `UPDATE order_fulfillment SET status = ? WHERE order_fulfillment_id = ?`,
      [status, fulfillmentId]
    );
    return result.affectedRows > 0;
  },

  async createFulfillment(orderId) {
    const [result] = await pool.query(
      `INSERT INTO order_fulfillment (order_id, status) VALUES (?, 'Pending')`,
      [orderId]
    );
    return result.insertId;
  },

  async getTotalOrders() {
    const [rows] = await pool.query(`SELECT COUNT(*) as total FROM orders`);
    return rows[0].total;
  },

  async getCompletedOrders() {
    const [rows] = await pool.query(`SELECT COUNT(*) as completed FROM orders WHERE status = 'Completed'`);
    return rows[0].completed;
  },

  async getAllOrders() {
    const [rows] = await pool.query(
      `SELECT o.order_id, o.user_id, o.order_date, o.status, f.status AS delivery_status, o.payment_verified, o.payment_method, o.shipping_street_address, o.shipping_barangay, o.shipping_city, o.shipping_province, o.shipping_postal_code, u.username, u.email,
        p.amount, p.amount_received, p.status AS payment_status, p.disputed, p.verification_notes
       FROM orders o
       JOIN users u ON o.user_id = u.user_id
       LEFT JOIN order_fulfillment f ON f.order_id = o.order_id
       LEFT JOIN payments p ON p.order_id = o.order_id
       ORDER BY o.order_date DESC`
    );
    return rows;
  },

  async getPendingOrdersWithPayment() {
    const [rows] = await pool.query(`
      SELECT o.order_id, o.user_id, o.order_date, o.payment_method,
             p.payment_id, p.amount, p.reference_number
      FROM orders o
      LEFT JOIN payments p ON o.order_id = p.order_id
      WHERE o.status = 'Pending'
      ORDER BY o.order_date DESC
    `);
    return rows;
  },

  async updatePaymentVerification(paymentId, { amount_received, verification_notes, status }) {
    const [result] = await pool.query(
      `UPDATE payments SET amount_received = ?, verification_notes = ?, status = ? WHERE payment_id = ?`,
      [amount_received, verification_notes, status, paymentId]
    );
    return result.affectedRows > 0;
  },

  async updatePaymentStatusAndDisputed(paymentId, { payment_status, disputed }) {
    const [result] = await pool.query(
      `UPDATE payments SET status = ?, disputed = ? WHERE payment_id = ?`,
      [payment_status, disputed, paymentId]
    );
    return result.affectedRows > 0;
  },
};

Order.pool = pool;

export default Order; 