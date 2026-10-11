import { describe, expect, it } from "vitest";
import { calculateBalances } from "./balances.js";
import { dollars, members, tripExpenses } from "./fixtures.js";
import { suggestPayments } from "./settle.js";

describe("suggestPayments", () => {
  it("settles the sample trip in 3 payments", () => {
    const payments = suggestPayments(calculateBalances(members, tripExpenses));

    expect(payments).toEqual([
      { from: "aditi", to: "rohan", amount: dollars(390) },
      { from: "you", to: "rohan", amount: dollars(190) },
      { from: "priya", to: "rohan", amount: dollars(70) },
    ]);
  });

  it("returns no payments when everyone is settled", () => {
    const balances = new Map([
      ["a", 0],
      ["b", 0],
    ]);
    expect(suggestPayments(balances)).toEqual([]);
  });

  it("skips the middle person in a chain", () => {
    // A owes B $100 and B owes C $100 → A pays C directly.
    const balances = new Map([
      ["a", -10000],
      ["b", 0],
      ["c", 10000],
    ]);
    expect(suggestPayments(balances)).toEqual([{ from: "a", to: "c", amount: 10000 }]);
  });

  it("settles every balance to zero, in at most (people − 1) payments", () => {
    const balances = new Map([
      ["a", 5000],
      ["b", -2000],
      ["c", -2500],
      ["d", 1500],
      ["e", -2000],
    ]);
    const payments = suggestPayments(balances);

    expect(payments.length).toBeLessThanOrEqual(balances.size - 1);

    const after = new Map(balances);
    for (const p of payments) {
      after.set(p.from, after.get(p.from)! + p.amount);
      after.set(p.to, after.get(p.to)! - p.amount);
    }
    expect([...after.values()].every((value) => value === 0)).toBe(true);
  });

  it("rejects balances that do not add up to zero", () => {
    expect(() => suggestPayments(new Map([["a", 100]]))).toThrow("add up to zero");
  });
});