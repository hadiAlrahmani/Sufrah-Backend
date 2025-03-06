const express = require('express'); // Import Express framework
const router = express.Router(); // Create an Express router instance
const notificationController = require('../controllers/notificationController'); // Import notification controller
const verifyToken = require('../middleware/verify-token'); // Middleware for token verification

// Get user notifications (authentication required)
router.get('/', verifyToken, notificationController.getUserNotifications);

// Mark a notification as read (authentication required)
router.put('/:id/read', verifyToken, notificationController.markNotificationAsRead);

// Delete a notification by ID (authentication required)
router.delete('/:id', verifyToken, notificationController.deleteNotification);

// Get a specific notification by ID (authentication required)
router.get('/:id', verifyToken, notificationController.getNotificationById);

module.exports = router; // Export the router