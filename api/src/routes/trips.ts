import { Router } from "express";
import { parseId } from "../lib/params.js";
import {
  createExpenseSchema,
  createSettlementSchema,
} from "../schemas/expense.js";
import { addMemberSchema, createTripSchema } from "../schemas/trip.js";
import * as expenses from "../services/expenses.js";
import * as settlements from "../services/settlements.js";
import { getSummary } from "../services/summary.js";
import * as trips from "../services/trips.js";

export const tripsRouter = Router();

// ----- Trips -----

tripsRouter.get("/", async (_req, res) => {
  res.json(await trips.listTrips());
});

tripsRouter.post("/", async (req, res) => {
  const input = createTripSchema.parse(req.body);
  res.status(201).json(await trips.createTrip(input));
});

tripsRouter.get("/:tripId", async (req, res) => {
  const tripId = parseId(req.params.tripId, "Trip");
  res.json(await trips.getTrip(tripId));
});

// ----- Members -----

tripsRouter.post("/:tripId/members", async (req, res) => {
  const tripId = parseId(req.params.tripId, "Trip");
  const { name } = addMemberSchema.parse(req.body);
  res.status(201).json(await trips.addMember(tripId, name));
});

// ----- Expenses -----

tripsRouter.get("/:tripId/expenses", async (req, res) => {
  const tripId = parseId(req.params.tripId, "Trip");
  res.json(await expenses.listExpenses(tripId));
});

tripsRouter.post("/:tripId/expenses", async (req, res) => {
  const tripId = parseId(req.params.tripId, "Trip");
  const input = createExpenseSchema.parse(req.body);
  res.status(201).json(await expenses.createExpense(tripId, input));
});

tripsRouter.delete("/:tripId/expenses/:expenseId", async (req, res) => {
  const tripId = parseId(req.params.tripId, "Trip");
  const expenseId = parseId(req.params.expenseId, "Expense");
  await expenses.deleteExpense(tripId, expenseId);
  res.status(204).end();
});

// ----- Balances and settling up -----

tripsRouter.get("/:tripId/summary", async (req, res) => {
  const tripId = parseId(req.params.tripId, "Trip");
  res.json(await getSummary(tripId));
});

tripsRouter.post("/:tripId/settlements", async (req, res) => {
  const tripId = parseId(req.params.tripId, "Trip");
  const input = createSettlementSchema.parse(req.body);
  res.status(201).json(await settlements.createSettlement(tripId, input));
});
