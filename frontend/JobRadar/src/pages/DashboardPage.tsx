import DashboardLayout from "../components/layout/DashboardLayout";
import { StatCardsGrid } from "../components/dashboard/StatCard";
import RecentActivity from "../components/dashboard/RecentActivity";
import UpcomingPanel from "../components/dashboard/UpcomingPanel";
import DailyInsight from "../components/dashboard/DailyInsight";
import ResponseRate from "../components/dashboard/ResponseRate";
import AnalyticsOverview from "../components/dashboard/AnalyticsOverview";

export default function DashboardPage() {
    return (
        <DashboardLayout activePage="dashboard" userName="Nguyen Van A " notificationCount={5}>
            {/* các component dashboard ở đây */}
            <div className="mb-6">
                <h1 className="text-[22px] font-bold text-white tracking-tight">
                    Engineering Dashboard
                </h1>
                <p className="text-[13px] text-slate-500 mt-0.5">
                    Welcome back. Your application radar is clear.
                </p>
            </div>
            <StatCardsGrid />
            <div className="mt-5">
                <AnalyticsOverview />
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-5 mt-5">

                {/* LEFT: Recent Activity */}
                <div className="min-w-0">
                    <RecentActivity />
                </div>

                {/* RIGHT: stacked panels */}
                <div className="flex flex-col gap-4">
                    <UpcomingPanel />
                    <DailyInsight />
                    <ResponseRate />
                </div>

            </div>
        </DashboardLayout>
    )
}