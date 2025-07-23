import pool from '../config/db.config.js';
import bcrypt from 'bcrypt';

// Helper to sanitize input (basic, for demonstration)
function sanitize(input) {
  return String(input).replace(/['"\\;]/g, '');
}

const User = {
  async getAll() {
    const [rows] = await pool.query(
      `SELECT * FROM users ORDER BY createdAt DESC`
    );
    return rows;
  },

  async findById(userId) {
    const [rows] = await pool.query(
      `SELECT * FROM users WHERE user_id = ?`,
      [userId]
    );
    return rows[0];
  },

  async update(userId, { username, email }) {
    const [result] = await pool.query(
      `UPDATE users SET username = ?, email = ? WHERE user_id = ?`,
      [username, email, userId]
    );
    return result.affectedRows > 0;
  },

  async create({ email, username, password }) {
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      `INSERT INTO users (email, username, password, role) VALUES (?, ?, ?, 'user')`,
      [email, username, hashed]
    );
    return result.insertId;
  },

  async remove(userId) {
    const [result] = await pool.query(
      `DELETE FROM users WHERE user_id = ?`,
      [userId]
    );
    return result.affectedRows > 0;
  },

  async getTotal() {
    const [rows] = await pool.query(`SELECT COUNT(*) as total FROM users`);
    return rows[0].total;
  },

  async findByEmailOrUsername(identifier) {
    const sanitized = sanitize(identifier);
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ? OR username = ?',
      [sanitized, sanitized]
    );
    return rows[0];
  },

  async findByEmail(email) {
    const sanitized = sanitize(email);
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [sanitized]
    );
    return rows[0];
  },

  async comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  },

  async updateProfilePic(userId, profilePicUrl) {
    const [result] = await pool.query(
      `UPDATE users SET profile_pic_url = ?, has_profile_pic = 1 WHERE user_id = ?`,
      [profilePicUrl, userId]
    );
    return result.affectedRows > 0;
  },

  async updatePassword(userId, newPassword) {
    const hashed = await bcrypt.hash(newPassword, 10);
    const [result] = await pool.query(
      `UPDATE users SET password = ? WHERE user_id = ?`,
      [hashed, userId]
    );
    return result.affectedRows > 0;
  },

  async updateName(userId, firstName, lastName) {
    const [result] = await pool.query(
      `UPDATE users SET firstName = ?, lastName = ? WHERE user_id = ?`,
      [firstName, lastName, userId]
    );
    return result.affectedRows > 0;
  },
};

export default User;
