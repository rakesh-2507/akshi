const pool = require('../utils/db');
const path = require('path');

exports.addItem = async (req, res) => {
  try {
    console.log('Incoming addItem request');
    const userId = req.user?.id;
    console.log('User ID:', userId);
    console.log('Body:', req.body);
    console.log('File:', req.file);

    const {
      item_name,
      price,
      description,
      type,
      category,
      location,
    } = req.body;

    const imagePath = req.file ? `/uploads/marketplace/${req.file.filename}` : null;
    console.log('Image Path:', imagePath);

    const result = await pool.query(
      `INSERT INTO marketplace_items 
       (user_id, item_name, price, description, type, category, location, image_path, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
       RETURNING *`,
      [userId, item_name, price, description, type, category, location, imagePath]
    );

    const newItem = result.rows[0];
    newItem.image = newItem.image_path
      ? `${process.env.BASE_URL}${newItem.image_path}`
      : null;

    console.log('Item added successfully:', newItem);
    res.status(201).json(newItem);
  } catch (err) {
    console.error('Add Item Error:', err.message);
    res.status(500).json({ error: 'Failed to add item' });
  }
};

exports.getAllItems = async (req, res) => {
  try {
    console.log('Fetching all marketplace items...');

    const result = await pool.query(`
      SELECT mi.*, u.name AS user_name
      FROM marketplace_items mi
      JOIN users u ON mi.user_id = u.id
      ORDER BY mi.created_at DESC
    `);

    const items = result.rows.map(item => ({
      ...item,
      image: item.image_path
        ? `${process.env.BASE_URL}${item.image_path}`
        : null,
    }));

    console.log(`Fetched ${items.length} items`);
    res.json(items);
  } catch (err) {
    console.error('Get Items Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
};
