const pool = require('../utils/db');

const createAnnouncement = async ({ title, type, description, image_url, pdf_url }) => {
  const result = await pool.query(
    `INSERT INTO announcements (title, type, description, image_url, pdf_url)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [title, type, description, image_url, pdf_url]
  );
  return result.rows[0];
};

const getAllAnnouncements = async () => {
  const result = await pool.query(`SELECT * FROM announcements ORDER BY posted_at DESC`);
  return result.rows;
};

module.exports = { createAnnouncement, getAllAnnouncements };
