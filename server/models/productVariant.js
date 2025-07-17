import pool from '../config/db.config.js';

const ProductVariant = {
  async getAll() {
    const [rows] = await pool.query(
      `SELECT pv.*, p.name as product_name
       FROM product_variants pv
       JOIN products p ON pv.product_id = p.product_id`
    );
    return rows;
  },

  async getById(variantId) {
    const [rows] = await pool.query(
      `SELECT pv.*, p.name as product_name
       FROM product_variants pv
       JOIN products p ON pv.product_id = p.product_id
       WHERE pv.variant_id = ?`,
      [variantId]
    );
    return rows[0];
  },

  async getLowStock() {
    const [rows] = await pool.query(
      `SELECT pv.*, p.name as product_name, pi.stock_quantity, pi.restock_threshold
       FROM product_variants pv
       JOIN products p ON pv.product_id = p.product_id
       JOIN product_inventory pi ON pv.variant_id = pi.variant_id
       WHERE pi.stock_quantity < pi.restock_threshold`
    );
    return rows;
  },
};

export default ProductVariant; 