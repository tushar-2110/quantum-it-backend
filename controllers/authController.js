const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Function to create JWT token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Signup Controller
exports.signup = async (req, res) => {
    const { name, dob, email, password } = req.body;

    try {
        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Create a new user
        const user = await User.create({ name, dob, email, password });

        // Generate JWT token for the user
        const token = createToken(user._id);
        res.status(201).json({ token, user });
    } catch (err) {
        res.status(400).json({ error: 'Failed to create user', err });
    }
};

// Login Controller
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        // Check if password matches
        if (password !== user.password) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        // Generate JWT token for the user
        const token = createToken(user._id);
        res.status(200).json({ token, user });
    } catch (err) {
        res.status(400).json({ error: 'Login failed', err });
    }
};

// Get all users (for the registration table)
exports.getAllUsers = async (req, res) => {
    try {
        // Fetch users with their name, dob, and email and password
        const users = await User.find({}, 'name dob email password');
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users', err });
    }
};
