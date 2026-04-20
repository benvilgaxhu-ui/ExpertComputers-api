const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const fs = require('fs');

// --- 1. INITIALIZE APP & CONFIG ---
dotenv.config();
const app = express();

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
 * We define the path to the 'build' folder. 
 * On Render, this is usually ../frontend/build if your server is in a 'backend' folder.
 */
const buildPath = path.resolve(__dirname, "../frontend/build");

// Serve static assets (images, css, js)
app.use(express.static(buildPath));

// --- 5. CATCH-ALL ROUTE (The SPA Fix) ---
app.get('*', (req, res) => {
    const indexPath = path.join(buildPath, 'index.html');
    
    // Check if the file actually exists before trying to send it
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        // If we reach here, the 'npm run build' didn't run or the path is wrong
        console.error("🚨 ERROR: index.html not found at: " + indexPath);
        res.status(404).send(`
            <div style="font-family: sans-serif; padding: 20px;">
                <h1>Frontend Not Found</h1>
                <p>The server is looking for the build at: <code>${indexPath}</code></p>
                <p><strong>Solution:</strong> Ensure your Render Build Command includes <code>npm run build</code>.</p>
            </div>
        `);
    }
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
            console.log(`📂 Serving Frontend from: ${buildPath}`);
        });
    })
    .catch(err => {
        console.error("❌ DB Connection Failed:", err.message);
        process.exit(1); 
    });