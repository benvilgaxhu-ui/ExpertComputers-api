const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');

// --- 1. INITIALIZE APP & CONFIG ---
dotenv.config();
const app = express();

// --- 2. MIDDLEWARE ---
app.use(cors({
    origin: 'https://expertcomputers.onrender.com', // Match your Render Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// --- 3. API ROUTES ---
// These MUST come before the static file serving logic
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes')); 
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/inquiries', require('./routes/inquiryRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// --- 4. SERVE REACT FRONTEND ---
/**
 * Using path.resolve ensures the path is absolute and correct across different 
 * environments (local vs. Render).
 */
const buildPath = path.resolve(__dirname, "../frontend/build");

// 1. Serve static files (js, css, images) from the build folder
app.use(express.static(buildPath));

// --- 5. CATCH-ALL ROUTE (The SPA Fix) ---
/**
 * For any GET request that does NOT match an API route or a static file,
 * send back the index.html file. React Router will then take over and 
 * load the correct component based on the URL.
 */
app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'), (err) => {
        if (err) {
            console.error("❌ index.html not found at:", path.join(buildPath, 'index.html'));
            res.status(500).send('<h1>ExpertComputers API is Live!</h1><p>Frontend build folder or index.html missing.</p>');
        }
    });
});

// --- 6. GLOBAL ERROR HANDLER ---
app.use((err, req, res, next) => {
    console.error("🔥 Full Server Error Info:", err); 
    res.status(500).json({ 
        error: "Internal Server Error", 
        message: err.message || "No error message provided" 
    });
});

// --- 7. DATABASE CONNECTION & START ---
const DB_URI = process.env.MONGO_URI || "mongodb://localhost:27017/expert_computers";

mongoose.connect(DB_URI)
    .then(() => {
        console.log("✅ Expert Computers Database Connected!");
        
        const PORT = process.env.PORT || 10000; 
        app.listen(PORT, () => {
            console.log(`🚀 Server Engine running on port ${PORT}`);
            console.log(`☁️ Cloudinary Inventory Management Active`);
            console.log(`📂 Serving static files from: ${buildPath}`);
        });
    })
    .catch(err => {
        console.error("❌ DB Connection Failed:", err.message);
        process.exit(1); 
    });