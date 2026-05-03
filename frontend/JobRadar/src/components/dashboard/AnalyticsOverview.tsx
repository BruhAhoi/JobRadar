import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES & CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
type TimeRange = "7d" | "30d" | "3m" | "all";

const TIME_TABS: { label: string; value: TimeRange }[] = [
  { label: "7 days",   value: "7d"  },
  { label: "30 days",  value: "30d" },
  { label: "3 months", value: "3m"  },
  { label: "All time", value: "all" },
];

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────
const WEEKLY_DATA = [
  { week: "W1", count: 8  },
  { week: "W2", count: 14 },
  { week: "W3", count: 22 },
  { week: "W4", count: 18 },
  { week: "W5", count: 30 },
  { week: "W6", count: 24 },
];

const STATUS_DATA = [
  { name: "Applied",  value: 72, color: "#4f7ef8" },
  { name: "Interview",value: 18, color: "#f59e0b" },
  { name: "Offer",    value: 8,  color: "#22c55e" },
  { name: "Rejected", value: 26, color: "#64748b" },
];

const JOB_SOURCES = [
  { name: "ITviec",   percent: 42, color: "#4f7ef8" },
  { name: "LinkedIn", percent: 28, color: "#4f7ef8" },
  { name: "TopCV",    percent: 15, color: "#4f7ef8" },
  { name: "Referral", percent: 10, color: "#4f7ef8" },
];

const TOTAL = STATUS_DATA.reduce((s, d) => s + d.value, 0);

// ─────────────────────────────────────────────────────────────────────────────
// SHARED CARD STYLE
// ─────────────────────────────────────────────────────────────────────────────
const cardStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.025)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: "12px",
};

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOM TOOLTIP for AreaChart
// ─────────────────────────────────────────────────────────────────────────────
function AreaTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-3 py-2 rounded-lg text-[12px] text-white"
      style={{
        background: "#1e2d45",
        border: "1px solid rgba(79,126,248,0.3)",
      }}
    >
      <p className="text-slate-400">{label}</p>
      <p className="font-semibold mt-0.5">{payload[0].value} applications</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// APPLICATIONS PER WEEK — Area Chart
// ─────────────────────────────────────────────────────────────────────────────
function ApplicationsPerWeek() {
  return (
    <div className="p-5" style={cardStyle}>
      <h3 className="text-[13.5px] font-semibold text-white mb-4">
        Applications per Week
      </h3>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={WEEKLY_DATA} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#4f7ef8" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#4f7ef8" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="week"
            tick={{ fill: "#475569", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#475569", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<AreaTooltip />} cursor={{ stroke: "rgba(79,126,248,0.2)", strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#4f7ef8"
            strokeWidth={2.5}
            fill="url(#areaGrad)"
            dot={false}
            activeDot={{ r: 4, fill: "#4f7ef8", strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STATUS DISTRIBUTION — Donut Chart
// ─────────────────────────────────────────────────────────────────────────────
function StatusDistribution() {
  return (
    <div className="p-5" style={cardStyle}>
      <h3 className="text-[13.5px] font-semibold text-white mb-4">
        Status Distribution
      </h3>

      <div className="flex items-center gap-5">
        {/* Donut */}
        <div className="relative shrink-0" style={{ width: 130, height: 130 }}>
          <PieChart width={130} height={130}>
            <Pie
              data={STATUS_DATA}
              cx={60}
              cy={60}
              innerRadius={42}
              outerRadius={60}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              strokeWidth={0}
            >
              {STATUS_DATA.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[18px] font-bold text-white leading-none">{TOTAL}</span>
            <span className="text-[9px] font-semibold uppercase tracking-widest text-slate-500 mt-0.5">
              Total
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2.5 flex-1 min-w-0">
          {STATUS_DATA.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: item.color }}
              />
              <span className="text-[12px] text-slate-300 truncate">
                {item.name}{" "}
                <span className="text-slate-500">({item.value})</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// JOB SOURCES — Horizontal Progress Bars
// ─────────────────────────────────────────────────────────────────────────────
function JobSources() {
  return (
    <div className="p-5" style={cardStyle}>
      <h3 className="text-[13.5px] font-semibold text-white mb-5">
        Job Sources
      </h3>

      <div className="flex flex-col gap-4">
        {JOB_SOURCES.map((source) => (
          <div key={source.name}>
            {/* Label row */}
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[12.5px] text-slate-300">{source.name}</span>
              <span className="text-[12px] font-semibold text-slate-400">
                {source.percent}%
              </span>
            </div>
            {/* Track */}
            <div
              className="w-full rounded-full overflow-hidden"
              style={{ height: "5px", background: "rgba(255,255,255,0.07)" }}
            >
              {/* Fill */}
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${source.percent}%`,
                  background: `linear-gradient(90deg, #3b6aef 0%, #4f7ef8 100%)`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ANALYTICS OVERVIEW — main export
// ─────────────────────────────────────────────────────────────────────────────
export default function AnalyticsOverview() {
  const [activeRange, setActiveRange] = useState<TimeRange>("30d");

  return (
    <div>
      {/* ── Section header + time filter ── */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[16px] font-semibold text-white">
          Analytics Overview
        </h2>

        {/* Time range tabs */}
        <div
          className="flex items-center p-0.5 rounded-lg gap-0.5"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {TIME_TABS.map((tab) => {
            const isActive = activeRange === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveRange(tab.value)}
                className="px-3 py-1.5 rounded-md text-[12px] font-medium transition-all"
                style={{
                  background: isActive ? "#4f7ef8" : "transparent",
                  color: isActive ? "#fff" : "#64748b",
                }}
                onMouseEnter={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLButtonElement).style.color = "#94a3b8";
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLButtonElement).style.color = "#64748b";
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Charts grid: [area + donut] + [job sources] ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_1fr_280px] gap-4">
        <ApplicationsPerWeek />
        <StatusDistribution />
        <JobSources />
      </div>
    </div>
  );
}