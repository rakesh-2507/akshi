const db = require('../utils/db');

exports.addFamily = async (req, res) => {
    const { name, dob, gender, mobile, email } = req.body;
    const userId = req.user.id;

    try {
        await db.query(
            'INSERT INTO family (user_id, name, dob, gender, mobile, email) VALUES ($1, $2, $3, $4, $5, $6)',
            [userId, name, dob, gender, mobile, email]
        );
        res.status(201).json({ message: 'Family member added' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding family member', error });
    }
};

exports.addDailyHelp = async (req, res) => {
    const { service } = req.body;
    const userId = req.user.id;

    try {
        await db.query('INSERT INTO daily_help (user_id, service) VALUES ($1, $2)', [userId, service]);
        res.status(201).json({ message: 'Daily help added' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding daily help', error });
    }
};

exports.addVehicle = async (req, res) => {
    const { type, number, rc, license } = req.body;
    const userId = req.user.id;

    try {
        await db.query(
            'INSERT INTO vehicles (user_id, type, number, rc, license) VALUES ($1, $2, $3, $4, $5)',
            [userId, type, number, rc, license]
        );
        res.status(201).json({ message: 'Vehicle added' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding vehicle', error });
    }
};

exports.addPet = async (req, res) => {
    const { type, count } = req.body;
    const userId = req.user.id;

    try {
        await db.query('INSERT INTO pets (user_id, type, count) VALUES ($1, $2, $3)', [userId, type, count]);
        res.status(201).json({ message: 'Pet added' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding pet', error });
    }
};

exports.addAddress = async (req, res) => {
    const { address } = req.body;
    const userId = req.user.id;

    try {
        await db.query('INSERT INTO addresses (user_id, address) VALUES ($1, $2) ON CONFLICT (user_id) DO UPDATE SET address = $2', [userId, address]);
        res.status(201).json({ message: 'Address saved' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving address', error });
    }
};

exports.getProfileData = async (req, res) => {
    const userId = req.user.id;

    try {
        const familyResult = await db.query('SELECT * FROM family WHERE user_id = $1', [userId]);
        const dailyHelpResult = await db.query('SELECT * FROM daily_help WHERE user_id = $1', [userId]);
        const vehiclesResult = await db.query('SELECT * FROM vehicles WHERE user_id = $1', [userId]);
        const petsResult = await db.query('SELECT * FROM pets WHERE user_id = $1', [userId]);
        const addressResult = await db.query('SELECT * FROM addresses WHERE user_id = $1', [userId]);

        res.status(200).json({
            family: familyResult.rows,
            dailyHelp: dailyHelpResult.rows,
            vehicles: vehiclesResult.rows,
            pets: petsResult.rows,
            address: addressResult.rows[0]?.address || '',
        });
    } catch (error) {
        console.error('❌ Error fetching profile data:', error);
        res.status(500).json({ message: 'Error fetching profile data', error });
    }
};

