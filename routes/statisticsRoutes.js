const express = require("express");
const router = express.Router();
const { getOrderStatistics } = require("../controllers/statisticsController");
const verifyToken = require("../middleware/verify-token");
const isAdmin = require("../middleware/is-admin");

// Add logging to verify the imports
console.log('verifyToken:', verifyToken);
console.log('isAdmin:', isAdmin);
console.log('getOrderStatistics:', getOrderStatistics);

// Define route for order statistics with logging for debugging
router.get('/order-statistics/:restaurantId', verifyToken, isAdmin, getOrderStatistics);

module.exports = router;