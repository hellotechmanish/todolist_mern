const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authenticate = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];  // Extract the token from the Authorization header

    if (!token) {
        return res.status(401).json({ message: 'Authentication token is missing' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verify the token

        // Find the user by the decoded ID
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user;  // Attach the user to the request object
        next();  // Proceed to the next middleware or route handler
    } catch (err) {
        console.error('Authentication error:', err);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

// Authorization middleware to check if the user is an admin
const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
};


const authorizeRole = (role) => {
    return (req, res, next) => {
        if (req.user?.role !== role) {
            return res.status(403).json({ message: 'Access denied: Insufficient role' });
        }
        next();
    };
};

module.exports = { authenticate, authorizeRole, authorizeAdmin };
