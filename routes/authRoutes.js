const express = require('express');
const router = express.Router();
const { register, login, me, updateProfile } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/me', me);
router.put('/update', updateProfile); // ✅ New route

module.exports = router;
