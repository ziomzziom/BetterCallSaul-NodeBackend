const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true });

// Define the Offer schema
const offerSchema = new mongoose.Schema({
  title: String,
  court: String,
  date: Date,
  time: String,
  vatInvoice: Boolean,
  price: Number,
  createdBy: {
    firstName: String,
    lastName: String,
    photo: String
  },
  createdDate: Date,
  status: Number
});

// Create the Offer model
const Offer = mongoose.model('Offer', offerSchema);

// Initialize the Express app
const app = express();

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// API endpoints

// Get all offers
app.get('/api/offers', async (req, res) => {
  const offers = await Offer.find();
  res.json(offers);
});

// Get offer by ID
app.get('/api/offers/:id', async (req, res) => {
  const offer = await Offer.findById(req.params.id);
  res.json(offer);
});

// Create a new offer
app.post('/api/offers', async (req, res) => {
  const offer = new Offer(req.body);
  await offer.save();
  res.json(offer);
});

// Update an offer
app.put('/api/offers/:id', async (req, res) => {
  const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(offer);
});

// Delete an offer
app.delete('/api/offers/:id', async (req, res) => {
  await Offer.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));