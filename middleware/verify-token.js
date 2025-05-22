//! Protected Routes
// To protect routes, I use this middleware. It checks for a valid JWT token sent in the Authorization header. If the token is valid, it lets the user through. Otherwise, it blocks access. This makes sure only logged-in users can access private data like cart, orders, or admin features.
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization header missing or malformed' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT Error:', err);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = verifyToken;

//! CODE GRAVEYARD

// const jwt = require('jsonwebtoken'); // Import the jsonwebtoken library

// // Middleware to verify JWT token
// const verifyToken = (req, res, next) => {
//   try {
//     // Extract token from the Authorization header
//     const token = req.headers.authorization.split(' ')[1];

//     // Verify the token using the secret key
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Attach the decoded user information to the request object
//     req.user = decoded;

//     next(); // Proceed to the next middleware or route handler
//   } catch (err) {
//     // Handle invalid token error
//     res.status(401).json({ message: 'Invalid token' }); // Respond with an unauthorized status
//   }
// };

// module.exports = verifyToken; // Export the verifyToken middleware