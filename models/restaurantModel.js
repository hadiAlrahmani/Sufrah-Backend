const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  location: {
    type: String, 
    required: true
  },
  openingHours: {
    type: String
  },
  isOpen: {
    type: Boolean,
    default: true
  },
  image: { 
    type: String, 
    required: true 
  },
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);