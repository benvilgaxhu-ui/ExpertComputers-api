const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String },
    category: { type: String, required: true },
    mrp: { type: Number ,required: false},          // <--- THIS MUST BE HERE
    price: { type: Number, required: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    sku: { type: String, unique: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);