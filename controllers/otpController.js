// === BACKEND FILES ===

// controllers/otpController.js
const pool = require('../utils/db');
const jwt = require('jsonwebtoken');
const { generateOTP } = require('../utils/otpUtils');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
require('dotenv').config();

const sendOTP = async (req, res) => {
  const { email, phone } = req.body;
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  try {
    await pool.query(
      `INSERT INTO otps (email, otp, expires_at, verified)
       VALUES ($1, $2, $3, false)
       ON CONFLICT (email) DO UPDATE SET otp = $2, expires_at = $3, verified = false`,
      [email, otp, expiresAt]
    );

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
      tls: { rejectUnauthorized: false },
    });

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP is ${otp}`,
    });

    if (phone) {
      const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);
      await client.messages.create({
        body: `Your OTP is ${otp}`,
        from: process.env.TWILIO_PHONE,
        to: `+91${phone}`,
      });
    }

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

const verifyOTP = async (req, res) => {
  const { otp, email, name, phone, apartmentName, floorNumber, flatNumber, password, role } = req.body;
  console.log('✅ Received payload for OTP verification:', req.body);

  try {
    const result = await pool.query(
      'SELECT * FROM otps WHERE email = $1 AND otp = $2 AND expires_at > NOW()',
      [email, otp]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    await pool.query('UPDATE otps SET verified = true WHERE email = $1', [email]);

    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (userCheck.rowCount > 0) {
      return res.status(400).json({ error: 'User already registered' });
    }

    const insertUser = await pool.query(
      `INSERT INTO users (name, email, phone, apartmentname, floor_number, flat_number, password, role)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, name, email, phone, apartmentname AS "apartmentName", floor_number AS "floorNumber", flat_number AS "flatNumber", role`,
      [name, email, phone, apartmentName, floorNumber, flatNumber, password, role]
    );

    const user = insertUser.rows[0];
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

    res.status(200).json({ user, token });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: 'OTP verification or user creation failed' });
  }
};

module.exports = { sendOTP, verifyOTP };
