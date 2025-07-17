import pool from '../config/db.config.js';

const SupplierOrder = {
  async getAll({ supplierId, adminId } = {}) {
    let query = `SELECT so.*, s.name as supplier_name, u.username as admin_username
                 FROM supplier_orders so
                 JOIN suppliers s ON so.supplier_id = s.supplier_id
                 JOIN users u ON so.ordered_by_admin_id = u.user_id`;
    const params = [];
    if (supplierId) {
      query += ' WHERE so.supplier_id = ?';
      params.push(supplierId);
    } else if (adminId) {
      query += ' WHERE so.ordered_by_admin_id = ?';
      params.push(adminId);
    }
    query += ' ORDER BY so.order_date DESC';
    const [rows] = await pool.query(query, params);
    return rows;
  },

  async getById(supplierOrderId) {
    const [rows] = await pool.query(
      `SELECT * FROM supplier_orders WHERE supplier_order_id = ?`,
      [supplierOrderId]
    );
    return rows[0];
  },

  async create({ supplier_id, ordered_by_admin_id, notes }) {
    const [result] = await pool.query(
      `INSERT INTO supplier_orders (supplier_id, ordered_by_admin_id, notes) VALUES (?, ?, ?)`,
      [supplier_id, ordered_by_admin_id, notes || null]
    );
    return result.insertId;
  },

  async updateStatus(supplierOrderId, status) {
    const [result] = await pool.query(
      `UPDATE supplier_orders SET status = ? WHERE supplier_order_id = ?`,
      [status, supplierOrderId]
    );
    return result.affectedRows > 0;
  },

  async getActiveCount(supplierId) {
    const [rows] = await pool.query(
      `SELECT COUNT(*) as active FROM supplier_orders WHERE supplier_id = ? AND status = 'Pending'`,
      [supplierId]
    );
    return rows[0].active;
  },
  async getCompletedCount(supplierId) {
    const [rows] = await pool.query(
      `SELECT COUNT(*) as completed FROM supplier_orders WHERE supplier_id = ? AND status = 'Delivered'`,
      [supplierId]
    );
    return rows[0].completed;
  },
};

export default SupplierOrder; 