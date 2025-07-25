import User from '../models/user.js';
import { sendEmail } from '../utils/email.js';
import crypto from 'crypto';
import Supplier from '../models/supplier.js';

const pendingRegistrations = {};
const pendingPasswordResets = {};

const authController = {
  async register(req, res) {

    const { email, username, firstName, lastName, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ error: 'Email, username, and password are required.' });
    }
    try {
      const existing = await User.findByEmail(email);
      if (existing) {
        if (existing.is_deleted === 1) {
          // Reactivate and update the soft-deleted user
          await User.reactivateAndUpdateByEmail(email, { username, password, firstName, lastName });
          return res.status(200).json({ message: 'Account reactivated. You may now log in.' });
        } else {
          return res.status(409).json({ error: 'User already exists.' });
        }
      }
      if (pendingRegistrations[email] && Date.now() < pendingRegistrations[email].expiresAt) {
        return res.status(429).json({ error: 'A verification email has already been sent. Please check your inbox.' });
      }
      // Store pending registration with expiry
      pendingRegistrations[email] = {
        email, username, password,
        expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
      };
      const verifyUrl = `https://timelessthreads.xyz/verify-email?email=${encodeURIComponent(email)}`;
      await sendEmail({
        to: email,
        subject: 'Verify your email for Timeless Threads',
        text: `Hi, please verify your email by clicking this link: ${verifyUrl}`,
        html: `<p>Please verify your email by clicking <a href="${verifyUrl}">here</a>.</p>`
      });
      return res.status(200).json({ message: 'Verification email sent. Please check your inbox.' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to send verification email.' });
    }
  },

  async login(req, res) {
    const { email, password } = req.body;
    console.log('Login request received:', { email, password });

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    try {
      const user = await User.findByEmailOrUsername(email);
      console.log('User found:', user); 

      if (!user || !(await User.comparePassword(password, user.password))) {
        console.log('Invalid credentials');
        return res.status(401).json({ error: 'Invalid credentials.' });
      }
      if (user.is_deleted === 1) {
        return res.status(403).json({ error: 'Login Error: Account login is restricted' });
      }
      let supplierId = null;
      if (user.role === 'supplier') {
        const supplier = await Supplier.getByUserId(user.user_id);
        supplierId = supplier ? supplier.supplier_id : null;
      }
      // Return username and role for dashboard
      console.log('Login successful:', user.username);
      return res.status(200).json({ 
        message: 'Login successful.',
        username: user.username,
        role: user.role,
        id: user.user_id,
        supplierId
      });
    } catch (err) {
      console.error('Login error:', err);
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

  async forgotPassword(req, res) {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }
    try {
      const user = await User.findByEmail(email);
      if (!user) {
        // For security, always respond with success
        return res.status(200).json({ message: 'If an account with that email exists, a reset link has been sent.' });
      }
      // Store pending reset with expiry
      pendingPasswordResets[email] = {
        expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
      };
      const resetUrl = `https://timelessthreads.xyz/reset-password?email=${encodeURIComponent(email)}`;
      await sendEmail({
        to: email,
        subject: 'Password Reset Request',
        text: `Reset your password: ${resetUrl}`,
        html: `<p>Reset your password: <a href="${resetUrl}">Click here</a></p>`
      });
      return res.status(200).json({ message: 'If an account with that email exists, a reset link has been sent.' });
    } catch (err) {
      console.error('Error sending password reset email:', err);
      return res.status(500).json({ error: 'Failed to send reset email.' });
    }
  },

  async verifyEmail(req, res) {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }
    const entry = pendingRegistrations[email];
    if (!entry) {
      return res.status(400).json({ error: 'No pending registration found for this email.' });
    }
    if (Date.now() > entry.expiresAt) {
      delete pendingRegistrations[email];
      return res.status(400).json({ error: 'Verification link has expired. Please register again.' });
    }
    try {
      await User.create({
        email: entry.email,
        username: entry.username,
        password: entry.password
      });
      const user = await User.findByEmail(entry.email);
      delete pendingRegistrations[email];
      return res.status(201).json({
        message: 'Email verified and registration complete.',
        role: user.role,
        username: user.username,
        id: user.user_id
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to complete registration.' });
    }
  },

  async resetPassword(req, res) {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ error: 'Email and new password are required.' });
    }
    const entry = pendingPasswordResets[email];
    if (!entry) {
      return res.status(400).json({ error: 'No pending password reset for this email.' });
    }
    if (Date.now() > entry.expiresAt) {
      delete pendingPasswordResets[email];
      return res.status(400).json({ error: 'Password reset link has expired. Please request a new one.' });
    }
    try {
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
      await User.updatePassword(user.user_id, newPassword);
      delete pendingPasswordResets[email];
      return res.status(200).json({ message: 'Password reset successful! You may now log in.' });
    } catch (err) {
      console.error('Error resetting password:', err);
      return res.status(500).json({ error: 'Failed to reset password.' });
    }
  },

  async updateName(req, res) {
    const { userId, firstName, lastName } = req.body;
    if (!userId || !firstName || !lastName) {
      return res.status(400).json({ error: 'User ID, first name, and last name are required.' });
    }
    try {
      await User.updateName(userId, firstName, lastName);
      return res.status(200).json({ message: 'Name updated successfully.' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to update name.' });
    }
  },

  // Handle account deletion request (soft delete)
  async requestDelete(req, res) {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required.' });
    }
    try {
      const ok = await User.requestDelete(userId);
      if (!ok) return res.status(404).json({ error: 'User not found or already deleted.' });
      return res.status(200).json({ message: 'Account deletion requested.' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to request account deletion.' });
    }
  },
};

export default authController; 