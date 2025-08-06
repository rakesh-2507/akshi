const pool = require('../utils/db');

// Function to create a new user in the database - now stores plaintext password
const createUser = async ({ name, email, phone, apartmentName, floorNumber, flatNumber, password, role }) => {
    // --- SECURITY WARNING: Storing plaintext password for demonstration ONLY ---
    console.log('UserModel: createUser receiving plaintext password (NOT RECOMMENDED):', password);

    const query = `
        INSERT INTO users 
        (name, email, phone, apartmentname, floor_number, flat_number, password, role, is_approved)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, false)
        RETURNING id, name, email, phone, apartmentname AS "apartmentName", floor_number AS "floorNumber", flat_number AS "flatNumber", role, is_approved
    `;
    const values = [name, email, phone, apartmentName, floorNumber, flatNumber, password, role];

    try {
        const { rows } = await pool.query(query, values);
        console.log('UserModel: User created successfully in DB (plaintext stored). Returned:', rows[0]);
        return rows[0];
    } catch (error) {
        console.error('UserModel: Error inserting user into database:', error);
        throw error;
    }
};

// Function to find a user by email in the database - retrieves plaintext password
const findUserByEmail = async (email) => {
    try {
        const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        console.log('UserModel: Found user by email. User object:', rows[0] || 'None');
        return rows[0];
    } catch (error) {
        console.error('UserModel: Error finding user by email in database:', error);
        throw error;
    }
};

// Update user profile by ID
const updateUserById = async (id, { name, phone, flat_number, apartmentName }) => {
    const query = `
        UPDATE users
        SET name = $1, phone = $2, flat_number = $3, apartmentname = $4
        WHERE id = $5
        RETURNING id, name, email, phone, flat_number, role, apartmentname, floor_number, is_approved
    `;
    const values = [name, phone, flat_number, apartmentName, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
};

// ✅ Get all residents pending approval
const getUnapprovedResidents = async () => {
    const { rows } = await pool.query(`
        SELECT id, name, email, phone, apartmentname, floor_number, flat_number, role
        FROM users
        WHERE role = 'resident' AND is_approved = false
    `);
    return rows;
};

// ✅ Approve a resident by ID
const approveUserById = async (id) => {
    const { rows } = await pool.query(
        'UPDATE users SET is_approved = true WHERE id = $1 RETURNING id, name, email, role, is_approved',
        [id]
    );
    return rows[0];
};

module.exports = {
    createUser,
    findUserByEmail,
    updateUserById,
    getUnapprovedResidents,
    approveUserById,
};
