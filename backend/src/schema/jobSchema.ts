import { z } from "zod";

// ─── Enums (mirror Prisma) ────────────────────────────────────────────────────
export const StatusEnum = z.enum([
  "APPLIED",
  "PHONE_SCREEN",
  "INTERVIEW",
  "OFFER",
  "ACCEPTED",
  "REJECTED",
  "DECLINED",
]);

export const SourceEnum = z.enum([
  "ITVIEC",
  "TOPCV",
  "LINKEDIN",
  "REFERRAL",
  "OTHER",
]);

export const NoteTypeEnum = z.enum([
  "QUESTION",
  "ANSWER",
  "IMPRESSION",
  "FOLLOW_UP",
]);

// ─── Create Job ───────────────────────────────────────────────────────────────
export const createJobSchema = z.object({
  companyName: z
    .string()
    .min(1, "Company name is required")
    .max(200, "Company name must be ≤ 200 characters")
    .trim(),

  position: z
    .string()
    .min(1, "Position is required")
    .max(200, "Position must be ≤ 200 characters")
    .trim(),

  appliedAt: z
    .string()
    .min(1, "Applied date is required")
    .pipe(z.coerce.date()),

  status: StatusEnum.optional().default("APPLIED"),

  source: SourceEnum.optional().default("OTHER"),

  jobUrl: z
    .string()
    .url("jobUrl must be a valid URL")
    .max(2048)
    .optional()
    .nullable(),

  salaryNote: z
    .string()
    .max(500, "Salary note must be ≤ 500 characters")
    .trim()
    .optional()
    .nullable(),

  notes: z
    .string()
    .max(10_000, "Notes must be ≤ 10,000 characters")
    .trim()
    .optional()
    .nullable(),

  deadlineAt: z
    .string()
    .pipe(z.coerce.date())
    .optional()
    .nullable(),
});

// ─── Update Job (all fields optional) ────────────────────────────────────────
export const updateJobSchema = createJobSchema
  .omit({ status: true }) // status changed via dedicated endpoint
  .partial();

// ─── Update Status ────────────────────────────────────────────────────────────
export const updateStatusSchema = z.object({
  status: StatusEnum,
});

// ─── Create Note ──────────────────────────────────────────────────────────────
export const createNoteSchema = z.object({
  content: z
    .string()
    .min(1, "Content is required")
    .max(10_000, "Content must be ≤ 10,000 characters"),

  type: NoteTypeEnum.optional().default("IMPRESSION"),
});