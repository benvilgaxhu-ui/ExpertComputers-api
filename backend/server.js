const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const fs = require('fs');
const compression = require('compression');

// --- 1. INITIALIZE APP & CONFIG ---
dotenv.config();
const app = express();

// Enable Gzip compression to shrink file sizes and speed up loading
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
// API routes must stay at the top so Express doesn't try to serve them as static files
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes')); 
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/inquiries', require('./routes/inquiryRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// --- 4. SERVE REACT FRONTEND ---
/**
 * Root Directory is 'backend', so we go up one level (..) to find frontend/build.
 * We include maxAge caching so the browser doesn't have to re-download 
 * large JS/CSS files on every page refresh.
 */
const buildPath = path.resolve(__dirname, "../frontend/build");

app.use(express.static(buildPath, {
    maxAge: '1d', // Cache static assets for 1 day
    etag: true,    // Use etags for version control
    index: false   // Let the catch-all handle the index.html
}));

// --- 5. CATCH-ALL ROUTE (The SPA Fix) ---
/**
 * This ensures that if you refresh on /products or /services, 
 * the server sends index.html, allowing React Router to handle the URL.
 */
app.get('*', (req, res) => {
    const indexPath = path.join(buildPath, 'index.html');
    
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        console.error("🚨 index.html not found at:", indexPath);
        res.status(404).send(`
            <div style="text-align:center; margin-top:50px; font-family:sans-serif;">
                <h1>Frontend Build Missing</h1>
                <p>The server is looking in: <code>${indexPath}</code></p>
                <p>Check your Render Build Command: <code>npm install && cd ../frontend && npm install && npm run build</code></p>
            </div>
        `);
    }
});

// --- 6. GLOBAL ERROR HANDLER ---
app.use((err, req, res, next) => {
    console.error("🔥 Full Server Error Info:", err); 
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
            console.log(`🚀 Server Engine running on port ${PORT}`);
            console.log(`📂 Frontend Path: ${buildPath}`);
            console.log(`⚡ Compression & Caching Active`);
        });
    })
    .catch(err => {
        console.error("❌ DB Connection Failed:", err.message);
        process.exit(1); 
    });