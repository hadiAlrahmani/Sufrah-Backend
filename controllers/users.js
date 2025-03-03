const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists. Please try again.' });
    }

    const hashedPassword = bcrypt.hashSync(password, parseInt(process.env.SALT_ROUNDS));

    const user = await User.create({
      username,
      hashedPassword,
      role: role || 'user'
    });

    const token = jwt.sign(
      {
        _id: user._id,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET
    );

    return res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: 'Signup failed. Please try again.' });
  }
});

router.post('/signin', async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      return res.status(400).json({ error: 'Invalid Credentials' });
    }

    const isValidPassword = bcrypt.compareSync(password, existingUser.hashedPassword);
    if (!isValidPassword) {
      throw Error('Invalid Credentials');
    }

    const token = jwt.sign(
      {
        _id: existingUser._id,
        username: existingUser.username,
        role: existingUser.role
      },
      process.env.JWT_SECRET
    );

    return res.status(200).json({ user: existingUser, token });
  } catch (error) {
    res.status(400).json({ error: 'Signin failed. Please try again.' });
  }
});

router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-hashedPassword');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-hashedPassword');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

module.exports = router;
