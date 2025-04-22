// server/routes/auth.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');  // adjust path if needed
// const { authenticate, authorizeRole } = require('../middleware/auth');

const router = express.Router();



router.get('/', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // ensure JWT_SECRET is defined
        const user = await User.findById(decoded.userId).select('email role');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({ email: user.email, role: user.role });
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (default role: user)
 * @access  Public
 */
router.post('/register', [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters'),
    body('username').notEmpty().withMessage('Username is required'),
],
    async (req, res) => {
        // Validate incoming data
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password, username } = req.body;

        try {
            // Check for existing user by email OR username
            const existing = await User.findOne({
                $or: [{ email }, { username }],
            });
            if (existing) {
                return res
                    .status(400)
                    .json({ message: 'Email or username already in use' });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create user with default "user" role
            const newUser = new User({
                email,
                username,
                password: hashedPassword,
                role: 'user',
            });

            await newUser.save();

            console.log('🆕 New User Registered:', {
                id: newUser._id,
                email: newUser.email,
                username: newUser.username,
                role: newUser.role,
            });

            return res.status(201).json({ message: 'User registered successfully' });
        } catch (err) {
            console.error('Register error:', err);
            return res.status(500).json({ message: 'Server error' });
        }
    }
);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user by email or username + password, return JWT with role
 * @access  Public
 */

// Login Route
router.post('/login', async (req, res) => {
    const { emailOrUsername, password } = req.body;
    console.log("Login Request Body:", req.body);


    // Ensure both fields are present
    if (!emailOrUsername || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    try {
        // Find by email or username
        const user = await User.findOne({
            $or: [
                { email: emailOrUsername },
                { username: emailOrUsername }
            ]
        });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        // Compare hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Sign token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        console.log(`🔑 User Logged In: ${user.username} (${user.role})`);
        return res.json({ token, role: user.role });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});


// router.get('/todos', authenticate, (req, res) => {

// });

module.exports = router;
