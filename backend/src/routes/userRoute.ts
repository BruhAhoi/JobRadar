import { Router } from "express";
import { getMe, updateMe, changePassword, deleteMe } from "../controllers/userController";
import { protectedRoute } from "../middlewares/authMiddleware";

const router = Router();

router.use(protectedRoute);

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Lấy thông tin user hiện tại
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *                     isVerified:
 *                       type: boolean
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Chưa xác thực
 */
router.get("/me", getMe);

/**
 * @swagger
 * /api/users/me:
 *   patch:
 *     summary: Cập nhật thông tin cá nhân
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Nguyen Van A
 *               timezone:
 *                 type: string
 *                 example: Asia/Ho_Chi_Minh
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.patch("/me", updateMe);

/**
 * @swagger
 * /api/users/me/password:
 *   patch:
 *     summary: Đổi mật khẩu
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [oldPassword, newPassword]
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: OldPass@123
 *               newPassword:
 *                 type: string
 *                 example: NewPass@456
 *                 description: Tối thiểu 8 ký tự, có chữ hoa, số, ký tự đặc biệt
 *     responses:
 *       200:
 *         description: Đổi mật khẩu thành công, cần đăng nhập lại
 *       400:
 *         description: Mật khẩu cũ không đúng hoặc mật khẩu mới không hợp lệ
 */
router.patch("/me/password", changePassword);

/**
 * @swagger
 * /api/users/me:
 *   delete:
 *     summary: Xóa tài khoản (soft delete, xóa dữ liệu sau 30 ngày)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tài khoản được đánh dấu xóa
 *       401:
 *         description: Chưa xác thực
 */
router.delete("/me", deleteMe);

export default router;