import { Response } from "express";
import bycrypt from "bcrypt";
import crypto from "crypto";
import prisma from "../libs/db";
import { AuthRequest } from "../middlewares/authMiddleware";
import { updateProfileSchema, changePasswordSchema, forgotPasswordSchema, resetPasswordSchema } from "../validations/userValidation";

export const getMe = async (req: AuthRequest, res: Response) => {
    try{
        const user = await prisma.user.findUnique({
            where: { id: req.user!.id },
            select: { id: true, email: true, name: true, timezone: true, isVerified: true, createdAt: true, updatedAt: true }
        });
        if(!user){
            res.status(404).json({success: false, error: {code: "NOT_FOUND", message: "User not found" }});
            return;
        }
        res.status(200).json({success: true, data: user });
    }catch(err){
        console.error("Get Me Error:", err);
        res.status(500).json({success: false, error: {code: "INTERNAL_SERVER_ERROR", message: "Internal server error" }});
    }
}