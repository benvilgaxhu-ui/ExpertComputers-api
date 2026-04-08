const express = require('express');
const inquiryRoutes = require('./routes/inquiryRoutes');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const orderRoutes = require('./routes/orderRoutes');

// --- 1. INITIALIZE APP & CONFIG ---
dotenv.config();
const app = express();

// --- 2. MIDDLEWARE ---
app.use(cors()); // Bridges the gap between Frontend (3000) and Backend (5000)
app.use(express.json()); // Parses incoming JSON data
app.use(express.urlencoded({ extended: true })); // parses Form-Data for Multer/Images

// --- 3. STATIC FOLDER (Crucial for showing Uploaded Images) ---
// This makes http://localhost:5000/uploads/image.jpg accessible to React
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- 4. ROUTES (The Modules) ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/orders', orderRoutes);

// --- 5. GLOBAL ERROR HANDLER (Professional Touch) ---
app.use((err, req, res, next) => {
    console.error("🔥 Server Error:", err.stack);
    res.status(500).json({ error: "Something went wrong on the server!" });
});

// --- 6. DATABASE CONNECTION ---
// Make sure MONGO_URI is defined in your .env file
const DB_URI = process.env.MONGO_URI || "mongodb://localhost:27017/expert_computers";

mongoose.connect(DB_URI)
    .then(() => {
        console.log("✅ Expert Computers Database Connected!");
        
        // Start Server only AFTER DB connects
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`🚀 Server Engine running on port ${PORT}`);
            console.log(`📂 Static uploads served at: ${path.join(__dirname, 'uploads')}`);
        });
    })
    .catch(err => {
        console.error("❌ DB Connection Failed!");
        console.error("Reason:", err.message);
        process.exit(1); // Stop the app if DB fails
    });