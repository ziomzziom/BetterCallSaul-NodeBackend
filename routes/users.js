// routes/users.js
const express = require('express');
const router = express.Router();
const { createUser } = require('../controllers/user');

router.post('/users', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  await createUser(firstName, lastName, email, password);
  res.send(`User created successfully!`);
});