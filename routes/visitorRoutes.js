const express = require('express');
const router = express.Router();
const {
  addVisitor,
  getVisitors,
  validateVisitorQR,
  getQRScanStats,
} = require('../controllers/visitorController');

router.post('/', addVisitor);
router.get('/', getVisitors);
router.post('/validate', validateVisitorQR);
router.get('/stats/scans', getQRScanStats);

// ⬇️ New Route: Get visitors who were scanned (for HistoryScreen)
router.get('/scanned', async (req, res) => {
  const pool = require('../utils/db');
  try {
    const result = await pool.query(`
      SELECT * FROM visitors
      WHERE scanned_at IS NOT NULL
      ORDER BY scanned_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching scanned visitors:', err);
    res.status(500).json({ error: 'Failed to fetch scanned visitors' });
  }
});

module.exports = router;
