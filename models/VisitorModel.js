const pool = require('../config/db');

const createVisitor = async ({ name, purpose, flatNumber, qrCode, numericCode, expiresAt }) => {
  const result = await pool.query(
    'INSERT INTO visitors (name, purpose, flat_number, qr_code, numeric_code, expires_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [name, purpose, flatNumber, qrCode, numericCode, expiresAt]
  );
  return result.rows[0];
};

const getActiveVisitors = async () => {
  const now = new Date();
  const result = await pool.query(
    'SELECT * FROM visitors WHERE expires_at > $1 ORDER BY created_at DESC',
    [now]
  );
  return result.rows;
};

module.exports = { createVisitor, getActiveVisitors };
