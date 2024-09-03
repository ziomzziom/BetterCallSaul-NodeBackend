const User = require('../models/User');

async function register(firstName, lastName, email, password) {
  // Input validation
  if (!firstName || !lastName || !email || !password) {
    throw new Error('Please fill in all fields');
  }

  // Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Email already exists');
  }

  // Create new user
  const user = new User({ firstName, lastName, email, password });

  try {
    // Save user to database
    await user.save();
    return { message: 'Registration successful!' };
  } catch (error) {
    console.error('Error saving user:', error);
    throw new Error('Internal Server Error');
  }
}

module.exports = register;