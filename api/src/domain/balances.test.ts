import { describe, expect, it } from "vitest";
import { calculateBalances } from "./balances.js";
import { dollars, members, tripExpenses } from "./fixtures.js";
describe("calculateBalances", () => {
  it("calculates who is up and who is down", () => {
    const balances = calculateBalances(members, tripExpenses);

    expect(Object.fromEntries(balances)).toEqual({
      you: dollars(-190),
      priya: dollars(-70),
      rohan: dollars(650),
      aditi: dollars(-390),
    });
  });

  it("always adds up to zero", () => {
    const balances = calculateBalances(members, tripExpenses);
    const total = [...balances.values()].reduce((sum, value) => sum + value, 0);
    expect(total).toBe(0);
  });

  it("applies settlements", () => {
    const balances = calculateBalances(members, tripExpenses, [
      { fromMemberId: "you", toMemberId: "rohan", amount: dollars(190) },
    ]);
    expect(balances.get("you")).toBe(0);
    expect(balances.get("rohan")).toBe(dollars(460));
  });

  it("starts everyone at zero when there are no expenses", () => {
    const balances = calculateBalances(members, []);
    expect([...balances.values()]).toEqual([0, 0, 0, 0]);
  });

  it("rejects unknown members", () => {
    expect(() =>
      calculateBalances(
        ["a"],
        [
          {
            paidById: "stranger",
            amount: 100,
            shares: [{ memberId: "a", amount: 100 }],
          },
        ],
      ),
    ).toThrow("Unknown member");
  });

  it("rejects an expense whose shares do not add up", () => {
    expect(() =>
      calculateBalances(
        ["a", "b"],
        [
          {
            paidById: "a",
            amount: 100,
            shares: [{ memberId: "b", amount: 90 }],
          },
        ],
      ),
    ).toThrow("add up to its amount");
  });
});
