import express from "express";
import helmet from "helmet";
import { healthRouter } from "./routes/health.js";
import { tripsRouter } from "./routes/trips.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(express.json({ limit: "100kb" }));

  app.use("/api/health", healthRouter);
  app.use("/api/trips", tripsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
