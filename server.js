const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const login = require('./controllers/login');
const register = require('./controllers/register');
const User = require('./models/User');
const authenticate = require('./middleware/auth');

process.env.SECRET_KEY = 'my_secret_key_1234567890';

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/bettercallsaul', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB successfully!');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Initialize the Express app
const app = express();

const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// API endpoint to handle login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await login(email, password); // Call the login controller
    res.json({ token });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
});

// API endpoint to handle registration
app.post('/api/auth/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const result = await register(firstName, lastName, email, password); // Call the register controller
    res.json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// API endpoint to retrieve a list of users
app.get('/api/users', authenticate, async (req, res) => {
  try {
    const users = await User.find().exec();
    res.json(users);
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));