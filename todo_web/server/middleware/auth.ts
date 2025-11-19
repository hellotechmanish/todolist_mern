import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';

interface DecodedToken {
    userId: string;
    role: string;
}

const getJwtSecret = () => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not configured');
    }
    return process.env.JWT_SECRET;
};

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<Response | void> => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authentication token is missing' });
    }

    try {
        const decoded = jwt.verify(token, getJwtSecret()) as DecodedToken;
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user;
        return next();
    } catch (err) {
        console.error('Authentication error:', err);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

export const authorizeAdmin = (
    req: Request,
    res: Response,
    next: NextFunction,
): Response | void => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    return next();
};

export const authorizeRole = (role: string) => {
    return (req: Request, res: Response, next: NextFunction): Response | void => {
        if (req.user?.role !== role) {
            return res.status(403).json({ message: 'Access denied: Insufficient role' });
        }
        return next();
    };
};

