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
      const user = await User.findByEmailOrUsername(email);
      if (!user || !(await User.comparePassword(password, user.password))) {
        return res.status(401).json({ error: 'Invalid credentials.' });
      }
      // Return username and role for dashboard
      return res.status(200).json({ 
        message: 'Login successful.',
        username: user.username,
        role: user.role,
        id: user.id
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Login failed.' });
    }
  },

  async updateEmail(req, res) {
    const { userId, newEmail } = req.body;
    if (!userId || !newEmail) {
      return res.status(400).json({ error: 'User ID and new email are required.' });
    }
    try {
      await User.updateEmail(userId, newEmail);
      return res.status(200).json({ message: 'Email updated successfully.' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to update email.' });
    }
  },

  async updateUsername(req, res) {
    const { userId, newUsername } = req.body;
    if (!userId || !newUsername) {
      return res.status(400).json({ error: 'User ID and new username are required.' });
    }
    try {
      await User.updateUsername(userId, newUsername);
      return res.status(200).json({ message: 'Username updated successfully.' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to update username.' });
    }
  },

  async updatePassword(req, res) {
    const { userId, currentPassword, newPassword } = req.body;
    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({ error: 'User ID, current password, and new password are required.' });
    }
    try {
      // Find user and check current password
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
      const isMatch = await User.comparePassword(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Current password is incorrect.' });
      }
      await User.updatePassword(userId, newPassword);
      return res.status(200).json({ message: 'Password updated successfully.' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message || 'Failed to update password.' });
    }
  },
};

export default authController; 