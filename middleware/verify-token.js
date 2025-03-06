const jwt = require('jsonwebtoken'); // Import the jsonwebtoken library

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  try {
    // Extract token from the Authorization header
    const token = req.headers.authorization.split(' ')[1];

    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user information to the request object
    req.user = decoded;

    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    // Handle invalid token error
    res.status(401).json({ message: 'Invalid token' }); // Respond with an unauthorized status
  }
};

module.exports = verifyToken; // Export the verifyToken middleware