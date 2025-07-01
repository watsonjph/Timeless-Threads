import pool from '../config/db.config.js';

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
    const sanitizedPassword = sanitize(password);
    const [result] = await pool.query(
      'INSERT INTO users (email, username, firstName, lastName, password) VALUES (?, ?, ?, ?, ?)',
      [sanitizedEmail, sanitizedUsername, sanitizedFirstName, sanitizedLastName, sanitizedPassword]
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
  }
};

export default User; 