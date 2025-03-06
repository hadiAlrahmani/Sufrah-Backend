// Middleware to check if the user has admin privileges
const isAdmin = (req, res, next) => {
  // Check if the user's role is not 'admin'
  if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' }); // Respond with access denied
  }
  next(); // Proceed to the next middleware or route handler if the user is an admin
};

module.exports = isAdmin; // Export the isAdmin middleware