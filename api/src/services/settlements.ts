import { prisma } from "../db.js";
import { HttpError } from "../lib/httpError.js";
import type { CreateSettlementInput } from "../schemas/expense.js";
import { getTrip } from "./trips.js";

export async function createSettlement(
  tripId: string,
  input: CreateSettlementInput,
) {
  const trip = await getTrip(tripId);
  const onTrip = new Set(trip.members.map((m) => m.id));

  if (!onTrip.has(input.fromMemberId) || !onTrip.has(input.toMemberId)) {
    throw new HttpError(400, "Both people must be on this trip.");
  }

  return prisma.settlement.create({
    data: {
      tripId,
      fromMemberId: input.fromMemberId,
      toMemberId: input.toMemberId,
      amount: input.amount,
    },
  });
}
