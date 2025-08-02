// routes/marketplaceRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { addItem, getAllItems } = require('../controllers/marketplaceController');
const authMiddleware = require('../middleware/authMiddleware');

const uploadDir = path.join(__dirname, '../uploads/marketplace');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  allowedTypes.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error('Only JPEG and PNG are allowed'), false);
};

const upload = multer({ storage, fileFilter });

router.post('/add', authMiddleware, upload.single('image'), addItem);
router.get('/', getAllItems);

module.exports = router;
