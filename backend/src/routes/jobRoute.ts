import { Router } from "express";
import { listJobs, createJob, getJob, updateJob, deleteJob, updateJobStatus, deleteNote, createNote, listNotes } from "../controllers/jobController";
import { protectedRoute } from "../middlewares/authMiddleware";

const router = Router();

router.use(protectedRoute);

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Quản lý ứng tuyển
 */
 
/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: Danh sách ứng tuyển (filter, sort, paginate)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [APPLIED, PHONE_SCREEN, INTERVIEW, OFFER, ACCEPTED, REJECTED, DECLINED]
 *       - in: query
 *         name: source
 *         schema:
 *           type: string
 *           enum: [ITVIEC, TOPCV, LINKEDIN, REFERRAL, OTHER]
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Tìm theo tên công ty hoặc vị trí
 *       - in: query
 *         name: range
 *         schema:
 *           type: string
 *           enum: [7d, 30d, 3m, all]
 *         description: Lọc theo khoảng thời gian apply
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, default: appliedAt }
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: Danh sách ứng tuyển thành công
 */
router.get("/", listJobs);

/**
 * @swagger
 * /api/jobs:
 *   post:
 *     summary: Tạo ứng tuyển mới
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [companyName, position, appliedAt]
 *             properties:
 *               companyName:
 *                 type: string
 *                 maxLength: 200
 *                 example: FPT Software
 *               position:
 *                 type: string
 *                 maxLength: 200
 *                 example: Frontend Developer
 *               appliedAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-04-01T00:00:00.000Z"
 *               source:
 *                 type: string
 *                 enum: [ITVIEC, TOPCV, LINKEDIN, REFERRAL, OTHER]
 *                 default: OTHER
 *               jobUrl:
 *                 type: string
 *                 format: uri
 *               salaryNote:
 *                 type: string
 *               notes:
 *                 type: string
 *               deadlineAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Tạo thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.post("/", createJob);

/**
 * @swagger
 * /api/jobs/{id}:
 *   get:
 *     summary: Chi tiết 1 ứng tuyển (bao gồm notes)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Chi tiết ứng tuyển
 *       403:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy
 */
router.get("/:id", getJob);

/**
 * @swagger
 * /api/jobs/{id}:
 *   patch:
 *     summary: Cập nhật thông tin ứng tuyển (không bao gồm status)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName: { type: string }
 *               position: { type: string }
 *               jobUrl: { type: string }
 *               salaryNote: { type: string }
 *               notes: { type: string }
 *               deadlineAt: { type: string, format: date-time }
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.patch("/:id", updateJob);

/**
 * @swagger
 * /api/jobs/{id}:
 *   delete:
 *     summary: Xóa ứng tuyển
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
router.delete("/:id", deleteJob);

/**
 * @swagger
 * /api/jobs/{id}/status:
 *   patch:
 *     summary: Thay đổi trạng thái ứng tuyển (theo luồng hợp lệ)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [APPLIED, PHONE_SCREEN, INTERVIEW, OFFER, ACCEPTED, REJECTED, DECLINED]
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái thành công
 *       422:
 *         description: Transition không hợp lệ
 */
router.patch("/:id/status", updateJobStatus);

/**
 * @swagger
 * /api/jobs/{id}/notes:
 *   get:
 *     summary: Danh sách ghi chú của ứng tuyển
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Danh sách notes
 */
router.get("/:id/notes", listNotes);
 
/**
 * @swagger
 * /api/jobs/{id}/notes:
 *   post:
 *     summary: Thêm ghi chú mới cho ứng tuyển
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content:
 *                 type: string
 *                 maxLength: 10000
 *                 description: Nội dung Markdown
 *               type:
 *                 type: string
 *                 enum: [QUESTION, ANSWER, IMPRESSION, FOLLOW_UP]
 *                 default: IMPRESSION
 *     responses:
 *       201:
 *         description: Tạo note thành công
 */
router.post("/:id/notes", createNote);
 
/**
 * @swagger
 * /api/jobs/{id}/notes/{noteId}:
 *   delete:
 *     summary: Xóa ghi chú
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
router.delete("/:id/notes/:noteId", deleteNote);

export default router;