const User = require('../../models/User');
const bcrypt = require('bcrypt');

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
    // Login successful, return a JSON Web Token (JWT) or the user object
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.SECRET_KEY, { expiresIn: '1h' });
    return token;
  } catch (error) {
    throw new Error('Invalid email or password');
  }
}

module.exports = login;