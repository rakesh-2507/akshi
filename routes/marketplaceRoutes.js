const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { addItem, getAllItems } = require('../controllers/marketplaceController');
const authMiddleware = require('../middleware/authMiddleware');

// ✅ Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads/marketplace');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

// ✅ Optional: Accept only image files
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG and PNG are allowed.'), false);
  }
};

const upload = multer({ storage, fileFilter });

// ✅ Routes
router.post('/add', authMiddleware, upload.single('image'), addItem);
router.get('/', getAllItems);

module.exports = router;
