const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const login = require('./controllers/login');
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

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: 'Please fill in all fields' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: 'Email already exists' });
  }

  const user = new User({ firstName, lastName, email, password });
  try {
    await user.save();
    console.log(`User created: ${user}`);
    res.json({ message: 'Registration successful!' });
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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