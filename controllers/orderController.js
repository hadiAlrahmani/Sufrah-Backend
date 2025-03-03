const Order = require('../models/orderModel');
const MenuItem = require('../models/menuItemModel');
const Notification = require('../models/notificationModel');

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

      await Notification.create({
        user: req.user._id,
        message: `Your order is now Pending!`,
        read: false
    });

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

        order.status = status;
        await order.save();

        await Notification.create({
          user: order.user,
          message: `UPDATE: Your order is now ${status}`
      });

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

//! CODE GRAVEYARD


// const createOrder = async (req, res) => {
//   try {
//     // console.log("Request Body:", req.body);

//       // User is attached to the order
//       const userId = req.user._id;

//       // Fetch menu items to calculate total price
//       const menuItems = await Promise.all(req.body.items.map(async (item) => {
//           const menuItem = await MenuItem.findById(item.menuItem);
//           return { menuItem, quantity: item.quantity };
//       }));

//       // Calculate total price
//       const totalPrice = menuItems.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);

//       // Create the order
//       const newOrder = await Order.create({
//           user: userId,
//           restaurant: req.body.restaurant,
//           items: req.body.items,
//           totalPrice: totalPrice,
//           status: 'Pending'
//       });

//      // console.log("New Order Created:", newOrder);

//       res.status(201).json(newOrder);
//   } catch (error) {
//      // console.error("Order Creation Failed:", error.message);
//       res.status(500).json({ error: 'Failed to create order', details: error.message });
//   }
// };
// This Graveyard create order done with the help of internet