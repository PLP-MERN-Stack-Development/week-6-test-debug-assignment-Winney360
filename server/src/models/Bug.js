const mongoose = require('mongoose');

const bugSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  status: { type: String, enum: ['open', 'in-progress', 'resolved'], default: 'open' },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Bug', bugSchema);