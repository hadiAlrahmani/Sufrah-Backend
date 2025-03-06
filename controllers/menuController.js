// Imports
const MenuItem = require('../models/menuItemModel');
const Restaurant = require('../models/restaurantModel');

const createMenuItem = async (req, res) => {
    try {
        const { restaurant, name, description, price, category } = req.body;

        // Check if the restaurant exists
        const restaurantExists = await Restaurant.findById(restaurant);
        if (!restaurantExists) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        // Create a new menu item
        const newMenuItem = await MenuItem.create({
            restaurant,
            name,
            description,
            price,
            category
        });

        res.status(201).json(newMenuItem);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create menu item', details: error.message });
    }
};

// Get all
const getMenuItemsByRestaurant = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const menuItems = await MenuItem.find({ restaurant: restaurantId }); // Find items by restaurant

        res.status(200).json(menuItems); 
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch menu items' }); 
    }
};

// Get specific
const getMenuItemById = async (req, res) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id); // Find item by ID

        if (!menuItem) {
            return res.status(404).json({ error: 'Menu item not found' }); 
        }

        res.status(200).json(menuItem); 
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch menu item' }); 
    }
};

// Get by category
const getMenuItemsByCategory = async (req, res) => {
    try {
        const category = req.params.category;
        const menuItems = await MenuItem.find({ category }); // Find items by category

        if (menuItems.length === 0) {
            return res.status(404).json({ message: 'No menu items found in this category' });
        }

        res.status(200).json(menuItems); 
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch menu items' }); 
    }
};

const updateMenuItem = async (req, res) => {
    try {
        const updatedMenuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true }); 

        if (!updatedMenuItem) {
            return res.status(404).json({ error: 'Menu item not found' });
        }

        res.status(200).json(updatedMenuItem);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update menu item' });
    }
};

const deleteMenuItem = async (req, res) => {
    try {
        const deletedMenuItem = await MenuItem.findByIdAndDelete(req.params.id);

        if (!deletedMenuItem) {
            return res.status(404).json({ error: 'Menu item not found' });
        }

        res.status(200).json({ message: 'Menu item deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete menu item' });
    }
};

module.exports = {
    createMenuItem,
    getMenuItemsByRestaurant,
    getMenuItemById,
    updateMenuItem,
    deleteMenuItem,
    getMenuItemsByCategory
};