const Order = require('../models/orderModel');
const MenuItem = require('../models/menuItemModel');

const createOrder = async (req, res) => {
    try {
        const { restaurant, items } = req.body;

        // Check if items exist
        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'Order must contain at least one item.' });
        }

        let totalPrice = 0;

        // Calculate total amount
        for (let item of items) {
            const menuItem = await MenuItem.findById(item.menuItem);
            if (!menuItem) return res.status(404).json({ error: `MenuItem with ID ${item.menuItem} not found.` });

            totalPrice += menuItem.price * item.quantity;
        }

        const order = await Order.create({
            user: req.user._id,
            restaurant,
            items,
            totalPrice,
            status: 'Pending',
        });

        // Modify the response to include "BD" while keeping the TotalPrice datatype as a number
        res.status(201).json({
            ...order.toObject(),
            totalPriceFormatted: `${order.totalPrice} BD`
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create order', details: error.message });
    }
};

const getAllOrders = async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied. Admins only.' });

        const orders = await Order.find().populate('user', 'username').populate('restaurant', 'name');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate('restaurant', 'name');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user orders' });
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'username').populate('restaurant', 'name');

        if (!order) return res.status(404).json({ error: 'Order not found' });

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch order' });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied. Admins only.' });

        const { status } = req.body;
        const allowedStatuses = ['Pending', 'Being Made', 'Ready'];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid order status.' });
        }

        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });

        if (!order) return res.status(404).json({ error: 'Order not found' });

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update order status' });
    }
};

const deleteOrder = async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied. Admins only.' });

        const order = await Order.findByIdAndDelete(req.params.id);

        if (!order) return res.status(404).json({ error: 'Order not found' });

        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete order' });
    }
};

module.exports = {
    createOrder,
    getAllOrders,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder,
};