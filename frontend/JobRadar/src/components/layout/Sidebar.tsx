import React from "react";
import {
  LayoutDashboard,
  Kanban,
  BarChart2,
  Settings,
  HelpCircle,
  LogOut,
  Plus,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  active?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// RADAR SVG (nhỏ, dùng trong logo)
// ─────────────────────────────────────────────────────────────────────────────
function RadarLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect width="28" height="28" rx="7" fill="#1e3a6e" />
      <circle cx="14" cy="14" r="8" stroke="#6ea3f7" strokeWidth="1.4" />
      <circle cx="14" cy="14" r="2.5" fill="#6ea3f7" />
      <line x1="14" y1="6"  x2="14" y2="9"  stroke="#6ea3f7" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="14" y1="19" x2="14" y2="22" stroke="#6ea3f7" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="6"  y1="14" x2="9"  y2="14" stroke="#6ea3f7" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="19" y1="14" x2="22" y2="14" stroke="#6ea3f7" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NAV ITEM
// ─────────────────────────────────────────────────────────────────────────────
function SidebarNavItem({ item }: { item: NavItem }) {
  return (
    <a
      href={item.href}
      className={[
        "relative flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13.5px] font-medium transition-all duration-150 select-none",
        item.active
          ? "text-white bg-white/[0.06]"
          : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]",
      ].join(" ")}
    >
      {/* Active left accent bar */}
      {item.active && (
        <span
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
          style={{ background: "#4f7ef8" }}
        />
      )}

      {/* Icon */}
      <span
        className={[
          "w-[18px] h-[18px] flex items-center justify-center shrink-0",
          item.active ? "text-blue-400" : "text-slate-500",
        ].join(" ")}
      >
        {item.icon}
      </span>

      {item.label}
    </a>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────────────────────────────────────
interface SidebarProps {
  activePage?: "dashboard" | "tracker" | "insights" | "settings";
}

export default function Sidebar({ activePage = "dashboard" }: SidebarProps) {
  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard size={16} strokeWidth={1.8} />,
      href: "/dashboard",
      active: activePage === "dashboard",
    },
    {
      label: "Tracker",
      icon: <Kanban size={16} strokeWidth={1.8} />,
      href: "/tracker",
      active: activePage === "tracker",
    },
    {
      label: "Insights",
      icon: <BarChart2 size={16} strokeWidth={1.8} />,
      href: "/insights",
      active: activePage === "insights",
    },
    {
      label: "Settings",
      icon: <Settings size={16} strokeWidth={1.8} />,
      href: "/settings",
      active: activePage === "settings",
    },
  ];

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-[248px] flex flex-col z-30 overflow-hidden"
      style={{
        background: "#080e1a",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* ── LOGO ── */}
      <div
        className="flex items-center gap-3 px-5 h-14 shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <RadarLogo />
        <div className="leading-tight">
          <p className="text-[15px] font-bold text-white tracking-tight">JobRadar</p>
          <p className="text-[11px] text-slate-500 font-normal">Career Growth</p>
        </div>
      </div>

      {/* ── NAV ITEMS ── */}
      <nav className="flex-1 flex flex-col gap-0.5 px-3 pt-5 overflow-y-auto">
        {navItems.map((item) => (
          <SidebarNavItem key={item.label} item={item} />
        ))}
      </nav>

      {/* ── ADD NEW JOB BUTTON ── */}
      <div className="px-4 py-4 shrink-0">
        <button
          className="w-full flex items-center justify-center gap-2 h-10 rounded-lg text-[13.5px] font-semibold text-white transition-all active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, #2563eb 0%, #4f7ef8 100%)",
            boxShadow: "0 4px 14px rgba(59,130,246,0.25)",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.opacity = "0.9")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.opacity = "1")
          }
        >
          <Plus size={15} strokeWidth={2.5} />
          Add New Job
        </button>
      </div>

      {/* ── DIVIDER ── */}
      <div
        className="mx-4 shrink-0"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      />

      {/* ── BOTTOM LINKS ── */}
      <div className="flex flex-col gap-0.5 px-3 py-4 shrink-0">
        <a
          href="/help"
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13.5px] font-medium text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-all"
        >
          <HelpCircle size={16} strokeWidth={1.8} className="text-slate-500 shrink-0" />
          Help Center
        </a>
        <button
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13.5px] font-medium text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-all text-left w-full"
        >
          <LogOut size={16} strokeWidth={1.8} className="text-slate-500 shrink-0" />
          Logout
        </button>
      </div>
    </aside>
  );
}