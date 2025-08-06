const express = require('express');
const router = express.Router();
const { addAnnouncement, getAnnouncements } = require('../controllers/announcementController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, addAnnouncement); // Admin creates
router.get('/', getAnnouncements); // Resident fetches

module.exports = router;
