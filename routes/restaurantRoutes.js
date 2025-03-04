const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verify-token');
const isAdmin = require('../middleware/is-admin');
const {
  createRestaurant,
  getRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant
} = require('../controllers/restaurantController');

// Public Routes
router.get('/', getRestaurants);
router.get('/:id', getRestaurantById);

// Protected Routes (Only Admins can create, update, and delete restaurants)
router.post('/', verifyToken, isAdmin, createRestaurant);
router.put('/:id', verifyToken, isAdmin, updateRestaurant);
router.delete('/:id', verifyToken, isAdmin, deleteRestaurant);

module.exports = router;