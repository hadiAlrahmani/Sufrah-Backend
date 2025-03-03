const { Schema, model } = require('mongoose');

const orderSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        restaurant: {
            type: Schema.Types.ObjectId,
            ref: 'Restaurant',
            required: true
        },
        items: [
            {
                menuItem: {
                    type: Schema.Types.ObjectId,
                    ref: 'MenuItem',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                }
            }
        ],
        totalPrice: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ['Pending', 'Being Made', 'Ready'],
            default: 'Pending'
        }
    },
    { timestamps: true }
);

module.exports = model('Order', orderSchema);