import express from 'express';
import authController from '../controllers/authController.js';
import User from '../models/user.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-email', authController.verifyEmail);
router.post('/reset-password', authController.resetPassword);
router.post('/update-email', authController.updateEmail);
router.post('/update-username', authController.updateUsername);
router.post('/update-password', authController.updatePassword);
router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json({ 
      email: user.email, 
      username: user.username,
      has_profile_pic: user.has_profile_pic,
      profile_pic_url: user.profile_pic_url
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user.' });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

router.post('/update-user-role', async (req, res) => {
  try {
    const { userId, newRole } = req.body;
    if (!userId || !newRole) {
      return res.status(400).json({ error: 'User ID and new role are required.' });
    }
    
    // Validate role
    const validRoles = ['user', 'supplier', 'admin'];
    if (!validRoles.includes(newRole.toLowerCase())) {
      return res.status(400).json({ error: 'Invalid role.' });
    }
    
    await User.updateRole(userId, newRole.toLowerCase());
    res.json({ message: 'User role updated successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user role.' });
  }
});

export default router; 