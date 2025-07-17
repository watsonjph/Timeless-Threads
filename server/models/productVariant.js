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
      `SELECT pv.*, p.name as product_name
       FROM product_variants pv
       JOIN products p ON pv.product_id = p.product_id
       WHERE pv.stock < 5`
    );
    return rows;
  },
};

export default ProductVariant; 