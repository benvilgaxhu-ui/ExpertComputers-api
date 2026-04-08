const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');

// Public route to save message
router.post('/', async (req, res) => {
    try {
        const newInquiry = new Inquiry(req.body);
        await newInquiry.save();
        res.status(201).json({ message: "Success" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin route to get messages
router.get('/', async (req, res) => {
    try {
        const inquiries = await Inquiry.find().sort({ date: -1 });
        res.json(inquiries);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin route to delete
router.delete('/:id', async (req, res) => {
    try {
        await Inquiry.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;