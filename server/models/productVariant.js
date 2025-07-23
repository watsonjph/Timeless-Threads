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

  async getBySku(sku) {
    const [rows] = await pool.query(
      `SELECT pv.*, p.name as product_name
       FROM product_variants pv
       JOIN products p ON pv.product_id = p.product_id
       WHERE pv.sku = ?`,
      [sku]
    );
    return rows[0];
  },

  async getLowStock() {
    try {
      const [rows] = await pool.query(
        `SELECT pv.*, p.name as product_name, pi.stock_quantity, pi.restock_threshold
         FROM product_variants pv
         JOIN products p ON pv.product_id = p.product_id
         JOIN product_inventory pi ON pv.variant_id = pi.variant_id
         WHERE pi.stock_quantity < pi.restock_threshold`
      );
      console.log('Low stock query executed successfully, found', rows.length, 'items');
      return rows;
    } catch (error) {
      console.error('Error in getLowStock:', error);
      throw error;
    }
  },

  async getStockByVariantId(variantId) {
    const [rows] = await pool.query(
      `SELECT stock_quantity FROM product_inventory WHERE variant_id = ?`,
      [variantId]
    );
    return rows[0]?.stock_quantity || 0;
  },

  async decrementStock(variantId, quantity) {
    const [result] = await pool.query(
      `UPDATE product_inventory 
       SET stock_quantity = stock_quantity - ? 
       WHERE variant_id = ? AND stock_quantity >= ?`,
      [quantity, variantId, quantity]
    );
    return result.affectedRows > 0;
  },

  async incrementStock(variantId, quantity) {
    const [result] = await pool.query(
      `UPDATE product_inventory SET stock_quantity = stock_quantity + ? WHERE variant_id = ?`,
      [quantity, variantId]
    );
    return result.affectedRows > 0;
  },
};

export default ProductVariant;
ProductVariant.pool = pool; 