const express = require('express');
const router = express.Router();
const User = require('../models/User');

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

module.exports = router;
