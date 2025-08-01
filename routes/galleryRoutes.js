const express = require('express');
const router = express.Router();
const pool = require('../utils/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads/gallery exists
const uploadDir = path.join(__dirname, '..', 'uploads/gallery');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post('/upload-event', upload.array('assets'), async (req, res) => {
  try {
    console.log('req.body:', req.body);
    console.log('req.files:', req.files);

    const { title, eventType, place, eventDate } = req.body;
    if (!title || !eventType || !place || !eventDate || !req.files.length) {
      return res.status(400).json({ message: 'Missing required fields or files' });
    }

    const assets = req.files.map(file => file.filename);

    await pool.query(
      'INSERT INTO gallery_events (title, event_type, place, event_date, assets) VALUES ($1, $2, $3, $4, $5)',
      [title, eventType, place, eventDate, assets]
    );

    res.status(201).json({ message: 'Event uploaded successfully' });
  } catch (err) {
    console.error('Upload Event Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM gallery_events ORDER BY event_date DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching gallery events:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
