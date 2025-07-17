import pool from '../config/db.config.js';

const Supplier = {
  async getAll() {
    const [rows] = await pool.query(
      `SELECT * FROM suppliers ORDER BY name ASC`
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

  async getByUserId(userId) {
    const [rows] = await pool.query(
      `SELECT * FROM suppliers WHERE user_id = ?`,
      [userId]
    );
    return rows[0];
  },

  async create(data) {
    const { name, contact_person, contact_email, contact_phone, street_address, city, province, postal_code } = data;
    const [result] = await pool.query(
      `INSERT INTO suppliers (name, contact_person, contact_email, contact_phone, street_address, city, province, postal_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, contact_person, contact_email, contact_phone, street_address, city, province, postal_code]
    );
    return result.insertId;
  },

  async update(supplierId, data) {
    const { name, contact_person, contact_email, contact_phone, street_address, city, province, postal_code } = data;
    const [result] = await pool.query(
      `UPDATE suppliers SET name=?, contact_person=?, contact_email=?, contact_phone=?, street_address=?, city=?, province=?, postal_code=? WHERE supplier_id=?`,
      [name, contact_person, contact_email, contact_phone, street_address, city, province, postal_code, supplierId]
    );
    return result.affectedRows > 0;
  },

  async remove(supplierId) {
    const [result] = await pool.query(
      `DELETE FROM suppliers WHERE supplier_id = ?`,
      [supplierId]
    );
    return result.affectedRows > 0;
  },
};

export default Supplier; 