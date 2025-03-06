const mongoose = require('mongoose'); // Import Mongoose for MongoDB object modeling

// Define the schema for orders
const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId, // Reference to the User model
            ref: 'User',
            required: true // This field is required
        },
        restaurant: {
            type: mongoose.Schema.Types.ObjectId, // Reference to the Restaurant model
            ref: 'Restaurant',
            required: true // This field is required
        },
        items: [
            {
                menuItem: {
                    type: mongoose.Schema.Types.ObjectId, // Reference to the MenuItem model
                    ref: 'MenuItem',
                    required: true // This field is required
                },
                quantity: {
                    type: Number,
                    required: true, // This field is required
                    min: 1 // Quantity must be at least 1
                }
            }
        ],
        totalPrice: {
            type: Number,
            required: true // This field is required
        },
        status: {
            type: String,
            enum: ['Pending', 'Being Made', 'Ready'], // Limited to specific statuses
            default: 'Pending' // Default status is 'Pending'
        }
    },
    { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

module.exports = mongoose.model('Order', orderSchema); // Export the Order model