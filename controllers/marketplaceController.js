const pool = require('../utils/db');

exports.addItem = async (req, res) => {
  try {
    const userId = req.user?.id; // ✅ Correct user ID
    const { name, description, price, contact, location } = req.body;

    const imagePath = req.file ? `marketplace/${req.file.filename}` : null;

    const result = await pool.query(
      `INSERT INTO marketplace_items 
       (user_id, item_name, description, price, contact_info, location, image_path, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) 
       RETURNING *`,
      [userId, name, description, price, contact, location, imagePath]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Add Item Error:', err);
    res.status(500).json({ error: 'Failed to add item' });
  }
};

exports.getAllItems = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM marketplace_items ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Get Items Error:', err);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
};
