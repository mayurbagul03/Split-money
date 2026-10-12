import { Router } from "express";
import { z } from "zod";
import { notFound } from "../lib/httpError.js";
import { addMemberSchema, createTripSchema } from "../schemas/trip.js";
import * as trips from "../services/trips.js";

export const tripsRouter = Router();

function parseTripId(value: string): string {
  const result = z.string().uuid().safeParse(value);
  if (!result.success) {
    throw notFound("Trip");
  }
  return result.data;
}

tripsRouter.get("/", async (_req, res) => {
  res.json(await trips.listTrips());
});

tripsRouter.post("/", async (req, res) => {
  const input = createTripSchema.parse(req.body);
  res.status(201).json(await trips.createTrip(input));
});

tripsRouter.get("/:tripId", async (req, res) => {
  const tripId = parseTripId(req.params.tripId);
  res.json(await trips.getTrip(tripId));
});

tripsRouter.post("/:tripId/members", async (req, res) => {
  const tripId = parseTripId(req.params.tripId);
  const { name } = addMemberSchema.parse(req.body);
  res.status(201).json(await trips.addMember(tripId, name));
});
