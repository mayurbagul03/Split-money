import { z } from "zod";

const memberId = z.string().uuid("Choose a valid person.");

const cents = z
  .number()
  .int("Amounts must be whole cents.")
  .positive("Amount must be more than zero.")
  .max(100_000_000, "Amounts can be up to $1,000,000.");

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use the date format YYYY-MM-DD.");

const splitSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("EQUAL"),
    memberIds: z
      .array(memberId)
      .min(1, "Choose at least one person to split with."),
  }),
  z.object({
    type: z.literal("EXACT"),
    shares: z
      .array(
        z.object({
          memberId,
          amount: z
            .number()
            .int("Amounts must be whole cents.")
            .min(0, "Amounts can't be negative."),
        }),
      )
      .min(1, "Choose at least one person to split with."),
  }),
  z.object({
    type: z.literal("SHARES"),
    shares: z
      .array(
        z.object({
          memberId,
          shares: z
            .number()
            .int("Shares must be whole numbers.")
            .positive("Each person needs at least 1 share."),
        }),
      )
      .min(1, "Choose at least one person to split with."),
  }),
]);

export const createExpenseSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Description is required.")
    .max(100, "Descriptions can be up to 100 characters."),
  amount: cents,
  category: z.enum(["FOOD", "STAY", "TRAVEL", "FUN", "OTHER"]).default("OTHER"),
  paidById: memberId,
  spentAt: isoDate.optional(),
  split: splitSchema,
});

export const createSettlementSchema = z
  .object({
    fromMemberId: memberId,
    toMemberId: memberId,
    amount: cents,
  })
  .refine((s) => s.fromMemberId !== s.toMemberId, {
    message: "Choose two different people.",
    path: ["toMemberId"],
  });

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type CreateSettlementInput = z.infer<typeof createSettlementSchema>;
