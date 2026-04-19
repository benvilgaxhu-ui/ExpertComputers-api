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
  // ⚠️ Ensure this matches your EXACT frontend URL (single 's' or double 's')
  origin: 'https://expertcomputers.onrender.com', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.get('/', (req, res) => {
  res.send('<h1>ExpertComputers API is Live!</h1><p>Cloudinary Storage Active.</p>');
});

// --- 3. STATIC FOLDER (DEPRECATED FOR RENDER) ---
/** * Note: We are keeping this line for local testing, but new images 
 * will now load from https://res.cloudinary.com/... instead of here.
 */
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- 4. ROUTES ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes')); // Cloudinary logic is inside here
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/inquiries', require('./routes/inquiryRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// --- 5. GLOBAL ERROR HANDLER ---
app.use((err, req, res, next) => {
    console.error("🔥 Server Error:", err.stack);
    res.status(500).json({ error: "Something went wrong on the server!" });
});

// --- 6. DATABASE CONNECTION ---
const DB_URI = process.env.MONGO_URI || "mongodb://localhost:27017/expert_computers";

mongoose.connect(DB_URI)
    .then(() => {
        console.log("✅ Expert Computers Database Connected!");
        
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`🚀 Server Engine running on port ${PORT}`);
            console.log(`☁️ Cloudinary Inventory Management Active`);
        });
    })
    .catch(err => {
        console.error("❌ DB Connection Failed:", err.message);
        process.exit(1); 
    });