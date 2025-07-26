const pool = require('../utils/db');

exports.getAllWarranties = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM warranty ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Get warranties error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.createWarranty = async (req, res) => {
    const { item_name, purchase_date, warranty_period } = req.body;
    const image_path = req.file ? req.file.filename : null;

    console.log('BODY:', req.body);
    console.log('FILE:', req.file);

    try {
        const result = await pool.query(
            `INSERT INTO warranty (item_name, purchase_date, warranty_period, image_path) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [item_name, purchase_date, warranty_period, image_path]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Insert warranty error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};
