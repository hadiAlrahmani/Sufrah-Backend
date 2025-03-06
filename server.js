const dotenv = require('dotenv'); // Load environment variables from .env file
const express = require('express'); // Import Express framework
const cors = require('cors'); // Enable Cross-Origin Resource Sharing
const morgan = require('morgan'); // HTTP request logger middleware

dotenv.config(); // Initialize dotenv configuration
require('./config/database'); // Set up database connection

// Import controllers and routes
const usersRouter = require('./controllers/users'); // User-related routes
const restaurantRoutes = require('./routes/restaurantRoutes'); // Restaurant-related routes
const menuRoutes = require('./routes/menuRoutes'); // Menu item-related routes
const orderRoutes = require('./routes/orderRoutes'); // Order-related routes
const notificationRoutes = require('./routes/notificationRoutes'); // Notification-related routes

const app = express(); // Create an Express application
const PORT = process.env.PORT || 3000; // Set the port to listen on

// Middleware setup
app.use(cors()); // Allow cross-origin requests
app.use(morgan('dev')); // Log HTTP requests in development mode
app.use(express.json()); // Parse incoming JSON requests

// Define application routes
app.use('/auth', usersRouter); // Authentication routes
app.use('/restaurants', restaurantRoutes); // Restaurant routes
app.use('/menuItems', menuRoutes); // Menu item routes
app.use('/orders', orderRoutes); // Order routes
app.use('/notifications', notificationRoutes); // Notification routes

// Start the server
app.listen(PORT, () => {
  console.log('The express app is ready on port', PORT); // Log that the server is running
});

//! CODE GRAVEYARD

// const testJWTRouter = require('./controllers/test-jwt');
// app.use('/test-jwt', testJWTRouter); // REMOVE FOR TEST ONLY

// app.use('/protected', verifyToken, (req, res) => {
//   res.json({ message: "You have access to this protected route!", user: req.user });
// });

// // Auth
// const verifyToken = require('./middleware/verify-token');