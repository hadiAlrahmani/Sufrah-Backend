const express = require('express'); // Import Express framework
const router = express.Router(); // Create an Express router instance
const menuController = require('../controllers/menuController'); // Import the menu controller
const verifyToken = require('../middleware/verify-token'); // Import token verification middleware

// Route to create a new menu item (requires authentication)
router.post('/', verifyToken, menuController.createMenuItem);

// Route to get menu items by restaurant ID
router.get('/restaurant/:restaurantId', menuController.getMenuItemsByRestaurant);

// Route to get a specific menu item by ID
router.get('/:id', menuController.getMenuItemById);

// Route to get menu items by category
router.get('/category/:category', menuController.getMenuItemsByCategory);

// Route to update a menu item by ID (requires authentication)
router.put('/:id', verifyToken, menuController.updateMenuItem);

// Route to delete a menu item by ID (requires authentication)
router.delete('/:id', verifyToken, menuController.deleteMenuItem);

module.exports = router; // Export the router for use in other modules