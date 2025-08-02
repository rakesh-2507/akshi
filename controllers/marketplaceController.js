// controllers/marketplaceController.js

const pool = require('../utils/db');

exports.addItem = async (req, res) => {
  try {
    const userId = req.user?.id;
    const {
      item_name,
      price,
      description,
      type,
      category,
      location,
    } = req.body;

    const imagePath = req.file ? `/uploads/marketplace/${req.file.filename}` : null;

    const result = await pool.query(
      `INSERT INTO marketplace_items 
       (user_id, item_name, price, description, type, category, location, image_path, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
       RETURNING *`,
      [userId, item_name, price, description, type, category, location, imagePath]
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
    res.json(
      result.rows.map(item => ({
        ...item,
        image: item.image_path ? `${process.env.BASE_URL}${item.image_path}` : null,
      }))
    );
  } catch (err) {
    console.error('Get Items Error:', err);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
};
