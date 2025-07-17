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
};

export default Order; 