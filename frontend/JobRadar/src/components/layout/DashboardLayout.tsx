import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface DashboardLayoutProps {
  children: React.ReactNode;
  activePage?: "dashboard" | "tracker" | "insights" | "settings";
  userName?: string;
  avatarUrl?: string;
  notificationCount?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// LAYOUT
// ─────────────────────────────────────────────────────────────────────────────
export default function DashboardLayout({
  children,
  activePage = "dashboard",
  userName = "User",
  avatarUrl,
  notificationCount = 3,
}: DashboardLayoutProps) {
  return (
    <div
      className="fixed inset-0 flex font-sans text-slate-200 overflow-hidden"
      style={{ background: "#0d1117" }}
    >
      {/* Fixed background */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 20% 0%, rgba(15,35,80,0.3) 0%, transparent 60%)",
        }}
      />

      {/* ── SIDEBAR (fixed left) ── */}
      <div
        className="relative z-30 flex-none w-[248px] h-full flex flex-col overflow-hidden"
        style={{
          background: "#080e1a",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Sidebar activePage={activePage} />
      </div>


      {/* ── TOPBAR (fixed top, after sidebar) ── */}
      <div className="relative z-10 flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* TOPBAR */}
        <div
          className="relative z-20 flex-none h-14 flex items-center px-5 gap-4"
          style={{
            background: "#0d1117",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <Topbar
            userName={userName}
            avatarUrl={avatarUrl}
            notificationCount={notificationCount}
          />
        </div>


        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="px-6 py-6">
            {children}
          </div>
        </main>
        </div>
      </div>
      );
}