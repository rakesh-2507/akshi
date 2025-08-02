const pool = require('../utils/db');
const path = require('path');

exports.addItem = async (req, res) => {
  try {
    console.log('Incoming addItem request');
    const userId = req.user?.id;
    const {
      item_name,
      price,
      description,
      type,
      category,
      location,
    } = req.body;

    if (!item_name || !price || !description || !type || !category || !req.file) {
      return res.status(400).json({ message: 'Missing required fields or image' });
    }

    const imagePath = `/uploads/marketplace/${req.file.filename}`;
    const result = await pool.query(
      `INSERT INTO marketplace_items 
       (user_id, item_name, price, description, type, category, location, image_path, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
       RETURNING *`,
      [userId, item_name, price, description, type, category, location, imagePath]
    );

    const newItem = result.rows[0];
    const baseUrl = process.env.BASE_URL || 'https://akshi-aid3.onrender.com';
    newItem.image = `${baseUrl}${newItem.image_path}`;

    res.status(201).json(newItem);
  } catch (err) {
    console.error('Add Item Error:', err);
    res.status(500).json({ error: 'Failed to add item' });
  }
};

exports.getAllItems = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT mi.*, u.name AS user_name
      FROM marketplace_items mi
      JOIN users u ON mi.user_id = u.id
      ORDER BY mi.created_at DESC
    `);

    const baseUrl = process.env.BASE_URL || 'https://akshi-aid3.onrender.com';
    const items = result.rows.map(item => ({
      ...item,
      image: item.image_path ? `${baseUrl}${item.image_path}` : null,
    }));

    res.json(items);
  } catch (err) {
    console.error('Get Items Error:', err);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
};
