// Imports
const Notification = require('../models/notificationModel'); 

// Get notifications for the logged-in user
const getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }); // Fetch notifications
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
};

// Mark notification as read
const markNotificationAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id); // Find notification by ID

        if (!notification) {
            return res.status(404).json({ error: "Notification not found" }); 
        }

        // Ensure he is the owner 
        if (notification.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        notification.read = true; // Mark as read
        await notification.save(); 

        res.status(200).json(notification); 
    } catch (error) {
        res.status(500).json({ error: "Failed to update notification status" }); 
    }
};

// Delete 
const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id); // Find notification by ID

        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' }); 
        }

        // Ensure he is the owner of the notification
        if (notification.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized' }); 
        }

        await notification.deleteOne(); // Delete notification
        res.status(200).json({ message: 'Notification deleted successfully' }); 
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete notification' }); 
    }
};

// Get a specific notification by ID
const getNotificationById = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id); // Find notification by ID

        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' }); 
        }

        res.status(200).json(notification); 
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch notification' }); 
    }
};

module.exports = {
    getUserNotifications,
    markNotificationAsRead,
    deleteNotification,
    getNotificationById
}; // Export all functions