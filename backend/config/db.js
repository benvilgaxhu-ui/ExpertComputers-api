const mongoose = require('mongoose');

// Use your actual MongoDB URI string here or from .env
const connectDB = async () => {
    try {
        // REPLACE the string below with your actual MongoDB connection string if not using .env
        const conn = await mongoose.connect('YOUR_MONGODB_ATLAS_CONNECTION_STRING_HERE');
        
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1); // Stop the server if DB fails
    }
};

module.exports = connectDB;