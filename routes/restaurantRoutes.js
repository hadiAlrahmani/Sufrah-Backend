const express = require("express"); // Import Express framework
const router = express.Router(); // Create an Express router instance
const verifyToken = require("../middleware/verify-token"); // Middleware for token verification
const restaurantController = require("../controllers/restaurantController"); // Import restaurant controller
const isAdmin = require("../middleware/is-admin"); // Middleware to check if the user is an admin

const {
  createRestaurant,
  getRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  getAdminRestaurants,
} = require("../controllers/restaurantController");

// Get restaurants for admin (authentication and admin check required)
router.get("/admin", verifyToken, isAdmin, getAdminRestaurants);

// Public Routes
router.get("/", getRestaurants); // Get all restaurants
router.get("/:id", getRestaurantById); // Get a specific restaurant by ID

// Protected Routes (Only Admins Can Create, Update, Delete)
router.post("/", verifyToken, isAdmin, createRestaurant); // Create a new restaurant
router.put("/:id", verifyToken, isAdmin, updateRestaurant); // Update a restaurant by ID
router.delete("/:id", verifyToken, isAdmin, deleteRestaurant); // Delete a restaurant by ID

module.exports = router; // Export the router