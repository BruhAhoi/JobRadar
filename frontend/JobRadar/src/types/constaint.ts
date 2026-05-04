import type { JobSource, JobStatus } from "./status";

export const STATUS_CONFIG: Record<
  JobStatus,
  { color: string; bgColor: string; label: string }
> = {
  APPLIED: {
    color: "#4f7ef8",
    bgColor: "rgba(79,126,248,0.15)",
    label: "Applied",
  },
  PHONE_SCREEN: {
    color: "#a855f7",
    bgColor: "rgba(168,85,247,0.15)",
    label: "Phone Screen",
  },
  INTERVIEW: {
    color: "#f59e0b",
    bgColor: "rgba(245,158,11,0.15)",
    label: "Interview",
  },
  OFFER: {
    color: "#22c55e",
    bgColor: "rgba(34,197,94,0.15)",
    label: "Offer",
  },
  ACCEPTED: {
    color: "#10b981",
    bgColor: "rgba(16,185,129,0.15)",
    label: "Accepted",
  },
  REJECTED: {
    color: "#ef4444",
    bgColor: "rgba(239,68,68,0.15)",
    label: "Rejected",
  },
  DECLINED: {
    color: "#64748b",
    bgColor: "rgba(100,116,139,0.15)",
    label: "Declined",
  },
};
 
// ─────────────────────────────────────────────────────────────────────────────
// SOURCE CONFIG
// ─────────────────────────────────────────────────────────────────────────────
export const SOURCE_CONFIG: Record<
  JobSource,
  { label: string; iconColor: string; bg: string }
> = {
  ITVIEC:   { label: "ITviec",   iconColor: "#f87171", bg: "rgba(248,113,113,0.12)" },
  TOPCV:    { label: "TopCV",    iconColor: "#34d399", bg: "rgba(52,211,153,0.12)"  },
  LINKEDIN: { label: "LinkedIn", iconColor: "#60a5fa", bg: "rgba(96,165,250,0.12)"  },
  REFERRAL: { label: "Referral", iconColor: "#a78bfa", bg: "rgba(167,139,250,0.12)" },
  OTHER:    { label: "Other",    iconColor: "#94a3b8", bg: "rgba(148,163,184,0.12)" },
};