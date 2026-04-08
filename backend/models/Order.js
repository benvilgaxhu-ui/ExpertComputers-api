const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    phone: { type: String, required: true }, // Ensure this matches frontend 'phone'
    address: { type: String, required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, 
    productName: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);