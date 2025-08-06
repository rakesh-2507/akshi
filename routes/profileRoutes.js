const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

// Import the middleware correctly
const authenticateToken = require('../middleware/authMiddleware');

// Routes protected by JWT token middleware
router.post('/family', authenticateToken, profileController.addFamily);
router.post('/daily-help', authenticateToken, profileController.addDailyHelp);
router.post('/vehicles', authenticateToken, profileController.addVehicle);
router.post('/pets', authenticateToken, profileController.addPet);
router.post('/address', authenticateToken, profileController.addAddress);
router.get('/me', authenticateToken, profileController.getProfileData);

module.exports = router;
