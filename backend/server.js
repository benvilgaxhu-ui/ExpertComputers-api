const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

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
// Put all your /api routes BEFORE the static file serving logic
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes')); 
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/inquiries', require('./routes/inquiryRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use(express.static(path.join(__dirname, 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// --- 4. SERVE REACT FRONTEND (The SPA Fix) ---
/**
 * These lines tell Express to serve your React production build.
 * 'index.html' is the heart of your React app.
 */
const buildPath = path.join(__dirname, "../frontend/build");
app.use(express.static(buildPath));

// --- 5. CATCH-ALL ROUTE ---
/**
 * For any request that does NOT match an /api route above, 
 * send the React index.html. This allows React Router to handle 
 * direct links and page refreshes.
 */
app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'), (err) => {
        if (err) {
            // If the build isn't found yet, show the API status
            res.status(200).send('<h1>ExpertComputers API is Live!</h1><p>Frontend build not detected yet.</p>');
        }
    });
});

// --- 6. GLOBAL ERROR HANDLER ---
// backend/server.js - Update the error handler
app.use((err, req, res, next) => {
    // This will now print the FULL error details in your Render logs
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
        
        const PORT = process.env.PORT || 10000; // Render uses 10000 usually
        app.listen(PORT, () => {
            console.log(`🚀 Server Engine running on port ${PORT}`);
            console.log(`☁️ Cloudinary Inventory Management Active`);
        });
    })
    .catch(err => {
        console.error("❌ DB Connection Failed:", err.message);
        process.exit(1); 
    });