const { Schema, model } = require('mongoose');

const menuItemSchema = new Schema({
    restaurant: {
        type: Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        enum: ['Appetizers', 'Main Course', 'Desserts', 'Drinks'],
        required: true
    }
}, { timestamps: true });

module.exports = model('MenuItem', menuItemSchema);