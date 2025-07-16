import pool from '../config/db.config.js';
import bcrypt from 'bcryptjs';

// Helper to sanitize input (basic, for demonstration)
function sanitize(input) {
  return String(input).replace(/['"\\;]/g, '');
}

const User = {
  async create({ email, username, firstName, lastName, password }) {
    const sanitizedEmail = sanitize(email);
    const sanitizedUsername = sanitize(username);
    const sanitizedFirstName = sanitize(firstName);
    const sanitizedLastName = sanitize(lastName);
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (email, username, firstName, lastName, password, role) VALUES (?, ?, ?, ?, ?, ?)',
      [sanitizedEmail, sanitizedUsername, sanitizedFirstName, sanitizedLastName, hashedPassword, 'User']
    );
    return result;
  },

  async findByEmail(email) {
    const sanitizedEmail = sanitize(email);
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [sanitizedEmail]
    );
    return rows[0];
  },

  async findByEmailOrUsername(identifier) {
    const sanitized = sanitize(identifier);
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ? OR username = ?',
      [sanitized, sanitized]
    );
    return rows[0];
  },

  async findById(id) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE user_id = ?',
      [id]
    );
    return rows[0];
  },

  async updateEmail(userId, newEmail) {
    const sanitizedEmail = sanitize(newEmail);
    const [result] = await pool.query(
      'UPDATE users SET email = ? WHERE user_id = ?',
      [sanitizedEmail, userId]
    );
    return result;
  },

  async updateUsername(userId, newUsername) {
    const sanitizedUsername = sanitize(newUsername);
    const [result] = await pool.query(
      'UPDATE users SET username = ? WHERE user_id = ?',
      [sanitizedUsername, userId]
    );
    return result;
  },

  async updatePassword(userId, newPassword) {
    // Password must be at least 8 chars and contain a number or special char
    if (!/^.{8,}$/.test(newPassword) || !/[^A-Za-z]/.test(newPassword)) {
      throw new Error('Password must be at least 8 characters and include a number or special character.');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const [result] = await pool.query(
      'UPDATE users SET password = ? WHERE user_id = ?',
      [hashedPassword, userId]
    );
    return result;
  },

  async comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
};

export default User;
