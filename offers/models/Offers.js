const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: {
    name: { type: String, required: true },
  },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  vatInvoice: { type: Boolean, required: true },
  createdBy: {
    photo: { type: String },
    firstName: { type: String },
    lastName: { type: String },
  },
  price: { type: Number, required: true },
  status: { type: Number, required: true },
});

const Offer = mongoose.model('Offer', offerSchema);

module.exports = { Offer };