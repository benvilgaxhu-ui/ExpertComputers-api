const express = require('express');
const router = express.Router();
const ServiceRequest = require('../models/ServiceRequest'); 

// Middleware imports (kept for your report, but bypassed for now)
const { protect, adminOnly } = require('../middleware/authMiddleware');

/**
 * @route   POST /api/services
 * @desc    Submit a new repair/service request (User side)
 */
router.post('/', async (req, res) => {
    try {
        console.log("Data received from frontend:", req.body); // Log to see what arrived
        
        const newRequest = new ServiceRequest({
            ...req.body,
        });
        
        const savedRequest = await newRequest.save();
        res.status(201).json(savedRequest);
    } catch (err) {
        // This part is crucial for debugging Mongoose
        if (err.name === 'ValidationError') {
            console.error("Mongoose Validation Error:", err.message);
            return res.status(400).json({ 
                error: "Validation failed", 
                details: err.errors 
            });
        }
        
        console.error("POST Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

/**
 * @route   GET /api/services/admin/all
 * @desc    Fetch all requests (Admin side)
 */
router.get('/admin/all', async (req, res) => {
    try {
        // Sort by newest first (-1)
        const requests = await ServiceRequest.find().sort({ createdAt: -1 });
        res.json(requests);
    } catch (err) {
        console.error("GET Error:", err);
        res.status(500).json({ error: "Failed to fetch requests" });
    }
});

/**
 * @route   PUT /api/services/:id
 * @desc    Update status of a request (Admin side)
 */
router.put('/:id', async (req, res) => {
    try {
        const updatedRequest = await ServiceRequest.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status }, // Update the status field
            { new: true } // Returns the newly updated document
        );
        res.json(updatedRequest);
    } catch (err) {
        console.error("PUT Error:", err);
        res.status(500).json({ error: "Failed to update status" });
    }
});
// DELETE a service request
router.delete('/:id', async (req, res) => {
    try {
        await ServiceRequest.findByIdAndDelete(req.params.id);
        res.json({ message: "Request deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Delete failed" });
    }
});

module.exports = router;