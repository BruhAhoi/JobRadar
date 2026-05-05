import { Request, Response, NextFunction } from "express";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const logServerError = (
  context: string,
  err: unknown,
  req?: Request
): void => {
  const error = err instanceof Error ? err : new Error(String(err));

  console.error(`[${context}]`, {
    method: req?.method,
    url: req?.originalUrl,
    name: error.name,
    message: error.message,
    stack: error.stack,
    prismaCode: (err as any)?.code,
    prismaMeta: (err as any)?.meta,
  });
};

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const startedAt = Date.now();

  res.on("finish", () => {
    const durationMs = Date.now() - startedAt;
    const log = res.statusCode >= 500 ? console.error : console.log;

    log(`[HTTP] ${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs}ms`);
  });

  next();
};

// Central error handler — never leaks stack trace in production
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Known operational errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: { code: err.code, message: err.message },
    });
    return;
  }

  // Prisma unique constraint
  if ((err as any).code === "P2002") {
    res.status(409).json({
      success: false,
      error: { code: "CONFLICT", message: "Resource already exists" },
    });
    return;
  }

  // Prisma record not found
  if ((err as any).code === "P2025") {
    res.status(404).json({
      success: false,
      error: { code: "NOT_FOUND", message: "Resource not found" },
    });
    return;
  }

  // Unknown errors — log internally, never expose detail to client
  logServerError("Unhandled Error", err, req);

  res.status(500).json({
    success: false,
    error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" },
  });
};

// 404 handler for unmatched routes
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: `Route ${req.method} ${req.originalUrl} not found`,
    },
  });
};
