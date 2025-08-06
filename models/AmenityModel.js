const pool = require('../utils/db');

const AmenityModel = {
  async getAll() {
    const res = await pool.query('SELECT * FROM amenities ORDER BY id DESC');
    return res.rows;
  },

  async create({ title, image_url, description, availability, timing, status, scalable }) {
    const res = await pool.query(
      `INSERT INTO amenities 
       (title, image_url, description, availability, timing, status, scalable) 
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [title, image_url, description, availability, timing, status, scalable]
    );
    return res.rows[0];
  }
};

module.exports = AmenityModel;
