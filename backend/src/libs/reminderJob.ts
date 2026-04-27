import cron from 'node-cron';
import nodemailer from 'nodemailer';
import prisma from './db';
import { buildReminderEmail } from './reminderTemplate';

const mailUser = process.env.MAIL_USER;
const mailPassword = process.env.MAIL_PASSWORD?.replace(/\\n/g, '\n');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: mailUser,
        pass: mailPassword,
    }
});

export const startReminderCron = () => {
    if (!mailUser || !mailPassword) {
        console.warn("[Reminder] MAIL_USER hoặc MAIL_PASSWORD chưa cấu hình — bỏ qua reminder job");
        return;
    }
    cron.schedule("0 1 * * *", async () => {
        console.log("[Reminder] Running daily reminder job...");
        await sendDeadlineReminders();
    })

    console.log("[Reminder] Đã khởi động reminder job (08:00 ICT hàng ngày)");
}

export const sendDeadlineReminders = async () => {
    try {
        const now = new Date();
        const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

        const jobs = await prisma.jobApplication.findMany({
            where: {
                deadlineAt: { gte: now, lte: in24h },
                status: { in: ["APPLIED", "PHONE_SCREEN", "INTERVIEW", "OFFER"] },
                user: { deletedAt: null },
            },
            include: {
                user: { select: { email: true, id: true, name: true } }
            }
        });

        if (jobs.length === 0) {
            console.log("[Reminder] Không có deadline nào trong 24h tới");
            return;
        }

        const byUser = new Map<
            string,
            {
                user: { id: string; email: string; name: string };
                jobs: typeof jobs;
            }
        >();

        for (const job of jobs) {
            const uid = job.user.id;
            if (!byUser.has(uid)) {
                byUser.set(uid, { user: job.user, jobs: [] });
            }
            byUser.get(uid)?.jobs.push(job);
        }

        let successCount = 0;
        let failCount = 0;

        for (const { user, jobs: userJobs } of byUser.values()) {
            try {
                const html = buildReminderEmail(
                    user.name,
                    userJobs.map((j) => ({
                        companyName: j.companyName,
                        position: j.position,
                        deadlineAt: j.deadlineAt!,
                        status: j.status,
                    }))
                );

                await transporter.sendMail({
                    from: `"JobRadar" <${mailUser}>`,
                    to: user.email,
                    subject: `⏰ Nhắc nhở: ${userJobs.length} ứng tuyển sắp đến hạn`,
                    html,
                });

                successCount++;
                console.log(`[Reminder] Đã gửi email cho ${user.email} (${userJobs.length} jobs)`);
            } catch (err) {
                failCount++;
                console.error(`[Reminder] Lỗi gửi email cho ${user.email}:`, err);
            }
        }

        console.log(
            `[Reminder] Hoàn thành: ${successCount} thành công, ${failCount} thất bại`
        );
    } catch (err) {
        console.error("[Reminder] Lỗi hệ thống:", err);
    }
}