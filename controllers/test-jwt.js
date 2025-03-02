const jwt = require('jsonwebtoken');
const express = require('express');

const router = express.Router();

const MOCK_USER = {
  _id: 1,
  username: 'test',
  password: 'test',
};

router.get('/sign-token', (req, res) => {
  const token = jwt.sign(MOCK_USER, process.env.JWT_SECRET);
  res.json({ token });
});

router.post('/verify-token', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new Error('Authorization header missing');

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    res.json({ decoded });
  } catch (err) {
    res.status(401).json({ message: err.message || 'Invalid token' });
  }
});

module.exports = router;