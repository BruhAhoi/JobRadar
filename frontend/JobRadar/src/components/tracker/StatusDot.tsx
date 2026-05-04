import React from "react";
import type { JobStatus } from "../../types/status";
import { STATUS_CONFIG } from "../../types/constaint";

// ─────────────────────────────────────────────────────────────────────────────
// STATUS DOT
// ─────────────────────────────────────────────────────────────────────────────
interface StatusDotProps {
  status: JobStatus;
  size?: number; // diameter px, default 7
  /** Nếu true, render thêm pulse animation */
  pulse?: boolean;
}

export default function StatusDot({
  status,
  size = 7,
  pulse = false,
}: StatusDotProps) {
  const { color } = STATUS_CONFIG[status];

  return (
    <span className="relative inline-flex items-center justify-center shrink-0">
      {/* Pulse ring */}
      {pulse && (
        <span
          className="absolute inline-flex rounded-full animate-ping opacity-50"
          style={{
            width: size + 6,
            height: size + 6,
            background: color,
          }}
        />
      )}
      {/* Dot */}
      <span
        className="relative inline-flex rounded-full"
        style={{ width: size, height: size, background: color }}
      />
    </span>
  );
}