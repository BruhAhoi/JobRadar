
import { ExternalLink, AlertTriangle } from "lucide-react";
import type { JobCardData, JobSource } from "../../types/status";
import { STATUS_CONFIG, SOURCE_CONFIG } from "../../types/constaint";


// ─────────────────────────────────────────────────────────────────────────────
// SOURCE ICON — small icon per platform
// ─────────────────────────────────────────────────────────────────────────────
function SourceIcon({ source }: { source: JobSource }) {
  const { label, iconColor, bg } = SOURCE_CONFIG[source];

  // Dùng chữ cái đầu làm icon placeholder
  const letter = label[0].toUpperCase();

  return (
    <span
      className="inline-flex items-center justify-center w-4 h-4 rounded text-[9px] font-bold shrink-0"
      style={{ background: bg, color: iconColor }}
    >
      {letter}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// JOB CARD
// ─────────────────────────────────────────────────────────────────────────────
interface JobCardProps {
  data: JobCardData;
  onClick?: (id: string) => void;
}

export default function JobCard({ data, onClick }: JobCardProps) {
  const {
    id,
    company,
    position,
    status,
    source,
    appliedAt,
    deadline,
    deadlineWarning,
    highlighted,
    jobUrl,
  } = data;

  const { color } = STATUS_CONFIG[status];
  const { label: sourceLabel } = SOURCE_CONFIG[source];

  return (
    <div
      onClick={() => onClick?.(id)}
      className="group relative rounded-xl px-3.5 py-3 cursor-pointer transition-all duration-150 hover:translate-y-[-1px]"
      style={{
        background: highlighted
          ? "rgba(245,158,11,0.06)"
          : "rgba(255,255,255,0.03)",
        border: highlighted
          ? `1px solid rgba(245,158,11,0.25)`
          : "1px solid rgba(255,255,255,0.07)",
        // Left accent bar khi highlighted
        borderLeft: highlighted
          ? `3px solid ${color}`
          : "1px solid rgba(255,255,255,0.07)",
        boxShadow: highlighted
          ? "0 4px 20px rgba(245,158,11,0.08)"
          : "none",
      }}
    >
      {/* ── ROW 1: Company name + external link ── */}
      <div className="flex items-start justify-between gap-2 mb-1">
        <h3 className="text-[13.5px] font-semibold text-white leading-tight">
          {company}
        </h3>

        {/* External link icon */}
        {jobUrl && (
          <a
            href={jobUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="shrink-0 text-slate-600 hover:text-blue-400 transition-colors mt-0.5"
          >
            <ExternalLink size={12} strokeWidth={2} />
          </a>
        )}

        {/* Highlighted: diamond icon thay external link */}
        {!jobUrl && highlighted && (
          <span className="shrink-0 mt-0.5" style={{ color }}>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor">
              <path d="M6 0L7.5 4.5H12L8.25 7.5L9.75 12L6 9L2.25 12L3.75 7.5L0 4.5H4.5L6 0Z" />
            </svg>
          </span>
        )}
      </div>

      {/* ── ROW 2: Position/role ── */}
      <p className="text-[12px] text-slate-500 leading-tight mb-3 truncate">
        {position}
      </p>

      {/* ── DEADLINE WARNING (chỉ hiện nếu có) ── */}
      {deadlineWarning && (
        <div
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg mb-3 text-[11.5px] font-medium"
          style={{
            background: "rgba(245,158,11,0.12)",
            border: "1px solid rgba(245,158,11,0.2)",
            color: "#fbbf24",
          }}
        >
          <AlertTriangle size={11} strokeWidth={2.5} className="shrink-0" />
          {deadlineWarning}
        </div>
      )}

      {/* ── ROW 3: Source + timestamp ── */}
      <div className="flex items-center justify-between gap-2">
        {/* Source chip */}
        <div className="flex items-center gap-1.5">
          <SourceIcon source={source} />
          <span className="text-[11px] text-slate-500">{sourceLabel}</span>
        </div>

        {/* Timestamp / deadline */}
        <span
          className="text-[11px] shrink-0"
          style={{
            color: deadline ? "#60a5fa" : "#475569",
            fontWeight: deadline ? 500 : 400,
          }}
        >
          {deadline ?? appliedAt}
        </span>
      </div>
    </div>
  );
}

export type { JobCardProps };