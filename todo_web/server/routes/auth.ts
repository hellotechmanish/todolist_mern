import { Router, type Request, type Response } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';

interface RegisterBody {
    username: string;
    email: string;
    password: string;
}

interface LoginBody {
    emailOrUsername: string;
    password: string;
}

const router = Router();

const getJwtSecret = () => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not configured');
    }
    return process.env.JWT_SECRET;
};

router.get('/', async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, getJwtSecret()) as { userId: string };
        const user = await User.findById(decoded.userId).select('email role');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.json({ email: user.email, role: user.role });
    } catch {
        return res.status(401).json({ message: 'Invalid token' });
    }
});

router.post(
    '/register',
    [
        body('email').isEmail().withMessage('Please enter a valid email'),
        body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
        body('username').notEmpty().withMessage('Username is required'),
    ],
    async (req: Request<Record<string, unknown>, Record<string, unknown>, RegisterBody>, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password, username } = req.body;

        try {
            const existing = await User.findOne({
                $or: [{ email }, { username }],
            });
            if (existing) {
                return res.status(400).json({ message: 'Email or username already in use' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({
                email,
                username,
                password: hashedPassword,
                role: 'user',
            });

            await newUser.save();

            return res.status(201).json({ message: 'User registered successfully' });
        } catch (err) {
            console.error('Register error:', err);
            return res.status(500).json({ message: 'Server error' });
        }
    },
);

router.post(
    '/login',
    async (req: Request<Record<string, unknown>, Record<string, unknown>, LoginBody>, res: Response) => {
        const { emailOrUsername, password } = req.body;

        if (!emailOrUsername || !password) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }

        try {
            const user = await User.findOne({
                $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
            });
            if (!user) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign({ userId: user._id, role: user.role }, getJwtSecret(), { expiresIn: '1h' });

            return res.json({ token, role: user.role });
        } catch (err) {
            console.error('Login error:', err);
            return res.status(500).json({ message: 'Server error' });
        }
    },
);

export default router;
