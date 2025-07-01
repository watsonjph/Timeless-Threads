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
      'INSERT INTO users (email, username, firstName, lastName, password) VALUES (?, ?, ?, ?, ?)',
      [sanitizedEmail, sanitizedUsername, sanitizedFirstName, sanitizedLastName, hashedPassword]
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

  async comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
};

export default User;
