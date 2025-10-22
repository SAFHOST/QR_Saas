const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', [
body('email').isEmail().normalizeEmail(),
body('password').isLength({ min: 6 })
], async (req, res) => {
try {
const errors = validationResult(req);
if (!errors.isEmpty()) {
return res.status(400).json({
message: 'Validation failed',
errors: errors.array()
});
}

const { email, password } = req.body;

// Check if user exists
let user = await User.findOne({ email });
if (user) {
return res.status(400).json({ message: 'User already exists' });
}

// Create user
user = new User({ email, password });
await user.save();

// Generate token
const token = jwt.sign(
{ userId: user._id },
process.env.JWT_SECRET || 'fallback_secret',
{ expiresIn: '7d' }
);

res.status(201).json({
token,
user: {
id: user._id,
email: user.email,
plan: user.plan
}
});
} catch (error) {
console.error('Registration error:', error);
res.status(500).json({ message: 'Server error during registration' });
}
});

// Login
router.post('/login', [
body('email').isEmail().normalizeEmail(),
body('password').exists()
], async (req, res) => {
try {
const errors = validationResult(req);
if (!errors.isEmpty()) {
return res.status(400).json({
message: 'Validation failed',
errors: errors.array()
});
}

const { email, password } = req.body;

// Find user
const user = await User.findOne({ email });
if (!user) {
return res.status(400).json({ message: 'Invalid credentials' });
}

// Check password
const isMatch = await user.comparePassword(password);
if (!isMatch) {
return res.status(400).json({ message: 'Invalid credentials' });
}

// Generate token
const token = jwt.sign(
{ userId: user._id },
process.env.JWT_SECRET || 'fallback_secret',
{ expiresIn: '7d' }
);

res.json({
token,
user: {
id: user._id,
email: user.email,
plan: user.plan
}
});
} catch (error) {
console.error('Login error:', error);
res.status(500).json({ message: 'Server error during login' });
}
});

// Get current user
router.get('/me', auth, async (req, res) => {
try {
res.json({
id: req.user._id,
email: req.user.email,
plan: req.user.plan,
downloadsThisMonth: req.user.downloadsThisMonth
});
} catch (error) {
console.error('Get user error:', error);
res.status(500).json({ message: 'Server error' });
}
});

// Upgrade user plan
router.post('/upgrade', auth, async (req, res) => {
try {
const { plan } = req.body;

if (!['pro', 'team'].includes(plan)) {
return res.status(400).json({ message: 'Invalid plan' });
}

req.user.plan = plan;
await req.user.save();

res.json({
message: `Plan upgraded to ${plan}`,
user: {
id: req.user._id,
email: req.user.email,
plan: req.user.plan
}
});
} catch (error) {
console.error('Upgrade error:', error);
res.status(500).json({ message: 'Server error during upgrade' });
}
});

module.exports = router;
