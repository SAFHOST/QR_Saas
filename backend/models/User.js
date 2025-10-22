const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
email: {
type: String,
required: true,
unique: true,
lowercase: true,
trim: true
},
password: {
type: String,
required: true,
minlength: 6
},
plan: {
type: String,
enum: ['free', 'pro', 'team'],
default: 'free'
},
subscriptionId: String,
downloadsThisMonth: {
type: Number,
default: 0
},
lastDownloadReset: {
type: Date,
default: Date.now
},
createdAt: {
type: Date,
default: Date.now
}
});

// Hash password before saving
userSchema.pre('save', async function(next) {
if (!this.isModified('password')) return next();

try {
const salt = await bcrypt.genSalt(10);
this.password = await bcrypt.hash(this.password, salt);
next();
} catch (error) {
next(error);
}
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
return bcrypt.compare(candidatePassword, this.password);
};

// Reset monthly downloads if it's a new month
userSchema.methods.resetMonthlyDownloadsIfNeeded = function() {
const now = new Date();
const lastReset = new Date(this.lastDownloadReset);

if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
this.downloadsThisMonth = 0;
this.lastDownloadReset = now;
return true;
}
return false;
};

module.exports = mongoose.model('User', userSchema);
