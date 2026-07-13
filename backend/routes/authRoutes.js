const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Sign up - always creates a normal 'user' account (never admin)
router.post('/signup', async (req, res) => {
  try {
    let { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }
    username = username.trim().toLowerCase();
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(409).json({ message: 'That username is already taken.' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashed, role: 'user' });

    res.status(201).json({ message: 'Account created. You can now log in.', username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong while signing up.' });
  }
});

// Login - works for both users and admin (role comes from the database)
router.post('/login', async (req, res) => {
  try {
    let { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }
    username = username.trim().toLowerCase();

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      username: user.username,
      role: user.role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong while logging in.' });
  }
});

module.exports = router;