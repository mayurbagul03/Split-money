import { Router } from "express";
import { prisma } from "../db.js";

export const healthRouter = Router();

healthRouter.get("/", async (_req, res) => {
  let database = "connected";

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    database = "unreachable";
  }

  res.status(database === "connected" ? 200 : 503).json({
    status: database === "connected" ? "ok" : "degraded",
    database,
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});
