// Imports
const Order = require('../models/orderModel'); 
const MenuItem = require('../models/menuItemModel'); 
const Notification = require('../models/notificationModel');

//! Create a new order
// When the customer places an order, this function saves it to the database.
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
            const menuItem = await MenuItem.findById(item.menuItem); // Find menu item
            if (!menuItem) return res.status(404).json({ error: `MenuItem with ID ${item.menuItem} not found.` }); 

            totalPrice += menuItem.price * item.quantity; // Calculate total price
        }
// and sets the default status to "Pending".
        const order = await Order.create({
            user: req.user._id, 
            restaurant,
            items,
            totalPrice,
            status: 'Pending',
        });

        //It also creates a notification to let the user know their order is received.
        // Create notification for the user
        await Notification.create({
            user: req.user._id,
            message: `Your order is now Pending!`,
            read: false
        });

        res.status(201).json({
            ...order.toObject(),
            totalPriceFormatted: `${order.totalPrice} BD` // Add BD
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create order', details: error.message });
    }
};

// Get all orders (Admin only)
const getAllOrders = async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied. Admins only.' }); // Check for admin role

        const orders = await Order.find().populate('user', 'username').populate('restaurant', 'name'); // Fetch all orders
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' }); 
    }
};

// Get orders for the logged-in user
const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }) // Fetch user orders
            .populate("restaurant", "name")
            .populate({
                path: "items.menuItem",
                select: "name price",
            });

        res.status(200).json(orders); 
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user orders" }); 
    }
};

// Get a specific order by ID
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'username').populate('restaurant', 'name'); // Find order by ID

        if (!order) return res.status(404).json({ error: 'Order not found' }); 

        res.status(200).json(order); 
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch order' }); 
    }
};

// Update the status of an order
// Update the status of an order
const updateOrderStatus = async (req, res) => {
    try {
        // Check for admin role
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Admins only.' });
        }
        //  Admins can change the status of an order to “Being Made”, “Ready”, or “Rejected”. 
        const { status } = req.body;
        const allowedStatuses = ['Pending', 'Being Made', 'Ready', 'Rejected']; // "Rejected" added to allowed statuses

        // Check if the status is valid
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid order status.' });
        }

        // Find the order and update its status
        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });

        // Handle if the order is not found
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        // Every time the status is updated, a notification is sent to the customer to inform them of the change.
        // Create a notification for the user
        const notificationMessage = status === 'Being Made' 
            ? `Your order is now being prepared.` 
            : status === 'Rejected'
                ? `Sorry, your order has been rejected.`
                : `UPDATE: Your order is now ${status}`;
        
        await Notification.create({
            user: order.user,
            message: notificationMessage,
            read: false, // Ensure the notification is unread initially
        });

        // Return the updated order to the client
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update order status' });
    }
};

// So the real-time tracking happens by keeping the status of the order in the database and updating it as the restaurant processes it. The frontend then listens to these updates and shows the user the live status, along with a notification.

// Delete an order
const deleteOrder = async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied. Admins only.' }); // Check for admin role

        const order = await Order.findByIdAndDelete(req.params.id); // Delete order

        if (!order) return res.status(404).json({ error: 'Order not found' }); // Respond if not found

        res.status(200).json({ message: 'Order deleted successfully' }); // Respond with success message
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete order' }); 
    }
};

// Get orders for a specific restaurant (populated version)
const getRestaurantOrders = async (req, res) => {
    try {
      const restaurantId = req.params.id;
  
      const orders = await Order.find({ restaurant: restaurantId }); // Fetch orders for the specific restaurant
  
      res.status(200).json(orders); // Return the basic order details
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch restaurant orders' });
    }
  };

module.exports = {
    createOrder,
    getAllOrders,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder,
    getRestaurantOrders,
};