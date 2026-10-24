import jwt from "jsonwebtoken";
import type { User } from '../types/types';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
}

export const generateToken = (userId: string, userName: string, userRole: string) => {
    if (!userId || !userName || !userRole) {
        throw new Error("User data is required to generate token");
    }
    return jwt.sign({ id: userId, name: userName, role: userRole }, JWT_SECRET, { expiresIn: "24h" });
};

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    }
    catch (error) {
        return null;
    }
};
