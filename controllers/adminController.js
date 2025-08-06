const pool = require('../utils/db');

// 📊 Get role-wise user counts
const getUserStats = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) FILTER (WHERE role = 'resident') AS resident_count,
        COUNT(*) FILTER (WHERE role = 'watchman') AS watchman_count,
        COUNT(*) FILTER (WHERE role = 'admin' OR role = 'owner') AS admin_count,
        COUNT(*) AS total
      FROM users
    `);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching user stats:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 👥 Get all users, optionally filtered by role
const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;

    const query = role
      ? `SELECT id, name, email, phone, role, apartmentname AS "apartmentName", floor_number AS "floorNumber", flat_number AS "flatNumber", is_approved AS "isApproved"
         FROM users WHERE role = $1 ORDER BY id DESC`
      : `SELECT id, name, email, phone, role, apartmentname AS "apartmentName", floor_number AS "floorNumber", flat_number AS "flatNumber", is_approved AS "isApproved"
         FROM users ORDER BY id DESC`;

    const result = await pool.query(query, role ? [role] : []);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 🧾 Visitor logs
const getVisitorLogs = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, flat_number, purpose, contact, numeric_code, qr_code, created_at
      FROM visitors
      ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching visitor logs:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ❌ Delete user
const deleteUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [userId]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ✅ NEW: Get all residents pending approval
const getUnapprovedResidents = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, email, phone, apartmentname, floor_number, flat_number, role
      FROM users
      WHERE role = 'resident' AND is_approved = false
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching pending residents:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ NEW: Approve a resident by ID
const approveUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'UPDATE users SET is_approved = true WHERE id = $1 RETURNING id, name, email, role, is_approved',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Resident not found' });
    }

    res.json({ message: 'Resident approved successfully', user: result.rows[0] });
  } catch (err) {
    console.error('Error approving resident:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getUserStats,
  getAllUsers,
  getVisitorLogs,
  deleteUserById,
  getUnapprovedResidents,
  approveUserById,
};
