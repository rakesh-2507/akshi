// 📄 routes/activityRoutes.js
const express = require('express');
const router = express.Router();
const {
  addSteps,
  getWeeklySteps,
  getLeaderboard,
} = require('../controllers/activityController');

router.post('/step', addSteps);
router.get('/week/:userId', getWeeklySteps);
router.get('/leaderboard', getLeaderboard); // 🆕 Leaderboard route

module.exports = router;
