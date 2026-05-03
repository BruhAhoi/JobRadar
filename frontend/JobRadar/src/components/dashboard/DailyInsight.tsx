import React from "react";

// ─────────────────────────────────────────────────────────────────────────────
// SPARKLE DECORATION SVG (góc phải dưới trong design)
// ─────────────────────────────────────────────────────────────────────────────
function SparkleDecor() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      className="absolute bottom-3 right-3 pointer-events-none opacity-20"
    >
      {/* 4-point star shape */}
      <path
        d="M32 4 L36 28 L60 32 L36 36 L32 60 L28 36 L4 32 L28 28 Z"
        fill="#6ea3f7"
      />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DAILY INSIGHT
// ─────────────────────────────────────────────────────────────────────────────
interface DailyInsightProps {
  title?: string;
  message?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
}

export default function DailyInsight({
  title = "Daily Insight",
  message = `Companies in your "Radar" are hiring 15% faster this week. Update your resume to include your latest React projects.`,
  ctaLabel = "Optimize Resume",
  onCtaClick,
}: DailyInsightProps) {
  return (
    <div
      className="relative rounded-xl overflow-hidden px-5 py-5"
      style={{
        background: "linear-gradient(135deg, rgba(15,35,80,0.9) 0%, rgba(20,40,90,0.85) 100%)",
        border: "1px solid rgba(79,126,248,0.2)",
      }}
    >
      {/* Sparkle decoration */}
      <SparkleDecor />

      {/* Title */}
      <p
        className="text-[12px] font-semibold uppercase tracking-widest mb-2"
        style={{ color: "#60a5fa" }}
      >
        {title}
      </p>

      {/* Message */}
      <p className="text-[13px] text-slate-300 leading-relaxed mb-4 pr-8">
        {message}
      </p>

      {/* CTA Button */}
      <button
        onClick={onCtaClick}
        className="flex items-center gap-2 h-9 px-4 rounded-lg text-[13px] font-semibold text-white transition-all active:scale-[0.98]"
        style={{
          background: "rgba(79,126,248,0.25)",
          border: "1px solid rgba(79,126,248,0.4)",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLButtonElement;
          el.style.background = "rgba(79,126,248,0.4)";
          el.style.borderColor = "rgba(79,126,248,0.6)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLButtonElement;
          el.style.background = "rgba(79,126,248,0.25)";
          el.style.borderColor = "rgba(79,126,248,0.4)";
        }}
      >
        {ctaLabel}
      </button>
    </div>
  );
}