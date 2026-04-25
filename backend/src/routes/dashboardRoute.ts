import { Router } from "express";
import { exportCsv, getDashboardStats } from "../controllers/dashboardController";
// import { exportCsv } from "../controllers/dashboardController";
import { protectedRoute } from "../middlewares/authMiddleware";
 
const dashboardRouter = Router();
const exportRouter    = Router();
 
dashboardRouter.use(protectedRoute);
exportRouter.use(protectedRoute);
 
/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Thống kê tổng quan cho dashboard
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: range
 *         schema:
 *           type: string
 *           enum: [7d, 30d, 3m, all]
 *           default: all
 *         description: Khoảng thời gian thống kê
 *     responses:
 *       200:
 *         description: Thống kê thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     summary:
 *                       type: object
 *                       properties:
 *                         total:      { type: integer }
 *                         active:     { type: integer }
 *                         cvPassRate: { type: integer, description: "% pass CV" }
 *                         offerRate:  { type: integer, description: "% nhận offer" }
 *                         acceptRate: { type: integer, description: "% chấp nhận offer" }
 *                     byStatus:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           status: { type: string }
 *                           count:  { type: integer }
 *                     bySource:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           source: { type: string }
 *                           count:  { type: integer }
 *                     weeklySeries:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           week:  { type: string, format: date }
 *                           count: { type: integer }
 *                     upcomingDeadlines:
 *                       type: array
 *                       description: Job có deadline trong 3 ngày tới
 */
dashboardRouter.get("/stats", getDashboardStats);

/**
 * @swagger
 * /api/export/csv:
 *   get:
 *     summary: Export danh sách ứng tuyển ra CSV (max 10 lần/ngày)
 *     tags: [Export]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: File CSV
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *       429:
 *         description: Vượt quá giới hạn export (10 lần/ngày)
 */
exportRouter.get("/csv", exportCsv);

export { dashboardRouter, exportRouter };