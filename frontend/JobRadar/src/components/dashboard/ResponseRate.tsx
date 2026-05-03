import React from "react";

// ─────────────────────────────────────────────────────────────────────────────
// CIRCULAR PROGRESS
// ─────────────────────────────────────────────────────────────────────────────
interface CircularProgressProps {
  percentage: number; // 0–100
  size?: number;      // px
  strokeWidth?: number;
  trackColor?: string;
  progressColor?: string;
}

function CircularProgress({
  percentage,
  size = 72,
  strokeWidth = 6,
  trackColor = "rgba(255,255,255,0.06)",
  progressColor = "#4f7ef8",
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const center = size / 2;

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>

      {/* Center text */}
      <span
        className="absolute text-[13px] font-bold text-white"
        style={{ lineHeight: 1 }}
      >
        {percentage}%
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RESPONSE RATE CARD
// ─────────────────────────────────────────────────────────────────────────────
interface ResponseRateProps {
  percentage?: number;
  label?: string;
  description?: string;
}

export default function ResponseRate({
  percentage = 65,
  label = "Above average",
  description = "Top 5% of candidates in your niche.",
}: ResponseRateProps) {
  return (
    <div
      className="rounded-xl px-5 py-5"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Section label */}
      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-4">
        Response Rate
      </p>

      {/* Content row */}
      <div className="flex items-center gap-4">
        {/* Circular chart */}
        <CircularProgress percentage={percentage} />

        {/* Text info */}
        <div className="min-w-0">
          <p className="text-[14px] font-semibold text-white leading-tight">
            {label}
          </p>
          <p className="text-[12px] text-slate-500 mt-1 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}