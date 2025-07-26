const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const {
  getUserStats,
  getAllUsers,
  deleteUserById,
  getVisitorLogs,
} = require('../controllers/adminController');

const { getAllComplaints } = require('../controllers/chatController');
const { getBookingHistory } = require('../controllers/bookingAdminController');
const amenityRoutes = require('./amenityRoutes');

router.use(authMiddleware);

router.get('/user-stats', getUserStats);
router.get('/users', getAllUsers); // supports ?role=resident
router.delete('/users/:id', deleteUserById);
router.get('/complaints', getAllComplaints);
router.get('/visitor-logs', getVisitorLogs);
router.get('/bookings/history', getBookingHistory);
router.use('/amenities', amenityRoutes);

module.exports = router;
