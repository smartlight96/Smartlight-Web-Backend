import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import path from "path";

import { env } from "./config/env";

import auth from "./routes/auth.routes";
import services from "./routes/service.routes";
import requests from "./routes/request.routes";
import admin from "./routes/admin.routes";
import publicRoutes from "./routes/public.routes";
import messages from "./routes/message.routes";
import notifications from "./routes/notification.routes";
import careers from "./routes/career.routes";
import newsletter from "./routes/newsletter.routes";

import { errorHandler } from "./middleware/error";

export const app = express();

app.disable("x-powered-by");

app.use(helmet());

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

/*
 * Uploaded resumes/files
 */
app.use(
  "/uploads",
  express.static(
    path.join(process.cwd(), "uploads")
  )
);

app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 120,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

/*
 * Health check
 */
app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "smartlight-api",
  });
});

/*
 * Public APIs
 */
app.use("/api/auth", limiter, auth);
app.use("/api/services", services);
app.use("/api/requests", requests);
app.use("/api/public", publicRoutes);
app.use("/api/careers", limiter, careers);
app.use("/api/messages", messages);
app.use("/api/newsletter", newsletter);

/*
 * Admin APIs
 */
app.use("/api/admin", limiter, admin);

app.use(
  "/api/admin/notifications",
  limiter,
  notifications
);

/*
 * Error handler MUST remain last
 */
app.use(errorHandler);