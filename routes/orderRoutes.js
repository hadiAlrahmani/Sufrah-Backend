const express = require('express'); // Import Express framework
const router = express.Router(); // Create an Express router instance
const orderController = require('../controllers/orderController'); // Import order controller
const verifyToken = require('../middleware/verify-token'); // Middleware for token verification

// Create a new order (authentication required)
router.post('/', verifyToken, orderController.createOrder);

// Get all orders (admin only, authentication required)
router.get('/', verifyToken, orderController.getAllOrders);

// Get orders for the logged-in user (authentication required)
router.get('/my-orders', verifyToken, orderController.getUserOrders);

// Get a specific order by ID (authentication required)
router.get('/:id', verifyToken, orderController.getOrderById);

// Update the status of an order by ID (authentication required)
router.put('/:id', verifyToken, orderController.updateOrderStatus);

// Delete an order by ID (authentication required)
router.delete('/:id', verifyToken, orderController.deleteOrder);

module.exports = router; // Export the router