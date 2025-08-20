const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Test endpoint to create a simple user
router.post('/test-user', async (req, res) => {
  try {
    // Clear any existing test user
    await User.deleteOne({ email: 'admin@test.com' });
    
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const user = new User({
      name: 'Test Admin',
      email: 'admin@test.com',
      password: hashedPassword
    });
    
    await user.save();
    res.json({ success: true, message: 'Test user created', email: user.email });
  } catch (error) {
    console.error('Test user creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });
    user = new User({ name, email, password, role });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    const payload = { user: { id: user.id, role: user.role } };
    const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
    jwt.sign(payload, jwtSecret, { expiresIn: '7d' }, (err, token) => {
      if (err) {
        console.error('JWT signing error:', err);
        throw err;
      }
      res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log('Login attempt for email:', email);
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch for user:', email);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    
    const payload = { user: { id: user.id, role: user.role } };
    const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
    
    jwt.sign(payload, jwtSecret, { expiresIn: '7d' }, (err, token) => {
      if (err) {
        console.error('JWT signing error:', err);
        throw err;
      }
      console.log('Login successful for user:', email);
      res.json({ 
        token, 
        user: { 
          id: user.id, 
          name: user.name, 
          email: user.email,
          role: user.role 
        } 
      });
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;
