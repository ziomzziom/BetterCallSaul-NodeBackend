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

exports.getAll = async (req, res) => {
  try {
    const offers = await Offer.find().exec();
    const now = new Date();
    offers.forEach((offer) => {
      const createdAt = new Date(offer.date);
      const daysSinceCreated = Math.round((now - createdAt) / (1000 * 60 * 60 * 24));
      offer.isNew = daysSinceCreated < 5 ? true : daysSinceCreated;
    });
    res.status(200).json(offers.map((offer) => ({ ...offer.toObject(), isNew: offer.isNew })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error getting all offers' });
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
      const now = new Date();
      offers.forEach((offer) => {
        const createdAt = new Date(offer.date);
        const daysSinceCreated = Math.round((now - createdAt) / (1000 * 60 * 60 * 24));
        offer.isNew = daysSinceCreated < 5 ? true : daysSinceCreated;
      });
      res.status(200).json(offers.map((offer) => ({ ...offer.toObject(), isNew: offer.isNew })));
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error getting offers' });
  }
};

exports.search = async (req, res) => {
  try {
    const { searchQuery, provinceId } = req.query;
    if (!searchQuery || !provinceId) {
      throw new Error('Search query and province ID are required');
    }

    const provinceName = provinces.find((province) => province.id === provinceId).name;
    const offers = await Offer.find({
      $or: [
        { title: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } },
        { 'location.province': provinceName },
      ],
    });

    if (!offers.length) {
      return res.status(404).json([]);
    }

    res.status(200).json(offers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
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