const mongoose = require('mongoose'); // Import Mongoose for MongoDB object modeling

// Define the schema for restaurants
const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // This field is required
    unique: true // Restaurant names must be unique
  },
  description: {
    type: String // Optional description field
  },
  location: {
    type: String, 
    required: true // This field is required
  },
  openingHours: {
    type: String // Optional opening hours field
  },
  isOpen: {
    type: Boolean,
    default: true // Default value is true (open)
  },
  image: { 
    type: String, 
    required: true // This field is required
  },
  owner: { 
    type: mongoose.Schema.Types.ObjectId, // Reference to the User model for the owner
    ref: "User", 
    required: true // This field is required
  },
}, { timestamps: true }); // Automatically manage createdAt and updatedAt fields

module.exports = mongoose.model('Restaurant', restaurantSchema); // Export the Restaurant model