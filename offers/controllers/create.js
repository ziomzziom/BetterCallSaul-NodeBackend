const { Offer } = require('../models/Offers');

exports.create = async (req, res) => {
  try {
    const {
      title,
      location,
      date,
      time,
      vatInvoice,
      createdBy,
      price,
      status,
    } = req.body;

    const offer = new Offer({
      title,
      location: { name: location.name },
      date,
      time,
      vatInvoice,
      createdBy: {
        photo: createdBy.photo,
        firstName: createdBy.firstName,
        lastName: createdBy.lastName,
      },
      price,
      status,
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
  
  exports.getOne = async (req, res) => {
    try {
      const id = req.params.id;
      const offer = await Offer.findById(id).exec();
      if (!offer) {
        res.status(404).json({ message: 'Offer not found' });
      } else {
        res.status(200).json(offer);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error getting offer' });
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