// ✅ controllers/bookingAdminController.js
const pool = require('../utils/db');

exports.getBookingHistory = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        b.id,
        b.start_date,
        b.end_date,
        b.status,
        u.name AS user_name,
        a.title AS amenity_title
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN amenities a ON b.amenity_id = a.id
      ORDER BY b.start_date DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching booking history:', err);
    res.status(500).json({ message: 'Error fetching booking history' });
  }
};
