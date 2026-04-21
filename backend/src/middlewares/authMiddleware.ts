import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../libs/db";

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        name: string;
        isVerified: boolean;
    }
}

export const protectedRoute = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader?.split(" ")[1];

        if (!token) {
            res.status(401).json({ message: "Access token missing" });
            return;
        }

        let decoded: any;
        try {
            decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
        } catch (err) {
            res.status(401).json({ message: "Invalid access token" });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, email: true, name: true, isVerified: true, deletedAt: true }
        });

        if (!user || user.deletedAt) {
            res.status(401).json({ message: "User not found or deleted" });
            return;
        }

        req.user = user;
        next();
    } catch (err) {
        console.error("Auth Middleware Error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}

