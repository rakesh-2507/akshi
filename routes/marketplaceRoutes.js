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
  console.log('📁 Created upload directory:', uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post('/add', authMiddleware, upload.single('image'), addItem);
router.get('/', getAllItems);

module.exports = router;
