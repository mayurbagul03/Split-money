import { prisma } from "../db.js";
import { calculateBalances, suggestPayments } from "../domain/index.js";
import { getTrip } from "./trips.js";

export async function getSummary(tripId: string) {
  const trip = await getTrip(tripId);

  const [expenses, settlements] = await Promise.all([
    prisma.expense.findMany({
      where: { tripId },
      select: {
        amount: true,
        paidById: true,
        shares: { select: { memberId: true, amount: true } },
      },
    }),
    prisma.settlement.findMany({
      where: { tripId },
      orderBy: { settledAt: "desc" },
    }),
  ]);

  const memberIds = trip.members.map((m) => m.id);
  const balances = calculateBalances(memberIds, expenses, settlements);

  const paid = new Map(memberIds.map((id) => [id, 0]));
  const share = new Map(memberIds.map((id) => [id, 0]));
  let totalSpent = 0;

  for (const expense of expenses) {
    totalSpent += expense.amount;
    paid.set(
      expense.paidById,
      (paid.get(expense.paidById) ?? 0) + expense.amount,
    );
    for (const s of expense.shares) {
      share.set(s.memberId, (share.get(s.memberId) ?? 0) + s.amount);
    }
  }

  return {
    tripId: trip.id,
    currency: trip.currency,
    totalSpent,
    members: trip.members.map((m) => ({
      id: m.id,
      name: m.name,
      paid: paid.get(m.id) ?? 0,
      share: share.get(m.id) ?? 0,
      balance: balances.get(m.id) ?? 0,
    })),
    suggestedPayments: suggestPayments(balances).map((p) => ({
      fromMemberId: p.from,
      toMemberId: p.to,
      amount: p.amount,
    })),
    settlements,
  };
}
