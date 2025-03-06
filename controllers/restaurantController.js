const Restaurant = require("../models/restaurantModel"); // Import Restaurant model

// Create a new restaurant
const createRestaurant = async (req, res) => {
  try {
    // Ensure the user is an admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Only admins can create restaurants." });
    }

    const { name, description, location, openingHours, image } = req.body;

    // Validate required fields
    if (!name || !description || !location || !openingHours || !image) {
      return res.status(400).json({ error: "All fields, including image URL, are required." });
    }

    // Create new restaurant and set the admin user as the owner
    const newRestaurant = await Restaurant.create({
      name,
      description,
      location,
      openingHours,
      image,
      owner: req.user._id, // Assign admin as owner
    });

    res.status(201).json(newRestaurant); // Respond with the created restaurant
  } catch (error) {
    console.error("Error creating restaurant:", error);
    res.status(400).json({ error: "Failed to create restaurant", details: error.message }); // Handle errors
  }
};

// Get all restaurants
const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find(); // Fetch all restaurants
    res.status(200).json(restaurants); // Respond with the list of restaurants
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch restaurants" }); // Handle errors
  }
};

// Get a restaurant by ID
const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id); // Find restaurant by ID
    if (!restaurant)
      return res.status(404).json({ error: "Restaurant not found" }); // Respond if not found
    res.status(200).json(restaurant); // Respond with the found restaurant
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch restaurant" }); // Handle errors
  }
};

// Update a restaurant
const updateRestaurant = async (req, res) => {
  try {
    // Ensure the user is an admin
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Access denied. Admins only can update restaurants." });
    }

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Return the updated restaurant
    );
    if (!updatedRestaurant)
      return res.status(404).json({ error: "Restaurant not found" }); // Respond if not found
    res.status(200).json(updatedRestaurant); // Respond with the updated restaurant
  } catch (error) {
    res.status(400).json({ error: "Failed to update restaurant" }); // Handle errors
  }
};

// Delete a restaurant
const deleteRestaurant = async (req, res) => {
  try {
    // Ensure the user is an admin
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Access denied. Admins only can delete restaurants." });
    }

    const deletedRestaurant = await Restaurant.findByIdAndDelete(req.params.id); // Delete restaurant by ID
    if (!deletedRestaurant)
      return res.status(404).json({ error: "Restaurant not found" }); // Respond if not found
    res.status(200).json({ message: "Restaurant deleted successfully" }); // Respond with success message
  } catch (error) {
    res.status(500).json({ error: "Failed to delete restaurant" }); // Handle errors
  }
};

// Get all restaurants owned by the logged-in admin
const getAdminRestaurants = async (req, res) => {
  try {
    // Only return restaurants where the `owner` field matches the logged-in admin's ID
    const restaurants = await Restaurant.find({ owner: req.user._id });
    res.status(200).json(restaurants); // Respond with the admin's restaurants
  } catch (error) {
    console.error("Error fetching admin restaurants:", error);
    res.status(500).json({ error: "Failed to fetch admin restaurants" }); // Handle errors
  }
};

module.exports = {
  createRestaurant,
  getRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  getAdminRestaurants,
}; // Export all functions