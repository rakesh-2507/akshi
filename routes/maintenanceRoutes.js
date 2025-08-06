const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Maintenance routes working' });
});

module.exports = router;
