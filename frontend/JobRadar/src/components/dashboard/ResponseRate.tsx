function CircularProgress({
  percentage,
  size = 72,
  strokeWidth = 6,
  trackColor = "rgba(255,255,255,0.06)",
  progressColor = "#4f7ef8",
}: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  trackColor?: string;
  progressColor?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const center = size / 2;

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
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
      <span className="absolute text-[13px] font-bold text-white" style={{ lineHeight: 1 }}>
        {percentage}%
      </span>
    </div>
  );
}

interface ResponseRateProps {
  percentage?: number;
}

export default function ResponseRate({ percentage }: ResponseRateProps) {
  const pct = percentage ?? 0;
  const label = pct >= 50 ? "Above average" : pct >= 20 ? "Average" : "Needs improvement";
  const description = pct >= 50
    ? "Strong response rate — keep it up!"
    : pct >= 20
    ? "Room for improvement in applications."
    : "Try optimizing your resume and cover letter.";

  return (
    <div
      className="rounded-xl px-5 py-5"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-4">
        CV Pass Rate
      </p>

      <div className="flex items-center gap-4">
        <CircularProgress percentage={pct} />
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
