const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, "Name is required"], 
        trim: true 
    },
    email: { 
        type: String, 
        required: [true, "Email is required"], 
        unique: true,
        lowercase: true, 
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    phone: { 
        type: String, 
        required: [true, "Phone number is required"],
        trim: true,
        match: [/^[0-9]{10}$/, 'Please fill a valid 10-digit phone number']
    },
    address: {
        type: String,
        trim: true,
        default: "Not Provided" // Useful for laptop pick-up/drop-off services
    },
    password: { 
        type: String, 
        required: [true, "Password is required"] 
    }, 
    role: { 
        type: String, 
        enum: ['User', 'Admin', 'Staff'], // Added 'Staff' for more realism
        default: 'User' 
    },
    isActive: {
        type: Boolean,
        default: true // Allows you to "deactivate" accounts without deleting them
    },
    dateCreated: { 
        type: Date, 
        default: Date.now 
    }
}, {
    timestamps: true // Automatically adds 'createdAt' and 'updatedAt' fields
});

module.exports = mongoose.model('User', userSchema);