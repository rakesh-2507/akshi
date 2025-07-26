// controllers/visitorController.js
const pool = require('../utils/db');
const { sendVisitorScannedEmail } = require('../utils/emailSender');
const { sendVisitorSMS } = require('../utils/smsService');

// ✅ Add Visitor
exports.addVisitor = async (req, res) => {
  const {
    name,
    purpose,
    flatNumber,
    qrCode,
    numericCode,
    contact,
    startTime,
    endTime
  } = req.body;

  console.log('📩 Incoming visitor:', req.body);

  if (!flatNumber || flatNumber.trim() === '') {
    return res.status(400).json({ error: 'Flat number is required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO visitors 
      (name, purpose, flat_number, qr_code, numeric_code, contact, start_time, end_time, expires_at) 
      VALUES ($1, $2, $3, TRIM($4), $5, $6, $7, $8, $8)
      RETURNING *`,
      [name, purpose, flatNumber, qrCode, numericCode, contact, startTime, endTime]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('❌ Error adding visitor:', err);
    res.status(500).json({ error: 'Failed to add visitor' });
  }
};

// ✅ Get All Visitors
exports.getVisitors = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM visitors ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching visitors:', err);
    res.status(500).json({ error: 'Failed to fetch visitors' });
  }
};

// ✅ Get total QR scans today
exports.getQRScanStats = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT COUNT(*) FROM visitors 
       WHERE scanned_at IS NOT NULL AND scanned_at::date = CURRENT_DATE`
    );
    res.json({ totalScansToday: parseInt(result.rows[0].count, 10) });
  } catch (err) {
    console.error('❌ Error fetching scan stats:', err);
    res.status(500).json({ error: 'Failed to fetch QR scan stats' });
  }
};

// ✅ Validate QR Code, Save Scan Time, Expire It & Notify Creator
exports.validateVisitorQR = async (req, res) => {
  const { qrCode } = req.body;

  try {
    console.log('🔍 Incoming QR:', qrCode);

    if (!qrCode || typeof qrCode !== 'string') {
      return res.status(400).json({ error: 'Invalid QR code format' });
    }

    const result = await pool.query(
      `SELECT * FROM visitors WHERE TRIM(qr_code) = TRIM($1)`,
      [qrCode]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'QR code not found' });
    }

    const visitor = result.rows[0];
    const now = new Date();
    const end = new Date(visitor.expires_at);

    if (visitor.scanned_at) {
      return res.status(400).json({ error: 'QR code already used', expired: true });
    }

    if (now > end) {
      return res.status(400).json({ error: 'QR code expired', expired: true });
    }

    await pool.query(
      'UPDATE visitors SET scanned_at = $1, expires_at = $1 WHERE id = $2',
      [now, visitor.id]
    );

    if (visitor.contact && visitor.contact.includes('@')) {
      await sendVisitorScannedEmail({
        to: visitor.contact,
        name: visitor.name,
        flat: visitor.flat_number,
        scannedAt: now
      });
    }

    if (visitor.contact && /^\d{10}$/.test(visitor.contact)) {
      await sendVisitorSMS({
        phone: visitor.contact,
        name: visitor.name,
        flat: visitor.flat_number,
        scannedAt: now
      });
    }

    res.status(200).json({
      message: 'QR valid and marked as scanned',
      expired: false,
      scanned_at: now,
      visitor: { ...visitor, scanned_at: now, expires_at: now }
    });

  } catch (err) {
    console.error('❌ Error validating QR:', err);
    res.status(500).json({ error: 'Failed to validate QR' });
  }
};
