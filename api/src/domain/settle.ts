import { SplitError } from "./errors.js";
import type { MemberId, Payment } from "./types.js";

interface Party {
  memberId: MemberId;
  amount: number;
}

function sortLargestFirst(a: Party, b: Party): number {
  return b.amount - a.amount || a.memberId.localeCompare(b.memberId);
}

/**
 * Suggests payments that settle every balance.
 * Repeatedly matches the person who owes the most with the person
 * owed the most. Needs at most (people − 1) payments, and usually far
 * fewer than everyone paying everyone back for each expense.
 */
export function suggestPayments(balances: Map<MemberId, number>): Payment[] {
  let total = 0;
  for (const amount of balances.values()) {
    total += amount;
  }
  if (total !== 0) {
    throw new SplitError("Balances must add up to zero.");
  }

  const creditors: Party[] = [];
  const debtors: Party[] = [];
  for (const [memberId, amount] of balances) {
    if (amount > 0) creditors.push({ memberId, amount });
    if (amount < 0) debtors.push({ memberId, amount: -amount });
  }
  creditors.sort(sortLargestFirst);
  debtors.sort(sortLargestFirst);

  const payments: Payment[] = [];
  let d = 0;
  let c = 0;

  while (d < debtors.length && c < creditors.length) {
    const debtor = debtors[d]!;
    const creditor = creditors[c]!;
    const amount = Math.min(debtor.amount, creditor.amount);

    payments.push({ from: debtor.memberId, to: creditor.memberId, amount });

    debtor.amount -= amount;
    creditor.amount -= amount;
    if (debtor.amount === 0) d++;
    if (creditor.amount === 0) c++;
  }

  return payments;
}
