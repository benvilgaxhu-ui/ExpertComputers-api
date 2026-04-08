const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    device: { type: String, required: true },
    issue: { type: String, required: true },
    contact: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Add this
    status: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ServiceRequest', serviceSchema);