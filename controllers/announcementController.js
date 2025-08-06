const { createAnnouncement, getAllAnnouncements } = require('../models/AnnouncementModel');

exports.addAnnouncement = async (req, res) => {
  try {
    const { title, type, description, image_url, pdf_url } = req.body;

    if (!title || !type || !description) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const allowedTypes = ['urgent', 'event', 'rule', 'update', 'new'];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ message: 'Invalid type' });
    }

    const newPost = await createAnnouncement({ title, type, description, image_url, pdf_url });
    res.status(201).json(newPost);
  } catch (err) {
    console.error('Error saving announcement:', err);
    res.status(500).json({ message: 'Failed to add announcement' });
  }
};

exports.getAnnouncements = async (req, res) => {
  try {
    const data = await getAllAnnouncements();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get announcements' });
  }
};
