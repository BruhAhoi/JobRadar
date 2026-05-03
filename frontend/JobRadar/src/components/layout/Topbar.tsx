import React, { useState } from "react";
import { Bell, Search } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// TOPBAR
// ─────────────────────────────────────────────────────────────────────────────
interface TopbarProps {
  userName?: string;
  avatarUrl?: string;
  notificationCount?: number;
}

export default function Topbar({
  userName = "User",
  avatarUrl,
  notificationCount = 3,
}: TopbarProps) {
  const [searchFocused, setSearchFocused] = useState(false);

  // Lấy chữ cái đầu để làm avatar fallback
  const initials = userName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header
      className="fixed top-0 left-[248px] right-0 h-14 z-20 flex items-center px-5 gap-4"
      style={{
        background: "#0d1117",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* ── SEARCH BAR ── */}
      <div
        className="flex-1 max-w-[420px] flex items-center gap-2.5 h-8 px-3 rounded-lg transition-all"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: searchFocused
            ? "1px solid rgba(79,126,248,0.5)"
            : "1px solid rgba(255,255,255,0.08)",
          boxShadow: searchFocused
            ? "0 0 0 3px rgba(79,126,248,0.1)"
            : "none",
        }}
      >
        <Search
          size={14}
          strokeWidth={2}
          className="text-slate-500 shrink-0"
        />
        <input
          type="text"
          placeholder="Quick search..."
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className="flex-1 bg-transparent text-[13px] text-slate-300 placeholder:text-slate-600 outline-none"
        />
        {/* ⌘K shortcut badge */}
        <div
          className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] text-slate-600 font-mono shrink-0"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <span>⌘K</span>
        </div>
      </div>

      {/* ── SPACER ── */}
      <div className="flex-1" />

      {/* ── RIGHT ACTIONS ── */}
      <div className="flex items-center gap-3">

        {/* Notification bell */}
        <button className="relative w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] transition-all">
          <Bell size={17} strokeWidth={1.8} />
          {/* Badge */}
          {notificationCount > 0 && (
            <span
              className="absolute top-1 right-1 w-[7px] h-[7px] rounded-full"
              style={{ background: "#4f7ef8" }}
            />
          )}
        </button>

        {/* Avatar */}
        <button className="w-8 h-8 rounded-full overflow-hidden shrink-0 ring-2 ring-transparent hover:ring-blue-500/40 transition-all">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={userName}
              className="w-full h-full object-cover"
            />
          ) : (
            /* Fallback gradient avatar */
            <div
              className="w-full h-full flex items-center justify-center text-[11px] font-bold text-white"
              style={{
                background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
              }}
            >
              {initials}
            </div>
          )}
        </button>
      </div>
    </header>
  );
}