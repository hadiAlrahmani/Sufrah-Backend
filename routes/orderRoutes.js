const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const verifyToken = require('../middleware/verify-token');

// Create Order (User Only)
router.post('/', verifyToken, orderController.createOrder);

// Get All Orders (Admin Only)
router.get('/', verifyToken, orderController.getAllOrders);

// Get User's Orders (For Logged-in Users)
router.get('/my-orders', verifyToken, orderController.getUserOrders);

router.get('/:id', verifyToken, orderController.getOrderById);

router.put('/:id', verifyToken, orderController.updateOrderStatus);

router.delete('/:id', verifyToken, orderController.deleteOrder);

module.exports = router;