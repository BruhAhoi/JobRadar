import express from "express";
import dotenv from "dotenv";

dotenv.config();

import cookieParser from "cookie-parser";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./libs/swagger";
import helmet from "helmet";

import authRoute from "./routes/authRoute";
import userRoute from "./routes/userRoute";

const app = express();
const PORT = process.env.PORT || 5001;

// Helmet cho toàn bộ routes còn lại
app.use(helmet());

//cors cho phép frontend gửi cookie
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true, 
  })
);

app.use(express.json());
app.use(cookieParser());

app.use(
  "/api/docs",
  helmet({ contentSecurityPolicy: false }),
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);



app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
