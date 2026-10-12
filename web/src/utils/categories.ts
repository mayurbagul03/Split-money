import type { Category } from "../types";

export const categoryLabels: Record<Category, string> = {
  FOOD: "Food",
  STAY: "Stay",
  TRAVEL: "Travel",
  FUN: "Fun",
  OTHER: "Other",
};

export const categories = Object.keys(categoryLabels) as Category[];
