const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/users/signup
// Body: { fullName, username, role, password }
// NOTE: Password is stored as plain text here for simplicity; use bcrypt in production.
router.post('/signup', async (req, res) => {
  try {
    const { fullName, username, role, password } = req.body || {};

    if (!fullName || !username || !role || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existing = await User.findOne({ username: username.trim() });
    if (existing) {
      return res.status(409).json({ error: 'Username is already taken' });
    }

    const user = new User({
      fullName: fullName.trim(),
      username: username.trim(),
      role,
      password, // Replace with hashed password in production
    });

    const saved = await user.save();

    return res.status(201).json({
      id: saved._id,
      fullName: saved.fullName,
      username: saved.username,
      role: saved.role,
      createdAt: saved.createdAt,
    });
  } catch (err) {
    console.error('Signup error:', err);
    // Handle duplicate key error defensively
    if (err && err.code === 11000) {
      return res.status(409).json({ error: 'Username is already taken' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/users/login
// Body: { username: string, password: string }
// NOTE: This is plain-text password comparison. For production, hash with bcrypt.
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = await User.findOne({ username: username.trim() });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Plain-text comparison (replace with bcrypt.compare in production)
    const isMatch = user.password === password;

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    return res.json({
      id: user._id,
      fullName: user.fullName,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/users
// List users (omit password in response)
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error('List users error:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// PUT /api/users/:id
// Update user fields (fullName, username, role, optionally password)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, username, role, password } = req.body || {};

    const update = {};
    if (fullName !== undefined) update.fullName = fullName.trim();
    if (username !== undefined) update.username = username.trim();
    if (role !== undefined) update.role = role;
    if (password !== undefined && password !== '') update.password = password; // hash in prod

    const updated = await User.findByIdAndUpdate(id, update, { new: true, runValidators: true, context: 'query' });
    if (!updated) return res.status(404).json({ error: 'User not found' });

    const { password: _, ...safe } = updated.toObject();
    res.json(safe);
  } catch (err) {
    console.error('Update user error:', err);
    if (err && err.code === 11000) {
      return res.status(409).json({ error: 'Username is already taken' });
    }
    res.status(400).json({ error: err.message || 'Failed to update user' });
  }
});

// DELETE /api/users/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
