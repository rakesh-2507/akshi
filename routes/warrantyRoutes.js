const express = require('express');
const router = express.Router();
const warrantyController = require('../controllers/warrantyController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ✅ Create uploads/warranty folder if not exists
const warrantyDir = path.join(__dirname, '..', 'uploads', 'warranty');
if (!fs.existsSync(warrantyDir)) {
  fs.mkdirSync(warrantyDir, { recursive: true });
}

// ✅ Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, warrantyDir),
  filename: (req, file, cb) => cb(null, Date.now() + '_' + file.originalname),
});
const upload = multer({ storage });

// ✅ Routes
router.get('/', warrantyController.getAllWarranties);
router.post('/', upload.single('image'), warrantyController.createWarranty);

module.exports = router;
