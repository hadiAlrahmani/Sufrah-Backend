const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

dotenv.config();
require('./config/database');

// Controllers
const usersRouter = require('./controllers/users');
const restaurantRoutes = require('./routes/restaurantRoutes');
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/auth', usersRouter);
app.use('/restaurants', restaurantRoutes);
app.use('/menuItems', menuRoutes);
app.use('/orders', orderRoutes);
app.use('/notifications', notificationRoutes);


app.listen(PORT, () => {
  console.log('The express app is ready on port', PORT);
});


//! CODE GRAVEYARD

// const testJWTRouter = require('./controllers/test-jwt');
// app.use('/test-jwt', testJWTRouter); // REMOVE FOR TEST ONLY

// app.use('/protected', verifyToken, (req, res) => {
//   res.json({ message: "You have access to this protected route!", user: req.user });
// });

// // Auth
// const verifyToken = require('./middleware/verify-token');