//! If Admin
// Some routes in Sufrah are only meant for admins like managing restaurants or orders. isAdmin checks if the user’s role is actually ‘admin’. If yes th eroute is allowed Otherwise its blocked for security.
const isAdmin = (req, res, next) => {
  try {
    console.log('User Role:', req.user?.role); // Log the role to verify
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }
    next();
  } catch (err) {
    console.error('Error in isAdmin:', err); // Log error if something goes wrong
    res.status(500).json({ message: 'Error checking admin privileges', error: err.message });
  }
};

module.exports = isAdmin;