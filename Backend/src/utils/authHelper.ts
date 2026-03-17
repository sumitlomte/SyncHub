import jwt from "jsonwebtoken";
import type { User } from '../types/types';

const JWT_SECRET = "ChatTasker_jwt_secret_key";

export const generateToken = (user: User) => {
    if (!user) {
        throw new Error("User data is required to generate token");
    }
    return jwt.sign(user, JWT_SECRET, { expiresIn: "24h" });
};

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    }
    catch (error) {
        return null;
    }
};

