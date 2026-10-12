import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";
import { SplitError } from "../domain/index.js";
import { HttpError } from "../lib/httpError.js";

export const notFoundHandler: RequestHandler = (req, res) => {
  res
    .status(404)
    .json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: "Some fields need fixing.",
      fields: err.issues.map((issue) => ({
        field: issue.path.map(String).join("."),
        message: issue.message,
      })),
    });
    return;
  }

  if (err instanceof SplitError) {
    res.status(400).json({ error: err.message });
    return;
  }

  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  }

  if (err?.type === "entity.parse.failed") {
    res.status(400).json({ error: "The request body is not valid JSON." });
    return;
  }

  console.error(err);
  res.status(500).json({ error: "Something went wrong. Please try again." });
};
