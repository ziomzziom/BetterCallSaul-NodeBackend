const User = require('../models/User');

async function login(email, password) {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid email or password');
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('Invalid email or password');
    }
    // Login successful, return the user object or a token
  } catch (error) {
    throw new Error('Invalid email or password');
  }
}

module.exports = login;