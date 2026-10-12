import { prisma } from "../db.js";
import {
  splitByShares,
  splitEqually,
  validateExactSplit,
  type ShareAmount,
} from "../domain/index.js";
import { HttpError, notFound } from "../lib/httpError.js";
import type { CreateExpenseInput } from "../schemas/expense.js";
import { getTrip } from "./trips.js";

const expenseDetails = {
  paidBy: { select: { id: true, name: true } },
  shares: { select: { memberId: true, amount: true, shares: true } },
};

function buildShares(
  input: CreateExpenseInput,
  currency: string,
): ShareAmount[] {
  const split = input.split;
  switch (split.type) {
    case "EQUAL":
      return splitEqually(input.amount, split.memberIds);
    case "EXACT":
      return validateExactSplit(input.amount, split.shares, currency);
    case "SHARES":
      return splitByShares(input.amount, split.shares);
  }
}

export async function listExpenses(tripId: string) {
  await getTrip(tripId); // 404 if the trip does not exist
  return prisma.expense.findMany({
    where: { tripId },
    orderBy: [{ spentAt: "desc" }, { createdAt: "desc" }],
    include: expenseDetails,
  });
}

export async function createExpense(tripId: string, input: CreateExpenseInput) {
  const trip = await getTrip(tripId);
  const onTrip = new Set(trip.members.map((m) => m.id));

  const shares = buildShares(input, trip.currency);

  const everyone = [input.paidById, ...shares.map((s) => s.memberId)];
  if (!everyone.every((id) => onTrip.has(id))) {
    throw new HttpError(400, "Everyone in this expense must be on the trip.");
  }

  const weights =
    input.split.type === "SHARES"
      ? new Map(input.split.shares.map((s) => [s.memberId, s.shares]))
      : null;

  return prisma.expense.create({
    data: {
      tripId,
      description: input.description,
      amount: input.amount,
      category: input.category,
      splitType: input.split.type,
      paidById: input.paidById,
      spentAt: input.spentAt ? new Date(input.spentAt) : undefined,
      shares: {
        create: shares.map((s) => ({
          memberId: s.memberId,
          amount: s.amount,
          shares: weights?.get(s.memberId) ?? null,
        })),
      },
    },
    include: expenseDetails,
  });
}

export async function deleteExpense(tripId: string, expenseId: string) {
  const { count } = await prisma.expense.deleteMany({
    where: { id: expenseId, tripId },
  });
  if (count === 0) {
    throw notFound("Expense");
  }
}
