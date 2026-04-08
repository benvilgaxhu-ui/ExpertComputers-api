const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Import Security Middleware
const { protect, adminOnly } = require('../middleware/authMiddleware');

// --- 1. MULTER CONFIGURATION ---
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|webp/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        if (extname) return cb(null, true);
        cb(new Error("Only images (jpeg, jpg, png, webp) are allowed!"));
    }
});

// --- 2. GET ALL PRODUCTS (Public) ---
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 }); 
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: "Could not retrieve products" });
    }
});

// --- 3. GET SINGLE PRODUCT (Public) ---
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: "Laptop not found" });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: "Invalid ID format or Database error" });
    }
});

// --- 4. POST: ADD NEW PRODUCT (Protected) ---
router.post('/', protect, adminOnly, upload.array('images', 5), async (req, res) => {
    try {
        const imagePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

        const newProduct = new Product({
            name: req.body.name,
            brand: req.body.brand,
            category: req.body.category, // 🚀 ADDED CATEGORY
            mrp: Number(req.body.mrp),    // Cast to Number for safety
            price: Number(req.body.price), // Cast to Number for safety
            description: req.body.description,
            images: imagePaths,
            sku: "EXP-" + Date.now() 
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
        console.log(`✅ Product Saved: ${savedProduct.name}`);
    } catch (err) {
        console.error("❌ DB Save Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// --- 5. PUT: UPDATE PRODUCT (Protected) ---
router.put('/:id', protect, adminOnly, upload.array('images', 10), async (req, res) => {
    try {
        // Prepare the update object
      const updateData = {
    name: req.body.name,
    brand: req.body.brand,
    category: req.body.category,
    // 🚀 If mrp has a value, turn it into a Number. If not, set it to null.
    mrp: req.body.mrp ? Number(req.body.mrp) : null, 
    price: Number(req.body.price),
    description: req.body.description,
};

        // If new images are uploaded, update the image array
        if (req.files && req.files.length > 0) {
            updateData.images = req.files.map(file => `/uploads/${file.filename}`);
        } 
        // If no new files, but images are sent as string/array (keeping old images)
        else if (req.body.images) {
            updateData.images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
        }

        // Use { new: true } to return the document AFTER the update
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id, 
            { $set: updateData }, 
            { new: true, runValidators: true } 
        );

        if (!updatedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }

        console.log(`🆙 Inventory Updated: ${updatedProduct.name} [${updatedProduct.category}]`);
        res.json(updatedProduct);
    } catch (err) {
        console.error("❌ Update Error:", err.message);
        res.status(500).json({ error: "Failed to update product" });
    }
});

// --- 6. DELETE PRODUCT (Protected) ---
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Delete failed" });
    }
});

module.exports = router;