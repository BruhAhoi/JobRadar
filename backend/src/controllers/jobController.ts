import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import prisma from "../libs/db";
import { createJobSchema, createNoteSchema, updateJobSchema, updateStatusSchema } from "../schema/jobSchema";
import { Status } from "../generated/prisma/client";

const VALID_TRANSITIONS: Record<Status, Status[]> = {
  APPLIED: ["PHONE_SCREEN", "REJECTED"],
  PHONE_SCREEN: ["INTERVIEW", "REJECTED"],
  INTERVIEW: ["OFFER", "REJECTED"],
  OFFER: ["ACCEPTED", "DECLINED"],
  ACCEPTED: [],
  DECLINED: [],
  REJECTED: ["APPLIED"], // apply lại
};

//helper functions
function success<T>(data: T, meta?: object) {
  return { success: true, data, ...(meta ? { meta } : {}) };
}

function fail(code: string, message: string, status = 400) {
  return { status, body: { success: false, error: { code, message } } };
}

export const listJobs = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    // Query params
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const skip = (page - 1) * limit;

    const status = req.query.status as Status | undefined;
    const source = req.query.source as string | undefined;
    const search = req.query.search as string | undefined;
    const range = req.query.range as string | undefined; // "7d"|"30d"|"3m"|"all"
    const sortBy = (req.query.sortBy as string) || "appliedAt";
    const order = req.query.order === "asc" ? "asc" : "desc";

    // Date filter
    let dateFilter: { gte: Date } | undefined;
    if (range && range !== "all") {
      const now = new Date();
      const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
      dateFilter = { gte: new Date(now.getTime() - days * 86400_000) };
    }

    const where = {
      userId,
      ...(status ? { status } : {}),
      ...(source ? { source: source as any } : {}),
      ...(search
        ? {
          OR: [
            { companyName: { contains: search, mode: "insensitive" as const } },
            { position: { contains: search, mode: "insensitive" as const } },
          ],
        }
        : {}),
      ...(dateFilter ? { appliedAt: dateFilter } : {}),
    };

    const [total, jobs] = await Promise.all([
      prisma.jobApplication.count({ where }),
      prisma.jobApplication.findMany({
        where,
        orderBy: { [sortBy]: order },
        skip,
        take: limit,
        include: { _count: { select: { interviewNotes: true } } },
      }),
    ]);

    return res.json(success(jobs, { page, limit, total, totalPages: Math.ceil(total / limit) }));
  } catch (err) {
    console.error("[listJobs]", err);
    return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
};

export const createJob = async (req: AuthRequest, res: Response) => {
  try {
    const parsed = createJobSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0].message } });
    }

    const job = await prisma.jobApplication.create({
      data: { ...parsed.data, userId: req.user!.id },
    });

    return res.status(201).json(success(job));
  } catch (err) {
    console.error("[createJob]", err);
    return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
}

export const getJob = async (req: AuthRequest, res: Response) => {
  try {
    const job = await prisma.jobApplication.findUnique({
      where: { id: req.params.id.toString() },
      include: { interviewNotes: { orderBy: { createdAt: "desc" } } }
    });

    if (!job) {
      return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Job application not found" } });
    }
    if (job.userId !== req.user!.id) {
      return res.status(403).json({ success: false, error: { code: "FORBIDDEN", message: "You don't have access to this job application" } });
    }
    return res.json(success(job));
  } catch (err) {
    console.error("[getJob]", err);
    return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
}

export const updateJob = async (req: AuthRequest, res: Response) => {
  try {
    const existingJob = await prisma.jobApplication.findUnique({
      where: { id: req.params.id.toString() },
    })
    if (!existingJob) {
      return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Job application not found" } });
    }
    if (existingJob.userId !== req.user!.id) {
      return res.status(403).json({ success: false, error: { code: "FORBIDDEN", message: "You don't have access to this job application" } });
    }

    const parsed = createJobSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0].message } });
    }

    const updatedJob = await prisma.jobApplication.update({
      where: { id: req.params.id.toString() },
      data: parsed.data
    })

    return res.json(success(updatedJob));
  } catch (err) {
    console.error("[updateJob]", err);
    return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
}

