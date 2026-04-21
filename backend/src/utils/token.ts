import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcrypt";

export const generateAccessToken = (userId: string) => {
    return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: "15m" });
}

export const generateSecureToken = async () => {
    const raw = crypto.randomBytes(32).toString("hex");
    const hashed = await bcrypt.hash(raw, 10);
    return { raw, hashed };
}

export const verifySecureToken = async (raw: string, hashed: string) : Promise<boolean> => {
    return bcrypt.compare(raw, hashed);
}

export const getRefreshTokenExpiry = () : Date => {
    const days = Number(process.env.REFRESH_TOKEN_EXPIRY_DAYS) || 7;
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

export const refreshTokenMaxAge = (): number => {
    const days = Number(process.env.REFRESH_TOKEN_EXPIRY_DAYS) || 7;
    return days * 24 * 60 * 60 * 1000;
}
