const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Import Security Middleware
const { protect, adminOnly } = require('../middleware/authMiddleware');

// --- 1. CLOUDINARY CONFIGURATION ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'expert_computers_inventory',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 1000, height: 800, crop: 'limit' }] 
  },
});

const upload = multer({ storage: storage });

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
// Note: 'images' matches the key used in your Frontend FormData
router.post('/', protect, adminOnly, upload.array('images', 5), async (req, res) => {
    try {
        // Cloudinary returns the full URL in file.path
        const imagePaths = req.files ? req.files.map(file => file.path) : [];

        const newProduct = new Product({
            name: req.body.name,
            brand: req.body.brand,
            category: req.body.category,
            mrp: req.body.mrp ? Number(req.body.mrp) : null,
            price: Number(req.body.price),
            description: req.body.description,
            images: imagePaths, // Permanent Cloudinary Links
            sku: "EXP-" + Date.now() 
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
        console.log(`✅ Product Saved to Cloud: ${savedProduct.name}`);
    } catch (err) {
        console.error("❌ Cloud Save Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// --- 5. PUT: UPDATE PRODUCT (Protected) ---
router.put('/:id', protect, adminOnly, upload.array('images', 10), async (req, res) => {
    try {
        const updateData = {
            name: req.body.name,
            brand: req.body.brand,
            category: req.body.category,
            mrp: req.body.mrp ? Number(req.body.mrp) : null, 
            price: Number(req.body.price),
            description: req.body.description,
        };

        // If new images are uploaded, use the new Cloudinary paths
        if (req.files && req.files.length > 0) {
            updateData.images = req.files.map(file => file.path);
        } 
        // Keep existing images if no new files are uploaded
        else if (req.body.images) {
            updateData.images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id, 
            { $set: updateData }, 
            { new: true, runValidators: true } 
        );

        if (!updatedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }

        console.log(`🆙 Cloud Inventory Updated: ${updatedProduct.name}`);
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
        res.json({ message: "Product deleted successfully from database" });
    } catch (err) {
        res.status(500).json({ error: "Delete failed" });
    }
});

module.exports = router;