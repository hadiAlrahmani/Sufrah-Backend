const { Schema, model } = require('mongoose');

const restaurantSchema = new Schema({
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
}
}, { timestamps: true });

module.exports = model('Restaurant', restaurantSchema);