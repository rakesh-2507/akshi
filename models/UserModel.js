// models/UserModel.js
const pool = require('../utils/db');

// Function to create a new user in the database - now stores plaintext password
const createUser = async ({ name, email, phone, apartmentName, floorNumber, flatNumber, password, role }) => {
    // --- SECURITY WARNING: Storing plaintext password for demonstration ONLY ---
    console.log('UserModel: createUser receiving plaintext password (NOT RECOMMENDED):', password);

    const query = `
        INSERT INTO users 
        (name, email, phone, apartmentname, floor_number, flat_number, password, role)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id, name, email, phone, apartmentname AS "apartmentName", floor_number AS "floorNumber", flat_number AS "flatNumber", role
    `;
    const values = [name, email, phone, apartmentName, floorNumber, flatNumber, password, role];

    try {
        const { rows } = await pool.query(query, values);
        console.log('UserModel: User created successfully in DB (plaintext stored). Returned:', rows[0]);
        return rows[0];
    } catch (error) {
        console.error('UserModel: Error inserting user into database:', error);
        throw error; // Re-throw the error for the calling controller to handle
    }
};

// Function to find a user by email in the database - retrieves plaintext password
const findUserByEmail = async (email) => {
    try {
        // Will retrieve the plaintext password from the database
        const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        console.log('UserModel: Found user by email. User object (will contain plaintext password):', rows[0] ? { id: rows[0].id, email: rows[0].email, role: rows[0].role, password: rows[0].password } : 'None');
        return rows[0]; // Returns the full user object including the plaintext password
    } catch (error) {
        console.error('UserModel: Error finding user by email in database:', error);
        throw error;
    }
};

// ✅ New: update user
const updateUserById = async (id, { name, phone, flat_number, apartmentName }) => {
    const query = `
    UPDATE users
    SET name = $1, phone = $2, flat_number = $3, apartmentname = $4
    WHERE id = $5
    RETURNING id, name, email, phone, flat_number, role, apartmentname, floor_number
  `;
    const values = [name, phone, flat_number, apartmentName, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
};

module.exports = {
    createUser,
    findUserByEmail,
    updateUserById,
};