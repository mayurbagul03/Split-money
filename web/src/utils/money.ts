/** 4500 → "$45.00" */
export function formatMoney(cents: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
    cents / 100,
  );
}

/**
 * Turns what someone typed into cents: "12.5" → 1250, "$1,200" → 120000.
 * Returns null if it isn't a valid amount. Uses text, not decimal maths,
 * so there are no rounding errors.
 */
export function parseMoney(input: string): number | null {
  const cleaned = input.replace(/[$,\s]/g, "");
  if (!/^\d+(\.\d{0,2})?$/.test(cleaned)) {
    return null;
  }
  const [whole, fraction = ""] = cleaned.split(".");
  return Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
}
