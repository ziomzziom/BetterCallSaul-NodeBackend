const { Offer } = require('../models/Offers');

exports.create = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      time,
      vatInvoice,
      createdBy,
      price,
      status,
      location,
    } = req.body;

    if (!location || !location.city || !location.street || !location.postalCode || !location.province) {
      return res.status(400).json({ message: 'Location is required' });
    }

    const { city, street, postalCode, province } = location;

    // Geocode the location using Nominatim API
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?city=${city}&street=${street}&postalcode=${postalCode}&format=json`;
    const response = await fetch(nominatimUrl);
    const data = await response.json();
    const lat = data[0].lat;
    const lon = data[0].lon;

    const offer = new Offer({
      title,
      location,
      date,
      time,
      vatInvoice,
      createdBy,
      price,
      status,
      coordinates: {
        latitude: lat,
        longitude: lon,
      },
    });

    await offer.save();
    res.status(201).json({ message: 'Offer created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating offer' });
  }
};

exports.getAll = async (req, res) => {
  try {
    const offers = await Offer.find().exec();
    res.status(200).json(offers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error getting all offers' });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const offer = await Offer.findByIdAndUpdate(id, req.body, { new: true }).exec();
    if (!offer) {
      res.status(404).json({ message: 'Offer not found' });
    } else {
      res.status(200).json(offer);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating offer' });
  }
};

exports.getOne = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Query parameter is required' });
    }

    const offers = await Offer.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { 'location.province': { $regex: query, $options: 'i' } },
      ],
    });

    if (!offers.length) {
      res.status(404).json({ message: 'No offers found' });
    } else {
      res.status(200).json(offers);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error getting offers' });
  }
};

exports.search = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Query parameter is required' });
    }

    const offers = await Offer.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { 'location.province': { $regex: query, $options: 'i' } },
      ],
    });

    res.status(200).json(offers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error searching offers' });
  }
};

exports.deleteOffer = async (req, res) => {
  try {
    const id = req.params.id;
    await Offer.findByIdAndRemove(id).exec();
    res.status(200).json({ message: 'Offer deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting offer' });
  }
};