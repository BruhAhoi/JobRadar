import React from "react";
import { MoreHorizontal } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
type BadgeVariant = "interviewing" | "offer" | "applied" | "rejected" | "default";

interface ActivityItem {
  id: string;
  companyLogo: React.ReactNode;
  // text được chia thành các phần để bold company name + highlight badge
  description: React.ReactNode;
  role: string;
  time: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// STATUS BADGE
// ─────────────────────────────────────────────────────────────────────────────
const BADGE_STYLES: Record<BadgeVariant, { bg: string; text: string; border: string }> = {
  interviewing: {
    bg: "rgba(59,130,246,0.15)",
    text: "#60a5fa",
    border: "rgba(59,130,246,0.25)",
  },
  offer: {
    bg: "rgba(34,197,94,0.12)",
    text: "#4ade80",
    border: "rgba(34,197,94,0.25)",
  },
  applied: {
    bg: "rgba(168,85,247,0.12)",
    text: "#c084fc",
    border: "rgba(168,85,247,0.25)",
  },
  rejected: {
    bg: "rgba(239,68,68,0.12)",
    text: "#f87171",
    border: "rgba(239,68,68,0.25)",
  },
  default: {
    bg: "rgba(255,255,255,0.06)",
    text: "#94a3b8",
    border: "rgba(255,255,255,0.1)",
  },
};

function StatusBadge({
  label,
  variant = "default",
}: {
  label: string;
  variant?: BadgeVariant;
}) {
  const s = BADGE_STYLES[variant];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium"
      style={{
        background: s.bg,
        color: s.text,
        border: `1px solid ${s.border}`,
      }}
    >
      {label}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPANY LOGO PLACEHOLDER
// ─────────────────────────────────────────────────────────────────────────────
function CompanyAvatar({
  name,
  bg = "#1e293b",
}: {
  name: string;
  bg?: string;
}) {
  return (
    <div
      className="w-9 h-9 rounded-lg flex items-center justify-center text-[11px] font-bold text-slate-300 shrink-0"
      style={{ background: bg, border: "1px solid rgba(255,255,255,0.08)" }}
    >
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ACTIVITY ROW
// ─────────────────────────────────────────────────────────────────────────────
function ActivityRow({ item }: { item: ActivityItem }) {
  return (
    <div
      className="flex items-center gap-4 px-5 py-4 group hover:bg-white/[0.025] transition-colors"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
    >
      {/* Company logo */}
      <div className="shrink-0">{item.companyLogo}</div>

      {/* Text content */}
      <div className="flex-1 min-w-0">
        <p className="text-[13.5px] text-slate-300 leading-snug">
          {item.description}
        </p>
        <p className="text-[12px] text-slate-500 mt-0.5">
          {item.role}
          <span className="mx-1.5 text-slate-700">•</span>
          {item.time}
        </p>
      </div>

      {/* More button */}
      <button className="w-7 h-7 rounded-md flex items-center justify-center text-slate-600 hover:text-slate-300 hover:bg-white/[0.06] transition-all opacity-0 group-hover:opacity-100 shrink-0">
        <MoreHorizontal size={15} strokeWidth={2} />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_ACTIVITIES: ActivityItem[] = [
  {
    id: "1",
    companyLogo: <CompanyAvatar name="St" bg="#1a2540" />,
    description: (
      <>
        Moved{" "}
        <span className="font-semibold text-white">Stripe</span>
        {" "}to{" "}
        <StatusBadge label="Interviewing" variant="interviewing" />
      </>
    ),
    role: "Senior Backend Engineer",
    time: "2 hours ago",
  },
  {
    id: "2",
    companyLogo: <CompanyAvatar name="Vc" bg="#1a2030" />,
    description: (
      <>
        New application sent to{" "}
        <span className="font-semibold text-white">Vercel</span>
      </>
    ),
    role: "Frontend Infrastructure",
    time: "5 hours ago",
  },
  {
    id: "3",
    companyLogo: <CompanyAvatar name="Li" bg="#0f1f2e" />,
    description: (
      <>
        Received{" "}
        <StatusBadge label="Offer" variant="offer" />
        {" "}from{" "}
        <span className="font-semibold text-white">Linear</span>
      </>
    ),
    role: "Software Engineer (Product)",
    time: "Yesterday",
  },
  {
    id: "4",
    companyLogo: <CompanyAvatar name="Gh" bg="#161b22" />,
    description: (
      <>
        Interview scheduled with{" "}
        <span className="font-semibold text-white">GitHub</span>
      </>
    ),
    role: "Security Engineer",
    time: "2 days ago",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// RECENT ACTIVITY COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
interface RecentActivityProps {
  activities?: ActivityItem[];
}

export default function RecentActivity({
  activities = MOCK_ACTIVITIES,
}: RecentActivityProps) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* ── HEADER ── */}
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

      {/* ── ROWS ── */}
      <div>
        {activities.map((item, index) => (
          <div
            key={item.id}
            style={
              index === activities.length - 1
                ? { borderBottom: "none" }
                : undefined
            }
          >
            <ActivityRow item={item} />
          </div>
        ))}
      </div>
    </div>
  );
}

// Re-export types cho pages dùng
export type { ActivityItem, BadgeVariant };