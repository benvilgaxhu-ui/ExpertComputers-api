const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const fs = require('fs');
const compression = require('compression');
const buildPath = path.resolve(__dirname, "../frontend/build");

// --- 1. INITIALIZE APP & CONFIG ---
dotenv.config();
const app = express();

// Enable Gzip compression to make the site feel faster
app.use(compression());

// --- 2. MIDDLEWARE ---
app.use(cors({
    origin: 'https://expertcomputers.onrender.com', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// --- 3. API ROUTES ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes')); 
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/inquiries', require('./routes/inquiryRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// --- 4. SERVE REACT FRONTEND ---
/**
 * Root Directory is 'backend', so we go up one level (..) to find frontend/build.
 * We've added caching (maxAge) to improve performance and reduce lag.
 */
const buildPath = path.resolve(__dirname, "../frontend/build");

app.use(express.static(buildPath, {
    maxAge: '1d', // Browser will cache images/scripts for 1 day
    etag: true
}));

// --- 5. CATCH-ALL ROUTE (The SPA Fix) ---
app.get('*', (req, res) => {
    const indexPath = path.join(buildPath, 'index.html');
    
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        console.error("🚨 index.html not found at:", indexPath);
        res.status(404).send(`
            <div style="text-align:center; margin-top:50px; font-family:sans-serif;">
                <h1>Frontend Not Built Yet</h1>
                <p>The server is looking in: <code>${indexPath}</code></p>
                <p>Ensure your Render Build Command is: <code>npm install && cd ../frontend && npm install && npm run build</code></p>
            </div>
        `);
    }
});

// --- 6. GLOBAL ERROR HANDLER ---
app.use((err, req, res, next) => {
    console.error("🔥 Server Error:", err); 
    res.status(500).json({ 
        error: "Internal Server Error", 
        message: err.message || "No message provided" 
    });
});

// --- 7. DATABASE CONNECTION & START ---
const DB_URI = process.env.MONGO_URI || "mongodb://localhost:27017/expert_computers";

mongoose.connect(DB_URI)
    .then(() => {
        console.log("✅ Expert Computers Database Connected!");
        const PORT = process.env.PORT || 10000; 
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📂 Serving frontend from: ${buildPath}`);
        });
    })
    .catch(err => {
        console.error("❌ DB Connection Failed:", err.message);
        process.exit(1); 
    });