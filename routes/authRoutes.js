const express = require('express');
const { signup, login, getAllUsers } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Signup route
router.post('/signup', signup);

// Login route
router.post('/login', login);

// Get all registered users (JWT-protected)
router.get('/users', authMiddleware, getAllUsers);

module.exports = router;
