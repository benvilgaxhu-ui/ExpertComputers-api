const express = require('express');
const router = express.Router();
const ServiceRequest = require('../models/ServiceRequest'); 
const sendEmailAlert = require('../config/sendEmail'); // 🚀 IMPORT THE EMAIL UTILITY

// Middleware imports
const { protect, adminOnly } = require('../middleware/authMiddleware');

/**
 * @route   POST /api/services
 * @desc    Submit a new repair/service request (User side)
 */
router.post('/', async (req, res) => {
    try {
        console.log("Data received from frontend:", req.body); 
        
        const newRequest = new ServiceRequest({
            ...req.body,
        });
        
        const savedRequest = await newRequest.save();

        // 🚀 TRIGGER EMAIL ALERT: Notification for New Repair Ticket
        await sendEmailAlert(
            `🔧 NEW REPAIR TICKET: ${savedRequest.device}`,
            `A customer has submitted a new repair request!\n\n` +
            `--- DEVICE INFO ---\n` +
            `Device: ${savedRequest.device}\n` +
            `Issue: ${savedRequest.issue}\n` +
            `Contact: ${savedRequest.contact || savedRequest.phone || 'N/A'}\n\n` +
            `Please check the Admin Control Hub to update the status.`
        );

        res.status(201).json(savedRequest);
    } catch (err) {
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
            { status: req.body.status }, // Update the status field (e.g., 'Fixed ✅')
            { new: true } 
        );

        if (!updatedRequest) {
            return res.status(404).json({ error: "Request not found" });
        }

        // 🚀 TRIGGER EMAIL ALERT: Notification for Status Change
        await sendEmailAlert(
            `🛠️ TICKET UPDATED: ${updatedRequest.device}`,
            `The status of a repair ticket has been updated.\n\n` +
            `Device: ${updatedRequest.device}\n` +
            `New Status: ${updatedRequest.status}\n\n` +
            `Action performed by Administrator.`
        );

        res.json(updatedRequest);
    } catch (err) {
        console.error("PUT Error:", err);
        res.status(500).json({ error: "Failed to update status" });
    }
});

/**
 * @route   DELETE /api/services/:id
 * @desc    Delete a service request (Admin side)
 */
router.delete('/:id', async (req, res) => {
    try {
        // Find the request first to get the device name for the email
        const requestToDelete = await ServiceRequest.findById(req.params.id);
        
        if (!requestToDelete) {
            return res.status(404).json({ error: "Request not found" });
        }

        const deviceName = requestToDelete.device;
        await ServiceRequest.findByIdAndDelete(req.params.id);

        // 🚀 TRIGGER EMAIL ALERT: Notification for Ticket Deletion
        await sendEmailAlert(
            `🗑️ TICKET DELETED: ${deviceName}`,
            `A repair ticket for "${deviceName}" has been permanently removed from the records.`
        );

        res.json({ message: "Request deleted successfully" });
    } catch (err) {
        console.error("DELETE Error:", err);
        res.status(500).json({ error: "Delete failed" });
    }
});

module.exports = router;