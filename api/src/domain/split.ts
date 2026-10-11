import { SplitError } from "./errors.js";
import type { MemberId, ShareAmount } from "./types.js";

function assertValidAmount(amount: number): void {
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new SplitError("Amount must be a positive whole number of cents.");
  }
}

function assertValidMembers(memberIds: MemberId[]): void {
  if (memberIds.length === 0) {
    throw new SplitError("Choose at least one person to split with.");
  }
  if (new Set(memberIds).size !== memberIds.length) {
    throw new SplitError("A person can only appear once in a split.");
  }
}

/** Formats cents for messages, e.g. 900 → "$9.00". */
export function formatMoney(cents: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
    cents / 100,
  );
}

/**
 * Splits an amount equally. Leftover cents go one each to the first members,
 * so the shares always add up to exactly the total.
 * Example: 1000 cents ($10.00) between 3 people → 334, 333, 333.
 */
export function splitEqually(
  amount: number,
  memberIds: MemberId[],
): ShareAmount[] {
  assertValidAmount(amount);
  assertValidMembers(memberIds);

  const base = Math.floor(amount / memberIds.length);
  const remainder = amount % memberIds.length;

  return memberIds.map((memberId, index) => ({
    memberId,
    amount: base + (index < remainder ? 1 : 0),
  }));
}

/**
 * Splits by weights. Example: shares 2 and 1 → two thirds and one third.
 * Uses whole-number maths only, then gives leftover cents to whoever
 * lost the most in rounding (the "largest remainder" method).
 */
export function splitByShares(
  amount: number,
  entries: { memberId: MemberId; shares: number }[],
): ShareAmount[] {
  assertValidAmount(amount);
  assertValidMembers(entries.map((entry) => entry.memberId));

  for (const entry of entries) {
    if (!Number.isInteger(entry.shares) || entry.shares <= 0) {
      throw new SplitError("Each person needs at least 1 share.");
    }
  }

  const totalShares = entries.reduce((sum, entry) => sum + entry.shares, 0);

  const parts = entries.map((entry, index) => {
    const numerator = amount * entry.shares;
    const remainder = numerator % totalShares;
    return {
      memberId: entry.memberId,
      index,
      base: (numerator - remainder) / totalShares,
      remainder,
    };
  });

  const leftover = amount - parts.reduce((sum, part) => sum + part.base, 0);
  const getsExtra = new Set(
    [...parts]
      .sort((a, b) => b.remainder - a.remainder || a.index - b.index)
      .slice(0, leftover)
      .map((part) => part.index),
  );

  return parts.map((part) => ({
    memberId: part.memberId,
    amount: part.base + (getsExtra.has(part.index) ? 1 : 0),
  }));
}

/**
 * Checks custom amounts. People with 0 are dropped.
 * Throws if the amounts don't add up to the total.
 */
export function validateExactSplit(
  amount: number,
  shares: ShareAmount[],
  currency = "USD",
): ShareAmount[] {
  assertValidAmount(amount);
  assertValidMembers(shares.map((share) => share.memberId));

  for (const share of shares) {
    if (!Number.isInteger(share.amount) || share.amount < 0) {
      throw new SplitError("Each amount must be zero or more, in whole cents.");
    }
  }

  const total = shares.reduce((sum, share) => sum + share.amount, 0);
  if (total !== amount) {
    throw new SplitError(
      `The amounts add up to ${formatMoney(total, currency)}, but the expense is ${formatMoney(amount, currency)}.`,
    );
  }

  const nonZero = shares.filter((share) => share.amount > 0);
  if (nonZero.length === 0) {
    throw new SplitError("Choose at least one person to split with.");
  }
  return nonZero;
}
