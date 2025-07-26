const pool = require('../utils/db');

const createComplaint = async ({ userId, type, description, images, status }) => {
  const result = await pool.query(
    `INSERT INTO complaints (user_id, type, description, images, status) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [userId, type, description, images, status]
  );
  return result.rows[0];
};

const getComplaintsByUser = async (userId) => {
  const result = await pool.query(
    `SELECT * FROM complaints WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows;
};

const getAllComplaints = async () => {
  const result = await pool.query(`
    SELECT c.*, u.name AS user_name, u.flat_number
    FROM complaints c
    JOIN users u ON c.user_id = u.id
    ORDER BY c.created_at DESC
  `);
  return result.rows;
};

const updateComplaintStatus = async (id, status, response) => {
  const result = await pool.query(
    `UPDATE complaints SET status = $1, response = $2, updated_at = NOW() WHERE id = $3 RETURNING *`,
    [status, response, id]
  );
  return result.rows[0];
};

module.exports = { createComplaint, getComplaintsByUser, getAllComplaints, updateComplaintStatus };

