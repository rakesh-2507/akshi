const pool = require('../utils/db');

const createOrUpdateOTP = async ({ email, otp, expiresAt }) => {
  const query = `
    INSERT INTO otps (email, otp, expires_at, verified)
    VALUES ($1, $2, $3, false)
    ON CONFLICT (email) 
    DO UPDATE SET otp = $2, expires_at = $3, verified = false
    RETURNING *;
  `;
  const values = [email, otp, expiresAt];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const verifyOTP = async (email, otp) => {
  const query = `
    SELECT * FROM otps 
    WHERE email = $1 AND otp = $2 AND expires_at > NOW() AND verified = false
  `;
  const { rows } = await pool.query(query, [email, otp]);
  return rows[0];
};

const markOTPVerified = async (email) => {
  await pool.query(`UPDATE otps SET verified = true WHERE email = $1`, [email]);
};

const getOTPByEmail = async (email) => {
  const { rows } = await pool.query(`SELECT * FROM otps WHERE email = $1`, [email]);
  return rows[0];
};

module.exports = {
  createOrUpdateOTP,
  verifyOTP,
  markOTPVerified,
  getOTPByEmail, // ✅ Export this
};
