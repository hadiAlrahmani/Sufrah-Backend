const Order = require("../models/orderModel");

exports.getOrderStatistics = async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId;
    console.log('restaurantId:', restaurantId); // Log restaurantId to verify the parameter

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    // Set the start and end times for today and yesterday
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const endOfToday = new Date(today.setHours(23, 59, 59, 999));
    const startOfYesterday = new Date(yesterday.setHours(0, 0, 0, 0));
    const endOfYesterday = new Date(yesterday.setHours(23, 59, 59, 999));

    console.log('Start of Today:', startOfToday);
    console.log('End of Today:', endOfToday);
    console.log('Start of Yesterday:', startOfYesterday);
    console.log('End of Yesterday:', endOfYesterday);

    // Query to count today's orders
    const todayOrders = await Order.countDocuments({
      restaurant: restaurantId,
      createdAt: { $gte: startOfToday, $lte: endOfToday }
    });
    console.log('Today Orders Count:', todayOrders);

    // Query to count yesterday's orders
    const yesterdayOrders = await Order.countDocuments({
      restaurant: restaurantId,
      createdAt: { $gte: startOfYesterday, $lte: endOfYesterday }
    });
    console.log('Yesterday Orders Count:', yesterdayOrders);

    // Send response with the order statistics
    res.json({
      today: todayOrders,
      yesterday: yesterdayOrders,
    });
  } catch (err) {
    console.error('Error in getOrderStatistics:', err); // Log the error
    res.status(500).json({ message: 'An error occurred while fetching order statistics', error: err.message });
  }
};