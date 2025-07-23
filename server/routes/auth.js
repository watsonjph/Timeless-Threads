import express from 'express';
import authController from '../controllers/authController.js';
import User from '../models/user.js';
import multer from 'multer';
import path from 'path';
import db from '../config/db.config.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-email', authController.verifyEmail);
router.post('/reset-password', authController.resetPassword);
router.post('/update-email', authController.updateEmail);
router.post('/update-username', authController.updateUsername);
router.post('/update-password', authController.updatePassword);
router.post('/update-name', authController.updateName);
router.post('/request-delete', authController.requestDelete);
router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json({ 
      email: user.email, 
      username: user.username,
      has_profile_pic: user.has_profile_pic,
      profile_pic_url: user.profile_pic_url,
      firstName: user.firstName,
      lastName: user.lastName
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user.' });
  }
});

// ADMIN USER CRUD ROUTES
// GET all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.getAll();
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});
// POST create user
router.post('/users', async (req, res) => {
  try {
    const id = await User.create(req.body);
    res.status(201).json({ id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create user.' });
  }
});
// PUT update user (username/email)
router.put('/users/:id', async (req, res) => {
  try {
    const updated = await User.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'User not found.' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user.' });
  }
});
// DELETE user
router.delete('/users/:id', async (req, res) => {
  try {
    const deleted = await User.remove(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'User not found.' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user.' });
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

// Multer setup for profile picture uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), 'server', 'uploads'));
  },
  filename: function (req, file, cb) {
    // Use userId and timestamp for uniqueness
    const userId = req.body.userId || req.query.userId || 'unknown';
    const ext = path.extname(file.originalname);
    cb(null, `profile_${userId}_${Date.now()}${ext}`);
  }
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

// Profile picture upload endpoint
router.post('/user/:id/profile-pic', upload.single('profilePic'), async (req, res) => {
  try {
    const userId = req.params.id;
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }
    // Save file path relative to /api/uploads
    const profilePicUrl = `/api/uploads/${req.file.filename}`;
    // Update user in DB
    await User.updateProfilePic(userId, profilePicUrl);
    res.json({ success: true, profile_pic_url: profilePicUrl });
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload profile picture.' });
  }
});

// Serve uploaded images statically
router.use('/uploads', express.static(path.join(process.cwd(), 'server', 'uploads')));

// Get all reviews by a user
router.get('/users/:userId/reviews', async (req, res) => {
  try {
    const { userId } = req.params;
    const [reviews] = await db.query(
      `SELECT r.*, p.name as product_name
       FROM product_reviews r
       LEFT JOIN products p ON r.product_id = p.product_id
       WHERE r.user_id = ?`,
      [userId]
    );
    res.json({ reviews });
  } catch (err) {
    console.error('Error in /users/:userId/reviews:', err);
    res.status(500).json({ error: 'Failed to fetch user reviews.' });
  }
});

export default router; 