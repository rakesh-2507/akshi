const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const {
  getUserStats,
  getAllUsers,
  deleteUserById,
  getVisitorLogs,
  getUnapprovedResidents,
  approveUserById,
} = require('../controllers/adminController');

const { getAllComplaints } = require('../controllers/chatController');
const { getBookingHistory } = require('../controllers/bookingAdminController');
const amenityRoutes = require('./amenityRoutes');

// Protect all routes with auth
router.use(authMiddleware);

// Admin APIs
router.get('/user-stats', getUserStats);
router.get('/users', getAllUsers); // supports ?role=resident
router.delete('/users/:id', deleteUserById);
router.get('/complaints', getAllComplaints);
router.get('/visitor-logs', getVisitorLogs);
router.get('/bookings/history', getBookingHistory);
router.use('/amenities', amenityRoutes);

// ✅ Resident approval APIs
router.get('/pending-residents', getUnapprovedResidents);
router.post('/approve-resident/:id', approveUserById);

module.exports = router;
