import { SplitError } from "./errors.js";
import type { ExpenseInput, MemberId, SettlementInput } from "./types.js";

/**
 * Net balance per member, in paise.
 * Positive = gets money back. Negative = owes money.
 * Paying an expense raises your balance; your share of it lowers it.
 * A settlement from A to B raises A's balance and lowers B's.
 * The balances of a trip always add up to zero.
 */
export function calculateBalances(
  memberIds: MemberId[],
  expenses: ExpenseInput[],
  settlements: SettlementInput[] = [],
): Map<MemberId, number> {
  const balances = new Map<MemberId, number>(memberIds.map((id) => [id, 0]));

  const adjust = (memberId: MemberId, delta: number) => {
    const current = balances.get(memberId);
    if (current === undefined) {
      throw new SplitError(`Unknown member: ${memberId}`);
    }
    balances.set(memberId, current + delta);
  };

  for (const expense of expenses) {
    const sharesTotal = expense.shares.reduce(
      (sum, share) => sum + share.amount,
      0,
    );
    if (sharesTotal !== expense.amount) {
      throw new SplitError("An expense’s shares must add up to its amount.");
    }

    adjust(expense.paidById, expense.amount);
    for (const share of expense.shares) {
      adjust(share.memberId, -share.amount);
    }
  }

  for (const settlement of settlements) {
    adjust(settlement.fromMemberId, settlement.amount);
    adjust(settlement.toMemberId, -settlement.amount);
  }

  return balances;
}
