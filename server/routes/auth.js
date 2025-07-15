import express from 'express';
import authController from '../controllers/authController.js';
import User from '../models/user.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/update-email', authController.updateEmail);
router.post('/update-username', authController.updateUsername);
router.post('/update-password', authController.updatePassword);
router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json({ email: user.email, username: user.username });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user.' });
  }
});

export default router; 