const jwt = require('jsonwebtoken'); // Import jsonwebtoken library
const express = require('express'); // Import express framework

const router = express.Router(); // Create a new router

// Mock user for testing purposes
const MOCK_USER = {
  _id: 1,
  username: 'test',
  password: 'test',
};

// Route to sign a JWT token
router.get('/sign-token', (req, res) => {
  const token = jwt.sign(MOCK_USER, process.env.JWT_SECRET); // Sign the token using the mock user and secret
  res.json({ token }); // Respond with the generated token
});

// Route to verify a JWT token
router.post('/verify-token', (req, res) => {
  try {
    const authHeader = req.headers.authorization; // Get the authorization header
    if (!authHeader) throw new Error('Authorization header missing'); // Check if the header is present

    const token = authHeader.split(' ')[1]; // Extract the token from the header
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token

    res.json({ decoded }); // Respond with the decoded token data
  } catch (err) {
    res.status(401).json({ message: err.message || 'Invalid token' }); // Handle errors and respond with unauthorized status
  }
});

module.exports = router; // Export the router