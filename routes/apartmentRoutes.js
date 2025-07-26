const express = require('express');
const router = express.Router();
const { getApartments } = require('../controllers/apartmentController');

router.get('/', getApartments);

module.exports = router;
