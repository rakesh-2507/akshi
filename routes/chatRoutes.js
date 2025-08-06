const express = require('express');
const router = express.Router();

const authenticateJWT = require('../middleware/authMiddleware');
const {
  raiseComplaint,
  getUserComplaints,
  getAllComplaints,
  markComplaintStatus,
} = require('../controllers/chatController');

router.post('/complaints', authenticateJWT, raiseComplaint);
router.get('/complaints', authenticateJWT, getUserComplaints);
router.get('/admin/complaints', authenticateJWT, getAllComplaints);
router.put('/admin/complaints/:id/status', authenticateJWT, markComplaintStatus);

module.exports = router;