import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import { prisma } from "./lib/prisma";
import routes from "./routes";
import auth from "./middlewares/auth";
import { Role } from "../generated/prisma/client";
import authorize from "./middlewares/authorize";
import globalErrorHandler from "./middlewares/globalErrorHandler";

const app: Application = express();

app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// All routes
app.use("/api", routes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.get("/api/test", auth, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Authorized user",
    data: req.user,
  });
});

app.get(
  "/api/provider-test",
  auth,
  authorize(Role.PROVIDER),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Provider",
    });
  },
);

app.get(
  "/api/admin-test",
  auth,
  authorize(Role.ADMIN),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Admin",
    });
  },
);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API Not Found",
    errorDetails: null,
  });
});

// Global error handler
app.use(globalErrorHandler);

export default app;
