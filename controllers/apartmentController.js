const pool = require('../utils/db');

const getApartments = async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT apartment_name FROM apartments');
    const apartmentNames = result.rows.map(row => row.apartment_name);
    res.json(apartmentNames);
  } catch (error) {
    console.error('Error fetching apartments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getApartments };
