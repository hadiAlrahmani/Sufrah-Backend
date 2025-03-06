const mongoose = require('mongoose'); // Import Mongoose for MongoDB object modeling

// Define the schema for notifications
const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User model
        ref: 'User',
        required: true // This field is required
    },
    message: {
        type: String,
        required: true // This field is required
    },
    read: {
        type: Boolean,
        default: false // Default value for read status
    }
}, { timestamps: true }); // Automatically manage createdAt and updatedAt fields

module.exports = mongoose.model('Notification', notificationSchema); // Export the Notification model