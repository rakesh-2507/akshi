
const express = require('express');
const router = express.Router();
const {
  getAmenities,
  createAmenity
} = require('../controllers/amenityController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getAmenities);
router.post('/', authMiddleware, createAmenity);

module.exports = router;
