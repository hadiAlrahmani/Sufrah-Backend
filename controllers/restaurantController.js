const Restaurant = require("../models/restaurantModel");

const createRestaurant = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Access denied. Admins only can create restaurants." });
    }

    const newRestaurant = await Restaurant.create(req.body);
    res.status(201).json(newRestaurant);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Failed to create restaurant", details: error.message });
  }
};

const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch restaurants" });
  }
};

const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant)
      return res.status(404).json({ error: "Restaurant not found" });
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch restaurant" });
  }
};

const updateRestaurant = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Access denied. Admins only can update restaurants." });
    }

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedRestaurant)
      return res.status(404).json({ error: "Restaurant not found" });
    res.status(200).json(updatedRestaurant);
  } catch (error) {
    res.status(400).json({ error: "Failed to update restaurant" });
  }
};

const deleteRestaurant = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Access denied. Admins only can delete restaurants." });
    }

    const deletedRestaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!deletedRestaurant)
      return res.status(404).json({ error: "Restaurant not found" });
    res.status(200).json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete restaurant" });
  }
};

const getAdminRestaurants = async (req, res) => {
  try {
    // Only return restaurants where the `owner` field matches the logged-in admin's ID
    const restaurants = await Restaurant.find({ owner: req.user._id });

    res.status(200).json(restaurants);
  } catch (error) {
    console.error("Error fetching admin restaurants:", error);
    res.status(500).json({ error: "Failed to fetch admin restaurants" });
  }
};

module.exports = {
  createRestaurant,
  getRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  getAdminRestaurants,
};
