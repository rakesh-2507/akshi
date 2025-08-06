const AmenityModel = require('../models/AmenityModel');

exports.getAmenities = async (req, res) => {
  try {
    const amenities = await AmenityModel.getAll();
    res.json(amenities);
  } catch (err) {
    console.error('Error fetching amenities:', err);
    res.status(500).json({ message: 'Error fetching amenities' });
  }
};

exports.createAmenity = async (req, res) => {
  try {
    const {
      title,
      image_url,
      description,
      availability,
      timing,
      status,
      scalable
    } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const amenity = await AmenityModel.create({
      title,
      image_url,
      description,
      availability,
      timing,
      status,
      scalable
    });

    res.status(201).json(amenity);
  } catch (err) {
    console.error('Error creating amenity:', err);
    res.status(500).json({ message: 'Error creating amenity' });
  }
};
