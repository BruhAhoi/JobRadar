import express from "express";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

import cookieParser from "cookie-parser";
import cors from "cors";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./libs/swagger";
import helmet from "helmet";

import authRoute from "./routes/authRoute";
import userRoute from "./routes/userRoute";
import jobRoute from "./routes/jobRoute";
import { dashboardRouter, exportRouter } from "./routes/dashboardRoute";
import { errorHandler, notFoundHandler, requestLogger } from "./middlewares/errorMiddleware";
import { startReminderCron } from "./libs/reminderJob";

const app = express();
const PORT = process.env.PORT || 5001;

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        objectSrc: ["'none'"],
      },
    },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  })
);

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(requestLogger);

const globalLimiter = rateLimit({
  windowMs: 60_000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: { code: "RATE_LIMITED", message: "Too many requests" } },
});
app.use("/api", globalLimiter);

const loginLimiter = rateLimit({
  windowMs: 15 * 60_000,
  max: 5,
  message: { success: false, error: { code: "RATE_LIMITED", message: "Too many login attempts. Try again in 15 minutes." } },
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60_000,
  max: 3,
  message: { success: false, error: { code: "RATE_LIMITED", message: "Too many register attempts. Try again later." } },
});

const forgotLimiter = rateLimit({
  windowMs: 60 * 60_000,
  max: 3,
  message: { success: false, error: { code: "RATE_LIMITED", message: "Too many password reset requests." } },
});

app.get("/api/docs.json", (req, res) => {
  res.json(swaggerSpec);
});
app.use(
  "/api/docs",
  helmet({ contentSecurityPolicy: false }),
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

app.use("/api/auth/login", loginLimiter);
app.use("/api/auth/register", registerLimiter);
app.use("/api/auth/forgot-password", forgotLimiter);

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/export", exportRouter)
app.use("/api/jobs", jobRoute);
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use(notFoundHandler);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  startReminderCron();
});
