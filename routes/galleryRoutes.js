const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const pool = require('../utils/db');

const router = express.Router();

const uploadDir = path.join(__dirname, '..', 'uploads', 'gallery');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// Upload Image
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const imagePath = req.file.filename;
    await pool.query('INSERT INTO gallery (image_path) VALUES ($1)', [imagePath]);
    res.status(201).json({ message: 'Image uploaded', imagePath });
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Get All Images
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM gallery ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Fetch Error:', err);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

// Delete Image
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT image_path FROM gallery WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const imagePath = result.rows[0].image_path;
    const filePath = path.join(uploadDir, imagePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await pool.query('DELETE FROM gallery WHERE id = $1', [id]);
    res.json({ message: 'Image deleted' });
  } catch (err) {
    console.error('Delete Error:', err);
    res.status(500).json({ error: 'Delete failed' });
  }
});

module.exports = router;
