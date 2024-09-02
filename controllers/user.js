// controllers/user.js
const bcrypt = require('bcrypt');

async function createUser(firstName, lastName, email, password) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ firstName, lastName, email, password: hashedPassword });
    console.log(`User created successfully: ${user}`);
  } catch (error) {
    console.error(`Error creating user: ${error}`);
  }
}

module.exports = { createUser };