import { MoreHorizontal } from "lucide-react";
import type { JobApplication } from "../../services/jobService";
import { STATUS_CONFIG } from "../../types/constaint";

const BADGE_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  APPLIED: { bg: "rgba(168,85,247,0.12)", text: "#c084fc", border: "rgba(168,85,247,0.25)" },
  PHONE_SCREEN: { bg: "rgba(59,130,246,0.15)", text: "#60a5fa", border: "rgba(59,130,246,0.25)" },
  INTERVIEW: { bg: "rgba(59,130,246,0.15)", text: "#60a5fa", border: "rgba(59,130,246,0.25)" },
  OFFER: { bg: "rgba(34,197,94,0.12)", text: "#4ade80", border: "rgba(34,197,94,0.25)" },
  ACCEPTED: { bg: "rgba(34,197,94,0.12)", text: "#4ade80", border: "rgba(34,197,94,0.25)" },
  REJECTED: { bg: "rgba(239,68,68,0.12)", text: "#f87171", border: "rgba(239,68,68,0.25)" },
  DECLINED: { bg: "rgba(255,255,255,0.06)", text: "#94a3b8", border: "rgba(255,255,255,0.1)" },
};

function StatusBadge({ label, status }: { label: string; status: string }) {
  const s = BADGE_STYLES[status] || BADGE_STYLES.APPLIED;
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium"
      style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}
    >
      {label}
    </span>
  );
}

function CompanyAvatar({ name, bg = "#1e293b" }: { name: string; bg?: string }) {
  return (
    <div
      className="w-9 h-9 rounded-lg flex items-center justify-center text-[11px] font-bold text-slate-300 shrink-0"
      style={{ background: bg, border: "1px solid rgba(255,255,255,0.08)" }}
    >
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}

function ActivityRow({ job }: { job: JobApplication }) {
  const statusLabel = STATUS_CONFIG[job.status as keyof typeof STATUS_CONFIG]?.label || job.status;

  const timeAgo = (() => {
    const diff = Date.now() - new Date(job.appliedAt).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(job.appliedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  })();

  return (
    <div
      className="flex items-center gap-4 px-5 py-4 group hover:bg-white/[0.025] transition-colors"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
    >
      <CompanyAvatar name={job.companyName} />
      <div className="flex-1 min-w-0">
        <p className="text-[13.5px] text-slate-300 leading-snug">
          <span className="font-semibold text-white">{job.companyName}</span>
          {" "}—{" "}
          <StatusBadge label={statusLabel} status={job.status} />
        </p>
        <p className="text-[12px] text-slate-500 mt-0.5">
          {job.position}
          <span className="mx-1.5 text-slate-700">•</span>
          {timeAgo}
        </p>
      </div>
      <button className="w-7 h-7 rounded-md flex items-center justify-center text-slate-600 hover:text-slate-300 hover:bg-white/[0.06] transition-all opacity-0 group-hover:opacity-100 shrink-0">
        <MoreHorizontal size={15} strokeWidth={2} />
      </button>
    </div>
  );
}

interface RecentActivityProps {
  jobs?: JobApplication[];
}

export default function RecentActivity({ jobs = [] }: RecentActivityProps) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <h2 className="text-[14px] font-semibold text-white">
          Recent Activity
        </h2>
        <a
          href="/tracker"
          className="text-[12px] text-blue-400 hover:text-blue-300 transition-colors font-medium"
        >
          View All
        </a>
      </div>

      <div>
        {jobs.length === 0 ? (
          <div className="px-5 py-8 text-center text-[13px] text-slate-500">
            No applications yet
          </div>
        ) : (
          jobs.slice(0, 10).map((job, index) => (
            <div
              key={job.id}
              style={index === Math.min(jobs.length, 10) - 1 ? { borderBottom: "none" } : undefined}
            >
              <ActivityRow job={job} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
