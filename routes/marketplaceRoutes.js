const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { addItem, getAllItems } = require('../controllers/marketplaceController');
const authMiddleware = require('../middleware/authMiddleware');

// Create upload directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads/marketplace');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const cleanName = file.originalname.replace(/\s+/g, '-');
    cb(null, `${timestamp}-${cleanName}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and JPG files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Routes
router.post('/add', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    await addItem(req, res);
  } catch (error) {
    console.error('Error in /marketplace/add route:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    await getAllItems(req, res);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

module.exports = router;
