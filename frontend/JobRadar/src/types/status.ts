// ─────────────────────────────────────────────────────────────────────────────
// ENUMS / UNION TYPES
// ─────────────────────────────────────────────────────────────────────────────
export type JobStatus =
  | "APPLIED"
  | "PHONE_SCREEN"
  | "INTERVIEW"
  | "OFFER"
  | "ACCEPTED"
  | "REJECTED"
  | "DECLINED";

export type JobSource =
  | "ITVIEC"
  | "TOPCV"
  | "LINKEDIN"
  | "REFERRAL"
  | "OTHER";

// ─────────────────────────────────────────────────────────────────────────────
// DATA SHAPES
// ─────────────────────────────────────────────────────────────────────────────
export interface JobCardData {
  id: string;
  company: string;
  position: string;
  status: JobStatus;
  source: JobSource;
  /** Hiển thị thời gian apply, e.g. "2 days ago" */
  appliedAt: string;
  /** Nếu có → hiện màu xanh, e.g. "Today @ 2:00 PM" */
  deadline?: string;
  /** Nếu có → hiện warning banner cam, e.g. "2 days left - Prep Case Study" */
  deadlineWarning?: string;
  /** Nếu true → card có border trái màu status */
  highlighted?: boolean;
  /** Link đến JD gốc */
  jobUrl?: string;
}

export interface KanbanColumnData {
  status: JobStatus;
  cards: JobCardData[];
}