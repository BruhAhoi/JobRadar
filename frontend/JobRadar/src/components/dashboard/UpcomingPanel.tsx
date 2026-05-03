import React from "react";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface UpcomingItem {
  id: string;
  company: string;
  role: string;
  date: string; // e.g. "OCT 14"
  time: string; // e.g. "10:00 AM"
  timeHighlight?: boolean; // true = xanh, false = mờ
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_UPCOMING: UpcomingItem[] = [
  {
    id: "1",
    company: "Airbnb",
    role: "System Design Round",
    date: "OCT 14",
    time: "10:00 AM",
    timeHighlight: true,
  },
  {
    id: "2",
    company: "Anthropic",
    role: "Technical Screen",
    date: "OCT 15",
    time: "02:30 PM",
    timeHighlight: false,
  },
  {
    id: "3",
    company: "PostHog",
    role: "Culture Fit",
    date: "OCT 17",
    time: "11:00 AM",
    timeHighlight: false,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// UPCOMING ITEM ROW
// ─────────────────────────────────────────────────────────────────────────────
function UpcomingRow({ item }: { item: UpcomingItem }) {
  return (
    <div
      className="flex items-center justify-between py-3.5 gap-4"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
    >
      {/* Left: accent bar + company info */}
      <div className="flex items-start gap-3 min-w-0">
        {/* Vertical accent bar */}
        <div
          className="w-[3px] rounded-full mt-0.5 shrink-0"
          style={{
            height: "36px",
            background: item.timeHighlight
              ? "#4f7ef8"
              : "rgba(255,255,255,0.12)",
          }}
        />
        <div className="min-w-0">
          <p className="text-[13.5px] font-semibold text-white leading-tight truncate">
            {item.company}
          </p>
          <p className="text-[12px] text-slate-500 mt-0.5 truncate">
            {item.role}
          </p>
        </div>
      </div>

      {/* Right: date + time */}
      <div className="text-right shrink-0">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
          {item.date}
        </p>
        <p
          className="text-[12px] font-medium mt-0.5"
          style={{
            color: item.timeHighlight ? "#60a5fa" : "#64748b",
          }}
        >
          {item.time}
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// UPCOMING PANEL
// ─────────────────────────────────────────────────────────────────────────────
interface UpcomingPanelProps {
  items?: UpcomingItem[];
}

export default function UpcomingPanel({
  items = MOCK_UPCOMING,
}: UpcomingPanelProps) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <h2 className="text-[14px] font-semibold text-white">Upcoming</h2>
      </div>

      {/* Rows */}
      <div className="px-5">
        {items.map((item, index) => (
          <div
            key={item.id}
            style={
              index === items.length - 1
                ? { borderBottom: "none" }
                : undefined
            }
          >
            <UpcomingRow item={item} />
          </div>
        ))}
      </div>
    </div>
  );
}

export type { UpcomingItem };