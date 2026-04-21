const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmailAlert = require('../config/sendEmail'); // 🚀 IMPORT THE EMAIL UTILITY

// 1. REGISTER: Create a new User account
router.post('/register', async (req, res) => {
    const { name, email, phone, password } = req.body;

    try {
        // Validation: Ensure all fields are present
        if (!name || !email || !phone || !password) {
            return res.status(400).json({ message: "Please fill all fields" });
        }

        // Check if user already exists
        let user = await User.findOne({ email: email.toLowerCase() });
        if (user) return res.status(400).json({ message: "Email already registered" });

        // Password Hashing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user (Role defaults to 'User' via the Model)
        user = new User({ 
            name, 
            email: email.toLowerCase(), 
            phone, 
            password: hashedPassword 
        });

        await user.save();

        // 🚀 TRIGGER EMAIL ALERT: Notify Admin of new registration
        await sendEmailAlert(
            `👤 NEW USER REGISTERED: ${name}`,
            `A new user has joined the Expert Computers platform!\n\n` +
            `--- USER DETAILS ---\n` +
            `Name: ${name}\n` +
            `Email: ${email.toLowerCase()}\n` +
            `Phone: ${phone}\n\n` +
            `You can now view this user in your Admin Control Hub database.`
        );

        res.status(201).json({ message: "Registration successful! You can now login." });
        
    } catch (err) {
        console.error("Reg Error:", err.message);
        res.status(500).json({ error: "Server error during registration" });
    }
});

// 2. LOGIN: Verify credentials and issue JWT "VIP Pass"
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(400).json({ message: "Invalid Email or Password" });

        // Compare Hashed Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid Email or Password" });

        // Generate JWT Token
        // Using a fallback secret if process.env.JWT_SECRET is missing
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET || 'expert_secret_key_123', 
            { expiresIn: '24h' }
        );

        // Send token and user info to frontend
        res.json({ 
            token, 
            user: { 
                id: user._id,
                name: user.name, 
                role: user.role,
                email: user.email 
            } 
        });

    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).json({ error: "Server error during login" });
    }
});

module.exports = router;