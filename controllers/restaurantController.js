const Restaurant = require("../models/restaurantModel");
const MenuItem = require("../models/menuItemModel"); //  Import the MenuItem model

//! Create a new restaurant
// This function allows admins to add a new restaurant. It takes the data sent from the frontend, saves it to MongoDB, and sends back the created restaurant.
const createRestaurant = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Only admins can create restaurants." });
    }

    const { name, description, location, openingHours, image } = req.body;

    if (!name || !description || !location || !openingHours || !image) {
      return res.status(400).json({ error: "All fields, including image URL, are required." });
    }

    const newRestaurant = await Restaurant.create({
      name,
      description,
      location,
      openingHours,
      image,
      owner: req.user._id,
    });

    res.status(201).json(newRestaurant);
  } catch (error) {
    console.error("Error creating restaurant:", error);
    res.status(400).json({ error: "Failed to create restaurant", details: error.message });
  }
};

//! Get all restaurants
// This fetches all restaurants from the database. It’s used to display them on the homepage for users.
const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch restaurants" });
  }
};

// Get a restaurant by ID
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

//! Update a restaurant
// Admins can update restaurant details like name or hours. This uses the restaurant ID and new data to update it in MongoDB.
const updateRestaurant = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admins only can update restaurants." });
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

//! Delete a restaurant and all its related menu items
// This handles deleting a restaurant by its ID. It’s only available for admins.
const deleteRestaurant = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admins only can delete restaurants." });
    }

    const restaurantId = req.params.id;

    const deletedRestaurant = await Restaurant.findByIdAndDelete(restaurantId);
    if (!deletedRestaurant)
      return res.status(404).json({ error: "Restaurant not found" });

    // Delete all menu items related to this restaurant
    await MenuItem.deleteMany({ restaurant: restaurantId });

    res.status(200).json({ message: "Restaurant and its menu items deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete restaurant" });
  }
};

// Get all restaurants owned by the logged-in admin
const getAdminRestaurants = async (req, res) => {
  try {
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
  deleteRestaurant, //  updated
  getAdminRestaurants,
};