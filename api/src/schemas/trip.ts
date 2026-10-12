import { z } from "zod";

const personName = z
  .string()
  .trim()
  .min(1, "Name is required.")
  .max(40, "Names can be up to 40 characters.");

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use the date format YYYY-MM-DD.");

export const createTripSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Trip name is required.")
      .max(80, "Trip names can be up to 80 characters."),
    currency: z
      .string()
      .trim()
      .toUpperCase()
      .length(3, "Use a 3-letter currency code, like USD.")
      .default("USD"),
    startDate: isoDate.optional(),
    endDate: isoDate.optional(),
    members: z
      .array(personName)
      .min(1, "Add at least one person.")
      .max(50, "A trip can have up to 50 people."),
  })
  .refine(
    (trip) =>
      new Set(trip.members.map((m) => m.toLowerCase())).size ===
      trip.members.length,
    { message: "Each person needs a different name.", path: ["members"] },
  );

export const addMemberSchema = z.object({
  name: personName,
});

export type CreateTripInput = z.infer<typeof createTripSchema>;
