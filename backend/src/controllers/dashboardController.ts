import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import prisma from "../libs/db";
import { Status } from "../generated/prisma";

//helper function to get job counts by status
function success<T>(data: T) {
    return { success: true, data };
}

function startOfDay(d: Date) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function endOfDay(d: Date) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}

function addDays(d: Date, days: number) {
    return new Date(d.getTime() + days * 24 * 60 * 60 * 1000);
}

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const range = (req.query.range as string) || "all";
        let dateFilter: { gte: Date } | undefined;
        if (range !== "all") {
            const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
            dateFilter = { gte: new Date(Date.now() - days * 86400_000) };
        }
        const where = {
            userId,
            ...(dateFilter ? { appliedAt: dateFilter } : {}),
        };

        const [allJobs, byStatus, bySource] = await Promise.all([
            prisma.jobApplication.findMany({
                where,
                select: { status: true, appliedAt: true },
                orderBy: { appliedAt: "asc" }
            }),
            prisma.jobApplication.groupBy({
                by: ["status"],
                where,
                _count: { _all: true },
            }),
            prisma.jobApplication.groupBy({
                by: ["source"],
                where,
                _count: { _all: true },
            })
        ]);

        const total = allJobs.length;
        const activeSet = new Set<Status>(["APPLIED", "PHONE_SCREEN", "INTERVIEW", "OFFER"]);
        const active = allJobs.filter((j) => activeSet.has(j.status)).length;

        const totalWithResponse = allJobs.filter((j) => ["PHONE_SCREEN", "INTERVIEW", "OFFER", "ACCEPTED", "REJECTED", "DECLINED"].includes(j.status)).length;

        const passedCv = allJobs.filter((j) => ["PHONE_SCREEN", "INTERVIEW", "OFFER", "ACCEPTED"].includes(j.status)).length;
        const offers = allJobs.filter((j) => ["OFFER", "ACCEPTED"].includes(j.status)).length;
        const accepted = allJobs.filter((j) => j.status === "ACCEPTED").length;

        const cvPassRate = total > 0 ? Math.round((passedCv / total) * 100) : 0;
        const offerRate = total > 0 ? Math.round((offers / total) * 100) : 0;
        const acceptRate = offers > 0 ? Math.round((accepted / offers) * 100) : 0;

        const weeklyMap: Record<string, number> = {};
        const now = startOfDay(new Date());

        for (let w = 11; w >= 0; w--) {
            const weekStart = addDays(now, -7 * w);
            weeklyMap[weekStart.toISOString().slice(0, 10)] = 0;
        }

        allJobs.forEach((job) => {
            const d = startOfDay(job.appliedAt)
            const dayOfWeek = (d.getDay() + 6) % 7;
            const weekStart = addDays(d, -dayOfWeek);
            const key = weekStart.toISOString().slice(0, 10);
            if (key in weeklyMap) weeklyMap[key]++;
        });

        const weeklySeries = Object.entries(weeklyMap)
            .map(([week, count]) => ({ week, count }))
            .sort((a, b) => a.week.localeCompare(b.week));

        const threeDaysLater = new Date(Date.now() + 3 * 86400_000);
        const upcomingDeadlines = await prisma.jobApplication.findMany({
            where: {
                userId,
                deadlineAt: { gte: new Date(), lte: threeDaysLater },
                status: { in: ["APPLIED", "PHONE_SCREEN", "INTERVIEW", "OFFER"] },
            },
            select: { id: true, companyName: true, position: true, deadlineAt: true, status: true },
            orderBy: { deadlineAt: "asc" },
        });

        return res.json(
            success({
                summary: { total, active, cvPassRate, offerRate, acceptRate },
                byStatus: byStatus.map((s) => ({ status: s.status, count: s._count._all })),
                bySource: bySource.map((s) => ({ source: s.source, count: s._count._all })),
                weeklySeries,
                upcomingDeadlines,
            })
        );
    } catch (err) {
        console.error("[getDashboardStats]", err);
        return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
    }
}

const EXPORT_LIMIT = 10;
const exportTracker = new Map<String, { count: number, resetAt: number }>();

export const exportCsv = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const now = Date.now();

        const tracker = exportTracker.get(userId);
        if (tracker && now < tracker.resetAt) {
            if (tracker.count >= EXPORT_LIMIT) {
                return res.status(429).json({ success: false, error: { code: "EXPORT_LIMIT", message: "Export limit reached. Try again later." } });
            }
            tracker.count++;
        } else {
            exportTracker.set(userId, { count: 1, resetAt: startOfDay(new Date(now + 86400_000)).getTime() });
        }

        const jobs = await prisma.jobApplication.findMany({
            where: { userId },
            orderBy: { appliedAt: "desc" }
        })

        const headers = [
            "id", "companyName", "position", "status", "source",
            "jobUrl", "salaryNote", "notes", "appliedAt", "deadlineAt",
            "createdAt", "updatedAt",
        ];

        const escape = (v: unknown) => {
            if (v === null || v === undefined) return "";
            const s = String(v).replace(/"/g, '""');
            return /[,"\n\r]/.test(s) ? `"${s}"` : s;
        };
        const rows = [
            headers.join(","),
            ...jobs.map((j) =>
                headers.map((h) => escape((j as any)[h])).join(",")
            ),
        ].join("\n");

        res.setHeader("Content-Type", "text/csv; charset=utf-8");
        res.setHeader("Content-Disposition", `attachment; filename="jobradar-${Date.now()}.csv"`);
        return res.send("\uFEFF" + rows);
    } catch (err) {
        console.error("[exportCsv]", err);
        return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
    }
}