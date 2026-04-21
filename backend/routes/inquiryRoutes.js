const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');
const sendEmailAlert = require('../config/sendEmail'); // 🚀 IMPORT THE EMAIL UTILITY

/**
 * @desc    Public route to save customer message & trigger alert
 * @route   POST /api/inquiries
 */
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        // 1. Save the message to MongoDB
        const newInquiry = new Inquiry({
            name,
            email,
            phone,
            subject,
            message,
            date: new Date()
        });

        await newInquiry.save();

        // 🚀 2. TRIGGER EMAIL ALERT: Instant notification to both accounts
        await sendEmailAlert(
            `📬 NEW LEAD: ${subject || 'Website Inquiry'}`,
            `You have received a new message from the Expert Computers contact form!\n\n` +
            `--- CUSTOMER DETAILS ---\n` +
            `Name: ${name}\n` +
            `Phone: ${phone || 'Not provided'}\n` +
            `Email: ${email || 'Not provided'}\n\n` +
            `--- MESSAGE BODY ---\n` +
            `Subject: ${subject}\n` +
            `Message:\n${message}\n\n` +
            `Log into the Admin Hub to manage this lead.`
        );

        res.status(201).json({ message: "Success" });
    } catch (err) {
        console.error("Inquiry Route Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

/**
 * @desc    Admin route to get all messages
 * @route   GET /api/inquiries
 */
router.get('/', async (req, res) => {
    try {
        const inquiries = await Inquiry.find().sort({ date: -1 });
        res.json(inquiries);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @desc    Admin route to delete an inquiry
 * @route   DELETE /api/inquiries/:id
 */
router.delete('/:id', async (req, res) => {
    try {
        await Inquiry.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;