const pool = require('../utils/db');

// Book an amenity with start_date and end_date
exports.bookAmenity = async (req, res) => {
  const amenityId = req.params.id;
  const userId = req.user.id;
  const { start_date, end_date } = req.body;

  if (!start_date || !end_date) {
    return res.status(400).json({ message: 'Start and end dates are required' });
  }

  const start = new Date(start_date);
  const end = new Date(end_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (start < today || end < today) {
    return res.status(400).json({ message: 'Cannot book past dates' });
  }

  if (end <= start) {
    return res.status(400).json({ message: 'End date must be after start date' });
  }

  try {
    const overlapCheck = await pool.query(
      `SELECT * FROM bookings 
       WHERE amenity_id = $1 AND 
       ((start_date <= $3 AND end_date >= $2))`,
      [amenityId, start_date, end_date]
    );

    if (overlapCheck.rows.length > 0) {
      return res.status(400).json({ message: 'This time range is already booked' });
    }

    const result = await pool.query(
      `INSERT INTO bookings (user_id, amenity_id, start_date, end_date, status)
       VALUES ($1, $2, $3, $4, 'confirmed') RETURNING *`,
      [userId, amenityId, start_date, end_date]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error booking:', err);
    res.status(500).json({ message: 'Server error during booking' });
  }
};

// Get bookings for the logged-in user
exports.getMyBookings = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT b.*, a.title AS amenity_title
       FROM bookings b
       JOIN amenities a ON b.amenity_id = a.id
       WHERE b.user_id = $1
       ORDER BY b.start_date DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Cancel a booking
exports.cancelBooking = async (req, res) => {
  const userId = req.user.id;
  const bookingId = req.params.id;

  try {
    const result = await pool.query(
      `DELETE FROM bookings WHERE id = $1 AND user_id = $2 RETURNING *`,
      [bookingId, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Booking not found or not authorized' });
    }

    res.json({ message: 'Booking cancelled successfully' });
  } catch (err) {
    console.error('Error cancelling booking:', err);
    res.status(500).json({ message: 'Internal server error during cancellation' });
  }
};
