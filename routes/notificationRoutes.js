const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Notification routes working' });
});

module.exports = router;
