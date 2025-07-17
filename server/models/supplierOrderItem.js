import pool from '../config/db.config.js';

const SupplierOrderItem = {
  async getBySupplierOrderId(supplierOrderId) {
    const [rows] = await pool.query(
      `SELECT soi.*, pv.size, pv.color, pv.sku, p.name as product_name
       FROM supplier_order_items soi
       JOIN product_variants pv ON soi.variant_id = pv.variant_id
       JOIN products p ON pv.product_id = p.product_id
       WHERE soi.supplier_order_id = ?`,
      [supplierOrderId]
    );
    return rows;
  },

  async create({ supplier_order_id, variant_id, quantity_ordered }) {
    const [result] = await pool.query(
      `INSERT INTO supplier_order_items (supplier_order_id, variant_id, quantity_ordered) VALUES (?, ?, ?)`,
      [supplier_order_id, variant_id, quantity_ordered]
    );
    return result.insertId;
  },
};

export default SupplierOrderItem; 