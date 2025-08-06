const jwt = require('jsonwebtoken');
const {
  createUser,
  findUserByEmail,
  updateUserById,
} = require('../models/UserModel');

// Register new user - Stores password in plaintext
const register = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      apartmentName,
      floorNumber,
      flatNumber,
      password,
      role,
    } = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !apartmentName ||
      !floorNumber ||
      !flatNumber ||
      !password ||
      !role
    ) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (!['resident', 'owner', 'watchman'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = await createUser({
      name,
      email,
      phone,
      apartmentName,
      floorNumber,
      flatNumber,
      password,
      role,
    });

    return res.status(201).json({ user, message: 'Registration successful' });
  } catch (error) {
    console.error('❌ Error in register controller:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await findUserByEmail(email);
    if (!user || password !== user.password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // ❌ If resident and not approved, block login
    if (user.role === 'resident' && !user.is_approved) {
      return res.status(403).json({ message: 'Your account is pending approval by the admin.' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        flat_number: user.flat_number,
        isApproved: user.is_approved,
      },
    });
  } catch (error) {
    console.error('❌ Error in login controller:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get current user from token
const me = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await findUserByEmail(decoded.email);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // ✅ Return isApproved for frontend logic
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      flatNumber: user.flat_number,
      apartmentName: user.apartmentname,
      floorNumber: user.floor_number,
      isApproved: user.is_approved,
    });
  } catch (error) {
    console.error('❌ Error in /me:', error);
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// ✅ Update profile
const updateProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { name, phone, flat_number } = req.body;

    const updatedUser = await updateUserById(decoded.id, {
      name,
      phone,
      flat_number,
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('❌ Error in updateProfile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  register,
  login,
  me,
  updateProfile,
};
