import pool from '../config/db.config.js';

const Supplier = {
  async getAll() {
    const [rows] = await pool.query(
      `SELECT * FROM suppliers`
    );
    return rows;
  },

  async getById(supplierId) {
    const [rows] = await pool.query(
      `SELECT * FROM suppliers WHERE supplier_id = ?`,
      [supplierId]
    );
    return rows[0];
  },
};

export default Supplier; 