const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verify-token");
const restaurantController = require("../controllers/restaurantController");
const isAdmin = require("../middleware/is-admin");

const {
  createRestaurant,
  getRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  getAdminRestaurants,
} = require("../controllers/restaurantController");

router.get("/admin", verifyToken, isAdmin, getAdminRestaurants);

// Public Routes
router.get("/", getRestaurants);
router.get("/:id", getRestaurantById);

// Protected Routes (Only Admins Can Create, Update, Delete)
router.post("/", verifyToken, isAdmin, createRestaurant);
router.put("/:id", verifyToken, isAdmin, updateRestaurant);
router.delete("/:id", verifyToken, isAdmin, deleteRestaurant);

module.exports = router;
