const sendEmailAlert = require('../config/sendEmail');
const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product'); 
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();


/**
 * @desc    Get all orders (Admin Only)
 * @route   GET /api/orders
 */
router.get('/', protect, async (req, res) => {
    try {
        const orders = await Order.find({}).populate('productId').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Server Error: Could not fetch orders" });
    }
});

/**
 * @desc    Submit new order with Server-Side Price Verification (Public)
 * @route   POST /api/orders
 */
router.post('/', async (req, res) => {
    try {
        const { customerName, phone, address, productId } = req.body;

        // 1. Check if frontend sent all data
        if (!customerName || !phone || !address || !productId) {
            return res.status(400).json({ 
                message: "Missing required fields: customerName, phone, address, or productId" 
            });
        }

        // 2. Fetch the Laptop from DB
        const product = await Product.findById(productId);
        
        if (!product) {
            return res.status(404).json({ message: "Product not found in database." });
        }

        // 3. 🛡️ SECURITY LOCK: Create order using DB values
        const productName = product.name || product.modelName || "Expert Laptop";
        const newOrder = new Order({ 
            customerName, 
            phone, 
            address, 
            productId: product._id, 
            productName: productName, 
            amount: product.price,                          
            status: 'Pending' 
        });

        const savedOrder = await newOrder.save();

        // 🚀 4. TRIGGER EMAIL ALERT (To both accounts via config/sendEmail.js)
        // We use await to ensure the attempt is made before sending the response
        await sendEmailAlert(
            `💰 NEW SALE: ${productName}`,
            `Great news! A new order has been placed on Expert Computers.\n\n` +
            `--- CUSTOMER DETAILS ---\n` +
            `Name: ${customerName}\n` +
            `Phone: ${phone}\n` +
            `Address: ${address}\n\n` +
            `--- PRODUCT DETAILS ---\n` +
            `Item: ${productName}\n` +
            `Price: ₹${product.price.toLocaleString('en-IN')}\n\n` +
            `Please log in to the Admin Control Hub to verify the payment and process the delivery.`
        );

        res.status(201).json(savedOrder);

    } catch (error) {
        console.error("Order Creation Logic Failure:", error.message);
        res.status(500).json({ 
            message: "Internal Server Error", 
            details: error.message 
        });
    }
});

/**
 * @desc    Update Order Status (Verify Payment) - Admin Only
 * @route   PUT /api/orders/:id
 */
router.put('/:id', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.status = req.body.status || 'Verified';
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Update failed: " + error.message });
    }
});

/**
 * @desc    Delete Order (Admin Only)
 * @route   DELETE /api/orders/:id
 */
router.delete('/:id', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            await order.deleteOne();
            res.json({ message: "Order deleted successfully" });
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Delete failed: " + error.message });
    }
});

module.exports = router;