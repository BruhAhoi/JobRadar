import express from "express";
import dotenv from "dotenv";

dotenv.config();

import cookieParser from "cookie-parser";
import authRoute from "./routes/authRoute";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./libs/swagger";
import helmet from "helmet";



const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cookieParser());

app.use(
  "/api/docs",
  helmet({ contentSecurityPolicy: false }),
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

// Helmet cho toàn bộ routes còn lại
app.use(helmet());

app.use("/api/auth", authRoute);
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});