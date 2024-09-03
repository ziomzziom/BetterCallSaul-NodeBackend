const User = require('../models/User');
const jwt = require('jsonwebtoken');

async function login(email, password) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isValid = await user.comparePassword(password);

  if (!isValid) {
    throw new Error('Invalid email or password');
  }

  // Generate a JWT token
  const token = jwt.sign({ userId: user._id, email: user.email }, process.env.SECRET_KEY, {
    expiresIn: '1h', // Token expires in 1 hour
  });

  return token;
}

module.exports = login;