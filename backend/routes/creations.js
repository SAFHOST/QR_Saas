const express = require('express');
const { body, validationResult } = require('express-validator');
const Creation = require('../models/Creation');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all creations for user
router.get('/', auth, async (req, res) => {
try {
const creations = await Creation.find({ user: req.user._id })
.sort({ createdAt: -1 })
.limit(50);

res.json(creations);
} catch (error) {
console.error('Get creations error:', error);
res.status(500).json({ message: 'Server error' });
}
});

// Create new creation
router.post('/', [
auth,
body('type').isIn(['qr', 'barcode', 'business-card']),
body('name').notEmpty().trim()
], async (req, res) => {
try {
const errors = validationResult(req);
if (!errors.isEmpty()) {
return res.status(400).json({
message: 'Validation failed',
errors: errors.array()
});
}

const { type, name, content, previewUrl, svgContent, htmlContent, settings } = req.body;

// Check creation limits for free users
if (req.user.plan === 'free') {
const creationCount = await Creation.countDocuments({ user: req.user._id });
if (creationCount >= 10) {
return res.status(400).json({
message: 'Free plan limited to 10 creations. Upgrade to Pro for unlimited creations.'
});
}
}

const creation = new Creation({
user: req.user._id,
type,
name,
content,
previewUrl,
svgContent,
htmlContent,
settings
});

await creation.save();

res.status(201).json(creation);
} catch (error) {
console.error('Create creation error:', error);
res.status(500).json({ message: 'Server error' });
}
});

// Get single creation
router.get('/:id', auth, async (req, res) => {
try {
const creation = await Creation.findOne({
_id: req.params.id,
user: req.user._id
});

if (!creation) {
return res.status(404).json({ message: 'Creation not found' });
}

res.json(creation);
} catch (error) {
console.error('Get creation error:', error);
res.status(500).json({ message: 'Server error' });
}
});

// Update creation
router.put('/:id', [
auth,
body('name').optional().notEmpty().trim()
], async (req, res) => {
try {
const errors = validationResult(req);
if (!errors.isEmpty()) {
return res.status(400).json({
message: 'Validation failed',
errors: errors.array()
});
}

const creation = await Creation.findOne({
_id: req.params.id,
user: req.user._id
});

if (!creation) {
return res.status(404).json({ message: 'Creation not found' });
}

// Update allowed fields
if (req.body.name) creation.name = req.body.name;
if (req.body.settings) creation.settings = req.body.settings;

await creation.save();

res.json(creation);
} catch (error) {
console.error('Update creation error:', error);
res.status(500).json({ message: 'Server error' });
}
});

// Delete creation
router.delete('/:id', auth, async (req, res) => {
try {
const creation = await Creation.findOneAndDelete({
_id: req.params.id,
user: req.user._id
});

if (!creation) {
return res.status(404).json({ message: 'Creation not found' });
}

res.json({ message: 'Creation deleted successfully' });
} catch (error) {
console.error('Delete creation error:', error);
res.status(500).json({ message: 'Server error' });
}
});

// Track download
router.post('/:id/download', auth, async (req, res) => {
try {
// Reset monthly downloads if needed
req.user.resetMonthlyDownloadsIfNeeded();

// Check download limits for free users
if (req.user.plan === 'free' && req.user.downloadsThisMonth >= 5) {
return res.status(400).json({
message: 'Free plan limited to 5 downloads per month. Upgrade to Pro for unlimited downloads.'
});
}

const creation = await Creation.findOne({
_id: req.params.id,
user: req.user._id
});

if (!creation) {
return res.status(404).json({ message: 'Creation not found' });
}

// Update download counts
creation.downloadCount += 1;
await creation.save();

if (req.user.plan === 'free') {
req.user.downloadsThisMonth += 1;
await req.user.save();
}

res.json({
message: 'Download tracked',
downloadsThisMonth: req.user.downloadsThisMonth
});
} catch (error) {
console.error('Track download error:', error);
res.status(500).json({ message: 'Server error' });
}
});

module.exports = router;
