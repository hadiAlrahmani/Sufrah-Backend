const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

dotenv.config();
require('./config/database');

// Auth
const verifyToken = require('./middleware/verify-token');

// Controllers
const usersRouter = require('./controllers/users');
const testJWTRouter = require('./controllers/test-jwt');
const restaurantRoutes = require('./routes/restaurantRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Public Routes
app.use('/test-jwt', testJWTRouter); // REMOVE FOR TEST ONLY
app.use('/auth', usersRouter);
app.use('/restaurants', restaurantRoutes);

// Protected Routes
app.use('/protected', verifyToken, (req, res) => {
  res.json({ message: "You have access to this protected route!", user: req.user });
});

app.listen(PORT, () => {
  console.log('The express app is ready on port', PORT);
});