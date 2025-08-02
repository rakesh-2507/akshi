const pool = require('../utils/db');
const path = require('path');

const addItem = async (req, res) => {
  try {
    console.log('✅ Incoming marketplace add request');

    const { item_name, price, description, category, type } = req.body;
    const { id: user_id } = req.user;

    console.log('📝 Form Data:', { item_name, price, description, category, type });
    console.log('👤 User ID:', user_id);

    if (!req.file) {
      console.error('❌ No image uploaded');
      return res.status(400).json({ message: 'Image is required' });
    }

    const image_path = `uploads/marketplace/${req.file.filename}`;
    console.log('🖼️ Image Uploaded:', req.file.filename);

    const query = `
      INSERT INTO marketplace_items
      (user_id, item_name, price, description, image_path, category, type)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [user_id, item_name, price, description, image_path, category, type];

    const result = await pool.query(query, values);

    console.log('✅ Item added to DB:', result.rows[0]);

    res.status(201).json({
      message: 'Item added successfully',
      item: {
        ...result.rows[0],
        image_path: `${req.protocol}://${req.get('host')}/${image_path}`,
      },
    });
  } catch (err) {
    console.error('❌ Error in addItem:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllItems = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM marketplace_items ORDER BY id DESC');
    const items = result.rows.map((item) => ({
      ...item,
      image_path: `${req.protocol}://${req.get('host')}/${item.image_path}`,
    }));
    res.json(items);
  } catch (err) {
    console.error('❌ Error in getAllItems:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { addItem, getAllItems };
