import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { StatCardsGrid } from "../components/dashboard/StatCard";
import RecentActivity from "../components/dashboard/RecentActivity";
import UpcomingPanel from "../components/dashboard/UpcomingPanel";
import DailyInsight from "../components/dashboard/DailyInsight";
import ResponseRate from "../components/dashboard/ResponseRate";
import AnalyticsOverview from "../components/dashboard/AnalyticsOverview";
import { useAuthStore } from "../stores/useAuthStore";
import { dashboardService, type DashboardData } from "../services/dashboardService";
import { jobService, type JobApplication } from "../services/jobService";

export default function DashboardPage() {
    const { user } = useAuthStore();
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [recentJobs, setRecentJobs] = useState<JobApplication[]>([]);
    const [timeRange, setTimeRange] = useState<string>("30d");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [stats, jobs] = await Promise.all([
                    dashboardService.getStats(timeRange),
                    jobService.list({ limit: 10, sortBy: "appliedAt", order: "desc" }),
                ]);
                setDashboardData(stats);
                setRecentJobs(jobs.data);
            } catch (err) {
                console.error("Failed to fetch dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [timeRange]);

    return (
        <DashboardLayout activePage="dashboard" userName={user?.name || "Guest"} notificationCount={5}>
            <div className="mb-6">
                <h1 className="text-[22px] font-bold text-white tracking-tight">
                    Engineering Dashboard
                </h1>
                <p className="text-[13px] text-slate-500 mt-0.5">
                    Welcome back, {user?.name || "Guest"}! Your application radar is clear.
                </p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full" />
                </div>
            ) : (
                <>
                    <StatCardsGrid summary={dashboardData?.summary} />
                    <div className="mt-5">
                        <AnalyticsOverview
                            weeklySeries={dashboardData?.weeklySeries}
                            byStatus={dashboardData?.byStatus}
                            bySource={dashboardData?.bySource}
                            onRangeChange={setTimeRange}
                            activeRange={timeRange}
                        />
                    </div>
                    <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-5 mt-5">
                        <div className="min-w-0">
                            <RecentActivity jobs={recentJobs} />
                        </div>
                        <div className="flex flex-col gap-4">
                            <UpcomingPanel deadlines={dashboardData?.upcomingDeadlines} />
                            <DailyInsight />
                            <ResponseRate percentage={dashboardData?.summary?.cvPassRate} />
                        </div>
                    </div>
                </>
            )}
        </DashboardLayout>
    )
}