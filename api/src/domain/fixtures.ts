import { splitEqually } from "./split.js";
import type { ExpenseInput } from "./types.js";

export const dollars = (value: number) => value * 100;

export const members = ["you", "priya", "rohan", "aditi"];

/** A sample weekend trip: four friends, five shared expenses. */
export const tripExpenses: ExpenseInput[] = [
  {
    paidById: "priya",
    amount: dollars(480),
    shares: splitEqually(dollars(480), members),
  }, // seafood dinner
  {
    paidById: "you",
    amount: dollars(240),
    shares: splitEqually(dollars(240), members),
  }, // bike rental
  {
    paidById: "rohan",
    amount: dollars(1200),
    shares: splitEqually(dollars(1200), members),
  }, // hotel, 2 nights
  {
    paidById: "you",
    amount: dollars(120),
    shares: splitEqually(dollars(120), members),
  }, // gas
  {
    paidById: "aditi",
    amount: dollars(160),
    shares: splitEqually(dollars(160), members),
  }, // breakfast
];
