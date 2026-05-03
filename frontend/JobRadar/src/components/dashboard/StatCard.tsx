import React from "react";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: string;
  sub: string;
  subHighlight?: string; // phần text highlight màu xanh/xanh lá
  subPosition?: "after" | "before"; // highlight trước hay sau sub text
  icon: React.ReactNode;
}

// ─────────────────────────────────────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────────────────────────────────────
export default function StatCard({
  label,
  value,
  sub,
  subHighlight,
  subPosition = "after",
  icon,
}: StatCardProps) {
  return (
    <div
      className="relative flex flex-col gap-3 px-5 py-4 rounded-xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* ── LABEL + ICON row ── */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
          {label}
        </span>
        {/* Icon box */}
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-blue-400"
          style={{ background: "rgba(79,126,248,0.12)" }}
        >
          {icon}
        </div>
      </div>

      {/* ── VALUE ── */}
      <div className="flex items-end gap-2">
        <span className="text-[28px] font-bold text-white leading-none tracking-tight">
          {value}
        </span>
      </div>

      {/* ── SUB TEXT ── */}
      <p className="text-[12px] text-slate-500 leading-none">
        {subPosition === "before" && subHighlight && (
          <span className="text-emerald-400 font-medium mr-1">{subHighlight}</span>
        )}
        {sub}
        {subPosition === "after" && subHighlight && (
          <span className="text-emerald-400 font-medium ml-1">{subHighlight}</span>
        )}
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STAT CARDS GRID — convenience wrapper dùng trực tiếp trong DashboardPage
// ─────────────────────────────────────────────────────────────────────────────

// Icons inline (tránh import thêm nếu không dùng lucide)
function IconSend() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function IconBriefcase() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  );
}

function IconFileCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <polyline points="9 15 11 17 15 13" />
    </svg>
  );
}

function IconTarget() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

export function StatCardsGrid() {
  const stats = [
    {
      label: "Total Applications",
      value: "124",
      sub: "this month",
      subHighlight: "+12%",
      subPosition: "before" as const,
      icon: <IconSend />,
    },
    {
      label: "Active Applications",
      value: "42",
      sub: "in-progress",
      icon: <IconBriefcase />,
    },
    {
      label: "CV Pass Rate",
      value: "68%",
      sub: "above average",
      subHighlight: "↑",
      subPosition: "before" as const,
      icon: <IconFileCheck />,
    },
    {
      label: "Offer Rate",
      value: "12%",
      sub: "target: 15%",
      icon: <IconTarget />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((s) => (
        <StatCard key={s.label} {...s} />
      ))}
    </div>
  );
}