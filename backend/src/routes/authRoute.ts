import { Router } from "express";
import { register, login, refresh, logout } from "../controllers/authController";
import { protectedRoute } from "../middlewares/authMiddleware";

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Đăng ký tài khoản
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, name]
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@gmail.com
 *               password:
 *                 type: string
 *                 example: Test@123
 *               name:
 *                 type: string
 *                 example: Nguyen Van A
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *       409:
 *         description: Email đã tồn tại
 */
router.post("/register", register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Đăng nhập
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@gmail.com
 *               password:
 *                 type: string
 *                 example: Test@123
 *     responses:
 *       200:
 *         description: Đăng nhập thành công, trả về accessToken
 *       401:
 *         description: Sai email hoặc mật khẩu
 */
router.post("/login", login);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Làm mới access token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Trả về accessToken mới
 *       403:
 *         description: Refresh token không hợp lệ
 */
router.post("/refresh", refresh);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Đăng xuất
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
 */
router.post("/logout", protectedRoute, logout);

export default router;