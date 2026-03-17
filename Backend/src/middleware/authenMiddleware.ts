import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from "../utils/authHelper";
import type { User } from '../types/types';

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }
    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
    req.user = decoded as User;
    next();
};  