export const deleteJob = async (req: AuthRequest, res: Response) => {
  try {
    const existingJob = await prisma.jobApplication.findUnique({
      where: { id: req.params.id.toString() },
    })
    if (!existingJob) {
      return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Job application not found" } });
    }
    if (existingJob.userId !== req.user!.id) {
      return res.status(403).json({ success: false, error: { code: "FORBIDDEN", message: "You don't have access to this job application" } });
    }
    await prisma.jobApplication.delete({
      where: { id: req.params.id.toString() }
    })
    return res.json(success(null));
  } catch (err) {
    console.error("[deleteJob]", err);
    return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
}

export const updateJobStatus = async (req: AuthRequest, res: Response) => {
  try {
    const existingJob = await prisma.jobApplication.findUnique({
      where: { id: req.params.id.toString() },
    })
    if (!existingJob) {
      return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Job application not found" } });
    }
    if (existingJob.userId !== req.user!.id) {
      return res.status(403).json({ success: false, error: { code: "FORBIDDEN", message: "You don't have access to this job application" } });
    }

    const parsed = updateStatusSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0].message } });
    }

    const { status: newStatus } = parsed.data;
    const allowedTransitions = VALID_TRANSITIONS[existingJob.status];
    const allowed = allowedTransitions.includes(newStatus);

    if (!allowed) {
      return res.status(422).json({
        success: false,
        error: {
          code: "INVALID_TRANSITION",
          message: `Cannot move from ${existingJob.status} to ${parsed.data.status}. Allowed: [${allowedTransitions.join(", ") || "none"}]`,
        },
      });
    }

    const updatedJob = await prisma.jobApplication.update({
      where: { id: req.params.id.toString() },
      data: { status: newStatus }
    })
    return res.json(success(updatedJob));
  } catch (err) {
    console.error("[updateJobStatus]", err);
    return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
}

export const listNotes = async (req: AuthRequest, res: Response) => {
  try {
    const job = await prisma.jobApplication.findUnique({
      where: { id: req.params.id.toString() }
    });
    if (!job) {
      return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Job not found" } });
    }
    if (job.userId !== req.user!.id) return res.status(403).json({ success: false, error: { code: "FORBIDDEN", message: "Access denied" } });

    const notes = await prisma.interviewNote.findMany({
      where: { jobId: req.params.id.toString() },
      orderBy: { createdAt: "desc" },
    })

    return res.json(success(notes));
  } catch (err) {
    console.error("[listNotes]", err);
    return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
}

export const createNote = async (req: AuthRequest, res: Response) => {
  try {
    const job = await prisma.jobApplication.findUnique({
      where: { id: req.params.id.toString() }
    })
    if (!job) {
      return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Job not found" } });
    }
    if (job.userId !== req.user!.id) return res.status(403).json({ success: false, error: { code: "FORBIDDEN", message: "Access denied" } });

    const parsed = createNoteSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0].message } });
    }

    const note = await prisma.interviewNote.create({
      data: {
        ...parsed.data,
        jobId: req.params.id.toString(),
        userId: req.user!.id,
      }
    })
    return res.status(201).json(success(note));
  } catch (err) {
    console.error("[createNote]", err);
    return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
}

export const deleteNote = async (req: AuthRequest, res: Response) => {
  try {
    const existingNote = await prisma.interviewNote.findUnique({
      where: { id: req.params.noteId.toString() },
    })
    if (!existingNote) {
      return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Note not found" } });
    }
    if (existingNote.userId !== req.user!.id) {
      return res.status(403).json({ success: false, error: { code: "FORBIDDEN", message: "Access denied" } });
    }
    if (existingNote.jobId !== req.params.id.toString()) {
      return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "Note does not belong to this job application" } });
    }

    await prisma.interviewNote.delete({
      where: { id: req.params.noteId.toString() }
    })
    return res.json(success({ id: req.params.noteId.toString() }));
  } catch (err) {
    console.error("[deleteNote]", err);
    return res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
}