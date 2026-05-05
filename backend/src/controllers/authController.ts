import { Request, Response } from "express";
import bycrypt from "bcrypt";
import prisma from "../libs/db";
import { generateAccessToken, generateSecureToken, verifySecureToken, getRefreshTokenExpiry, refreshTokenMaxAge } from "../utils/token";
import { AuthRequest } from "../middlewares/authMiddleware";
import { logServerError } from "../middlewares/errorMiddleware";
import { sendVerificationEmail } from "../libs/mailer";
import crypto from "crypto";

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: (process.env.NODE_ENV === "production" ? "strict" : "lax") as
        | "strict"
        | "lax",
};

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, name } = req.body;

        if (!name || !email || !password) {
            res.status(400).json({ message: "Name, email and password are required" });
            return;
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: "Email already in use" });
            return;
        }

        const hashedPassword = await bycrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { email, passwordHash: hashedPassword, name },
            select: { id: true, email: true, name: true, isVerified: true }
        })
        res.status(201).json({ message: "User registered successfully", user });
    } catch (err) {
        console.error("Registration Error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.query as { token: string };
 
    if (!token) {
      res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Token is required" },
      });
      return;
    }
 
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
 
    const user = await prisma.user.findFirst({
      where: { emailVerifyTokenHash: tokenHash },
    });
 
    if (!user) {
      res.status(400).json({
        success: false,
        error: { code: "INVALID_TOKEN", message: "Token không hợp lệ hoặc đã được dùng" },
      });
      return;
    }
 
    if (user.emailVerifyExpiresAt && user.emailVerifyExpiresAt < new Date()) {
      res.status(400).json({
        success: false,
        error: { code: "TOKEN_EXPIRED", message: "Token đã hết hạn. Vui lòng đăng ký lại." },
      });
      return;
    }
 
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        emailVerifyTokenHash: null,
        emailVerifyExpiresAt: null,
      },
    });
 
    res.status(200).json({
      success: true,
      data: { message: "Xác thực email thành công! Bạn có thể đăng nhập." },
    });
  } catch (err) {
    console.error("[verifyEmail]", err);
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Internal server error" },
    });
  }
};

export const resendVerification = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Email is required" },
      });
      return;
    }
 
    const user = await prisma.user.findUnique({ where: { email } });
 
    // Luôn trả 200 để tránh user enumeration
    if (!user || user.deletedAt || user.isVerified) {
      res.status(200).json({
        success: true,
        data: { message: "Nếu email tồn tại và chưa xác thực, bạn sẽ nhận được email mới." },
      });
      return;
    }
 
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
 
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerifyTokenHash: tokenHash, emailVerifyExpiresAt: expiresAt },
    });
 
    const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${rawToken}`;
    sendVerificationEmail(email, verifyUrl).catch(console.error);
 
    res.status(200).json({
      success: true,
      data: { message: "Nếu email tồn tại và chưa xác thực, bạn sẽ nhận được email mới." },
    });
  } catch (err) {
    console.error("[resendVerification]", err);
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Internal server error" },
    });
  }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || user.deletedAt) {
            res.status(400).json({ message: "Invalid email or password" });
            return;
        }

        const passwordMatch = await bycrypt.compare(password, user.passwordHash);
        if (!passwordMatch) {
            res.status(400).json({ message: "Invalid email or password" });
            return;
        }

        const accessToken = generateAccessToken(user.id);
        const { raw, hashed } = await generateSecureToken();

        await prisma.refreshToken.create({
            data: {
                userId: user.id,
                tokenHash: hashed,
                expiresAt: getRefreshTokenExpiry()
            }
        })

        res.cookie("refreshToken", raw, { ...COOKIE_OPTIONS, maxAge: refreshTokenMaxAge() });

        res.status(200).json({
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                isVerified: user.isVerified,
            },
        });
    } catch (error) {
        logServerError("login", error, req);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
}

export const refresh = async (req: Request, res: Response) => {
  try {
    const raw = req.cookies?.refreshToken;
    if (!raw) {
      res.status(401).json({ message: "Không có refresh token" });
      return;
    }

    // Tìm các token còn hiệu lực
    const validTokens = await prisma.refreshToken.findMany({
      where: { revokedAt: null, expiresAt: { gt: new Date() } },
    });

    let matched = null;
    for (const t of validTokens) {
      const ok = await verifySecureToken(raw, t.tokenHash);
      if (ok) { matched = t; break; }
    }

    if (!matched) {
      res.clearCookie("refreshToken", COOKIE_OPTIONS);
      res.status(403).json({ message: "Refresh token không hợp lệ" });
      return;
    }

    // Rotation: revoke cũ, cấp mới
    const { raw: newRaw, hashed: newHash } = await generateSecureToken();

    await prisma.$transaction([
      prisma.refreshToken.update({
        where: { id: matched.id },
        data: { revokedAt: new Date() },
      }),
      prisma.refreshToken.create({
        data: {
          userId: matched.userId,
          tokenHash: newHash,
          expiresAt: getRefreshTokenExpiry(),
        },
      }),
    ]);

    const accessToken = generateAccessToken(matched.userId);

    res.cookie("refreshToken", newRaw, {
      ...COOKIE_OPTIONS,
      maxAge: refreshTokenMaxAge(),
    });

    res.status(200).json({ accessToken });
  } catch (error) {
    console.error("[refresh]", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const logout = async (req: AuthRequest, res: Response) => {
  try {
    await prisma.refreshToken.updateMany({
      where: { userId: req.user!.id, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    res.clearCookie("refreshToken", COOKIE_OPTIONS);
    res.status(200).json({ message: "Đăng xuất thành công" });
  } catch (error) {
    console.error("[logout]", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
