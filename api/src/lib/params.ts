import { z } from "zod";
import { notFound } from "./httpError.js";

const uuid = z.string().uuid();

export function parseId(value: string, what: string): string {
  const result = uuid.safeParse(value);
  if (!result.success) {
    throw notFound(what);
  }
  return result.data;
}
