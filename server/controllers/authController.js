import User from '../models/user.js';

const authController = {
  async register(req, res) {
    const { email, username, firstName, lastName, password } = req.body;
    if (!email || !username || !firstName || !lastName || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    try {
      const existing = await User.findByEmail(email);
      if (existing) {
        return res.status(409).json({ error: 'User already exists.' });
      }
      await User.create({ email, username, firstName, lastName, password });
      return res.status(201).json({ message: 'Registration successful.' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Registration failed.' });
    }
  },

  async login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    try {
      const user = await User.findByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid credentials.' });
      }
      // Return username and role for dashboard
      return res.status(200).json({ 
        message: 'Login successful.',
        username: user.username,
        role: user.role
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Login failed.' });
    }
  }
};

export default authController; 