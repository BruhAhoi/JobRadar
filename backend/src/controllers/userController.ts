import { Response } from "express";
import bycrypt from "bcrypt";
import crypto from "crypto";
import prisma from "../libs/db";
import { AuthRequest } from "../middlewares/authMiddleware";
import { updateProfileSchema, changePasswordSchema, forgotPasswordSchema, resetPasswordSchema } from "../validations/userValidation";
import { sendResetPasswordEmail } from "../libs/mailer";

export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user!.id },
            select: { id: true, email: true, name: true, timezone: true, isVerified: true, createdAt: true, updatedAt: true }
        });
        if (!user) {
            res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "User not found" } });
            return;
        }
        res.status(200).json({ success: true, data: user });
    } catch (err) {
        console.error("Get Me Error:", err);
        res.status(500).json({ success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "Internal server error" } });
    }
}

export const updateMe = async (req: AuthRequest, res: Response) => {
    try {
        const parsed = updateProfileSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.issues.map(e => e.message).join(", ") } });
            return;
        }
        const { name, timezone } = parsed.data;
        if (!name && !timezone) {
            res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "At least one field (name or timezone) must be provided" } });
            return;
        }
        const updatedUser = await prisma.user.update({
            where: { id: req.user!.id },
            data: { ...(name && { name }), ...(timezone && { timezone }) },
            select: { id: true, email: true, name: true, timezone: true, isVerified: true, createdAt: true, updatedAt: true }
        });
        res.status(200).json({ success: true, data: updatedUser });

    } catch (err) {
        console.error("Update Me Error:", err);
        res.status(500).json({ success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "Internal server error" } });
    }
}

export const changePassword = async (req: AuthRequest, res: Response) => {
    try {
        const parsed = changePasswordSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.issues.map(e => e.message).join(", ") } });
            return;
        }
        const { oldPassword, newPassword } = parsed.data;
        const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
        if (!user) {
            res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "User not found" } });
            return;
        }
        const isOldCorrect = await bycrypt.compare(oldPassword, user.passwordHash);
        if (!isOldCorrect) {
            res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "Old password is incorrect" } });
            return;
        }
        const isSame = await bycrypt.compare(newPassword, user.passwordHash);
        if (isSame) {
            res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "New password must be different from old password" } });
            return;
        }
        const newHash = await bycrypt.hash(newPassword, 10);
        await prisma.$transaction([
            prisma.user.update({ where: { id: req.user!.id }, data: { passwordHash: newHash } }),
            prisma.refreshToken.updateMany({ where: { userId: req.user!.id, revokedAt: null }, data: { revokedAt: new Date() } }),
        ]);
        res.status(200).json({ success: true, message: "Password changed successfully" });
    }catch (err) {
        console.error("Change Password Error:", err);
        res.status(500).json({ success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "Internal server error" } });
    }
}

export const deleteMe = async (req: AuthRequest, res: Response) => {
  try {
    await prisma.$transaction([
      prisma.user.update({ where: { id: req.user!.id }, data: { deletedAt: new Date() } }),
      prisma.refreshToken.updateMany({ where: { userId: req.user!.id, revokedAt: null }, data: { revokedAt: new Date() } }),
    ]);
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    });
    res.status(200).json({ success: true, data: { message: "Account scheduled for deletion. Data will be permanently removed after 30 days." } });
  } catch (err) {
    console.error("[deleteMe]", err);
    res.status(500).json({ success: false, error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
};

export const forgotPassword = async (req: AuthRequest, res: Response) => {
  try {
    const parsed = forgotPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0].message },
      });
      return;
    }

    const { email } = parsed.data;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.deletedAt) {
      res.status(401).json({
        success: false,
        error: { code: "USER_NOT_FOUND", message: "Email does not exist." },
      });
      return;
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.$transaction([
      prisma.passwordResetToken.deleteMany({ where: { userId: user.id } }),
      prisma.passwordResetToken.create({ data: { userId: user.id, tokenHash, expiresAt } }),
    ]);

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${rawToken}`;
    const isSent = await sendResetPasswordEmail(email, resetUrl);

    if (!isSent) {
      await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } }).catch(() => {});

      res.status(500).json({
        success: false,
        error: { code: "EMAIL_ERROR", message: "Failed to send reset email. Please try again." },
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: { message: "Reset link has been sent to your email." },
    });
  } catch (err) {
    console.error("[forgotPassword]", err);
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Internal server error" },
    });
  }
};

export const resetPassword = async (req: AuthRequest, res: Response) => {
  try {
    const parsed = resetPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0].message } });
      return;
    }
    const { token, newPassword } = parsed.data;
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { User: true },
    });
    if (!resetToken) {
      res.status(400).json({ success: false, error: { code: "INVALID_TOKEN", message: "Invalid or expired reset token" } });
      return;
    }
    if (resetToken.expiresAt < new Date()) {
      await prisma.passwordResetToken.delete({ where: { tokenHash } });
      res.status(400).json({ success: false, error: { code: "TOKEN_EXPIRED", message: "Reset token has expired. Please request a new one." } });
      return;
    }
    const isSame = await bycrypt.compare(newPassword, resetToken.User.passwordHash);
    if (isSame) {
      res.status(400).json({ success: false, error: { code: "SAME_PASSWORD", message: "New password must be different from your current password" } });
      return;
    }
    const newHash = await bycrypt.hash(newPassword, 12);
    await prisma.$transaction([
      prisma.user.update({ where: { id: resetToken.userId }, data: { passwordHash: newHash } }),
      prisma.passwordResetToken.delete({ where: { tokenHash } }),
      prisma.refreshToken.updateMany({ where: { userId: resetToken.userId, revokedAt: null }, data: { revokedAt: new Date() } }),
    ]);
    res.status(200).json({ success: true, data: { message: "Password reset successfully. Please log in with your new password." } });
  } catch (err) {
    console.error("[resetPassword]", err);
    res.status(500).json({ success: false, error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
  }
};
