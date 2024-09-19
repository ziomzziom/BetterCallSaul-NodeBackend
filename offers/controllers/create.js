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
    const { query, province } = req.query;

    const queryObject = {};
    if (query) {
      queryObject.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ];
    }

    if (province) {
      queryObject['location.province'] = province;
    }

    const offers = await Offer.find(queryObject);

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
    const { searchQuery, provinceName } = req.query;

    const query = {};
    if (searchQuery) {
      query.$or = [
        { title: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } },
      ];
    }

    if (provinceName) {
      query['location.province'] = provinceName;
    }

    const offers = await Offer.find(query);

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