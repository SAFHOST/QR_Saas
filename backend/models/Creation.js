const mongoose = require('mongoose');

const creationSchema = new mongoose.Schema({
user: {
type: mongoose.Schema.Types.ObjectId,
ref: 'User',
required: true
},
type: {
type: String,
enum: ['qr', 'barcode', 'business-card'],
required: true
},
name: {
type: String,
required: true,
trim: true
},
content: mongoose.Schema.Types.Mixed, // Can be string or object
previewUrl: String, // Base64 encoded preview image
svgContent: String, // For barcodes
htmlContent: String, // For business cards
settings: mongoose.Schema.Types.Mixed, // Generation settings
downloadCount: {
type: Number,
default: 0
},
createdAt: {
type: Date,
default: Date.now
}
});

// Index for faster queries
creationSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Creation', creationSchema);
