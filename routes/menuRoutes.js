const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const verifyToken = require('../middleware/verify-token');

router.post('/', verifyToken, menuController.createMenuItem);

router.get('/restaurant/:restaurantId', menuController.getMenuItemsByRestaurant);

router.get('/:id', menuController.getMenuItemById);

router.get('/category/:category', menuController.getMenuItemsByCategory);

router.put('/:id', verifyToken, menuController.updateMenuItem);

router.delete('/:id', verifyToken, menuController.deleteMenuItem);

module.exports = router;