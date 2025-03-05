const Notification = require('../models/notificationModel');

const getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
};

const markNotificationAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
  
      if (!notification) {
        return res.status(404).json({ error: "Notification not found" });
      }
  
      // Only allow the owner of the notification
      if (notification.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: "Unauthorized" });
      }
  
      notification.read = true;
      await notification.save();
  
      res.status(200).json(notification);
    } catch (error) {
      res.status(500).json({ error: "Failed to update notification status" });
    }
  };

const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        if (notification.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await notification.deleteOne();
        res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete notification' });
    }
};

const getNotificationById = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

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
};