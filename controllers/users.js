const express = require('express'); // Import express framework
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for token generation
const User = require('../models/userModel'); // Import User model

const router = express.Router(); // Create a new router

// User signup route
router.post('/signup', async (req, res) => {
  try {
    const { username, password, role } = req.body; // Destructure request body

    const existingUser = await User.findOne({ username }); // Check if username already exists
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists. Please try again.' }); // Error for existing username
    }

    const hashedPassword = bcrypt.hashSync(password, parseInt(process.env.SALT_ROUNDS)); // Hash the password

    const user = await User.create({
      username,
      hashedPassword,
      role: role || 'user' // Default role to 'user' if not provided
    });

    const token = jwt.sign(
      {
        _id: user._id,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET // Generate JWT token
    );

    return res.status(201).json({ user, token }); // Respond with created user and token
  } catch (error) {
    res.status(400).json({ error: 'Signup failed. Please try again.' }); // Handle signup errors
  }
});

// User signin route
router.post('/signin', async (req, res) => {
  try {
    const { username, password } = req.body; // Destructure request body

    const existingUser = await User.findOne({ username }); // Find user by username
    if (!existingUser) {
      return res.status(400).json({ error: 'Invalid Credentials' }); // Error if user not found
    }

    const isValidPassword = bcrypt.compareSync(password, existingUser.hashedPassword); // Compare passwords
    if (!isValidPassword) {
      throw Error('Invalid Credentials'); // Error for invalid password
    }

    const token = jwt.sign(
      {
        _id: existingUser._id,
        username: existingUser.username,
        role: existingUser.role
      },
      process.env.JWT_SECRET // Generate JWT token
    );

    return res.status(200).json({ user: existingUser, token }); // Respond with user and token
  } catch (error) {
    res.status(400).json({ error: 'Signin failed. Please try again.' }); // Handle signin errors
  }
});

// Get all users route
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-hashedPassword'); // Fetch users excluding hashedPassword
    res.status(200).json(users); // Respond with users
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' }); // Handle errors
  }
});

// Get a specific user by ID route
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-hashedPassword'); // Find user by ID

    if (!user) {
      return res.status(404).json({ error: 'User not found' }); // Respond if user not found
    }

    res.status(200).json(user); // Respond with the found user
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' }); // Handle errors
  }
});

module.exports = router; // Export the router