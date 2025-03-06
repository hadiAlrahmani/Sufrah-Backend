const express = require('express'); // Import Express framework
const router = express.Router(); // Create an Express router instance
const usersController = require('../controllers/users'); // Import the users controller

// Route to retrieve all users
router.get('/', usersController.getAllUsers);

// Route to retrieve a specific user by their ID
router.get('/:id', usersController.getUserById);

module.exports = router; // Export the router for use in other modules