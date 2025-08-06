const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  bookAmenity,
  getMyBookings,
  cancelBooking,
} = require('../controllers/bookingController');

router.post('/bookings/amenities/:id', authMiddleware, bookAmenity);
router.get('/bookings/me', authMiddleware, getMyBookings);
router.delete('/bookings/:id', authMiddleware, cancelBooking);

module.exports = router;
