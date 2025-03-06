const mongoose = require('mongoose'); // Import Mongoose for MongoDB object modeling

// Define the schema for menu items
const menuItemSchema = new mongoose.Schema({
    restaurant: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the Restaurant model
        ref: 'Restaurant',
        required: true // This field is required
    },
    name: {
        type: String,
        required: true // This field is required
    },
    description: {
        type: String // Optional description field
    },
    price: {
        type: Number,
        required: true // This field is required
    },
    category: {
        type: String,
        enum: ['Appetizers', 'Main Course', 'Desserts', 'Drinks'], // Limited to specific categories
        required: true // This field is required
    }
}, { timestamps: true }); // Automatically manage createdAt and updatedAt fields

module.exports = mongoose.model('MenuItem', menuItemSchema); // Export the MenuItem model