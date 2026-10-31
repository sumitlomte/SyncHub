import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from "../utils/authHelper";
import type { User } from '../types/types';
import type { ApiErrorDTO } from "../dto/common.dto";

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}
export const authMiddleware = (req: Request, res: Response<ApiErrorDTO>, next: NextFunction) => {
    const token = req.cookies?.token 
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