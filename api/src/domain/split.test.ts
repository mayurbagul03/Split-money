import { describe, expect, it } from "vitest";
import {
  formatMoney,
  splitByShares,
  splitEqually,
  validateExactSplit,
} from "./split.js";

const sum = (shares: { amount: number }[]) =>
  shares.reduce((total, s) => total + s.amount, 0);

describe("splitEqually", () => {
  it("splits evenly when the amount divides exactly", () => {
    const result = splitEqually(48000, ["you", "priya", "rohan", "aditi"]);
    expect(result.map((s) => s.amount)).toEqual([12000, 12000, 12000, 12000]);
  });

  it("gives leftover cents to the first members so nothing is lost", () => {
    const result = splitEqually(1000, ["a", "b", "c"]);
    expect(result.map((s) => s.amount)).toEqual([334, 333, 333]);
    expect(sum(result)).toBe(1000);
  });

  it("always adds up to the total", () => {
    for (const amount of [1, 7, 99, 100, 101, 12345, 999999]) {
      for (const people of [1, 2, 3, 4, 7]) {
        const ids = Array.from({ length: people }, (_, i) => `m${i}`);
        expect(sum(splitEqually(amount, ids))).toBe(amount);
      }
    }
  });

  it("rejects zero, negative and fractional amounts", () => {
    expect(() => splitEqually(0, ["a"])).toThrow();
    expect(() => splitEqually(-100, ["a"])).toThrow();
    expect(() => splitEqually(10.5, ["a"])).toThrow();
  });

  it("rejects an empty or duplicated member list", () => {
    expect(() => splitEqually(100, [])).toThrow("at least one person");
    expect(() => splitEqually(100, ["a", "a"])).toThrow("only appear once");
  });
});

describe("splitByShares", () => {
  it("splits by weight", () => {
    const result = splitByShares(30000, [
      { memberId: "stayed2nights", shares: 2 },
      { memberId: "stayed1night", shares: 1 },
    ]);
    expect(result.map((s) => s.amount)).toEqual([20000, 10000]);
  });

  it("always adds up to the total", () => {
    const result = splitByShares(1000, [
      { memberId: "a", shares: 1 },
      { memberId: "b", shares: 1 },
      { memberId: "c", shares: 1 },
    ]);
    expect(sum(result)).toBe(1000);
  });

  it("rejects zero shares", () => {
    expect(() => splitByShares(1000, [{ memberId: "a", shares: 0 }])).toThrow(
      "at least 1 share",
    );
  });
});

describe("validateExactSplit", () => {
  it("accepts amounts that add up and drops zero amounts", () => {
    const result = validateExactSplit(1000, [
      { memberId: "a", amount: 700 },
      { memberId: "b", amount: 300 },
      { memberId: "c", amount: 0 },
    ]);
    expect(result).toEqual([
      { memberId: "a", amount: 700 },
      { memberId: "b", amount: 300 },
    ]);
  });

  it("explains the difference in dollars when amounts do not add up", () => {
    expect(() =>
      validateExactSplit(1000, [
        { memberId: "a", amount: 700 },
        { memberId: "b", amount: 200 },
      ]),
    ).toThrow("The amounts add up to $9.00, but the expense is $10.00.");
  });
});

describe("formatMoney", () => {
  it("formats cents as dollars", () => {
    expect(formatMoney(190000)).toBe("$1,900.00");
    expect(formatMoney(5)).toBe("$0.05");
  });
});
