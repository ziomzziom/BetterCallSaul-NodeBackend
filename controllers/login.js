const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function login(email, password) {
  // Find the user by email
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Check if the password matches
  if (!(await user.comparePassword(password))) {
    throw new Error('Invalid email or password');
  }

  // Generate a JWT token
  const token = jwt.sign({ userId: user._id, email: user.email }, process.env.SECRET_KEY, {
    expiresIn: '1h', // Token expires in 1 hour
  });

  return token;
}

module.exports = login;