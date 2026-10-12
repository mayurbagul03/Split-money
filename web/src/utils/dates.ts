const shortDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

/** "Oct 16 – 18", or "Oct 16" for a single day, or null with no dates. */
export function formatDateRange(
  start: string | null,
  end: string | null,
): string | null {
  if (!start) return null;
  const startDate = new Date(start);
  if (!end || end === start) return shortDate.format(startDate);
  return shortDate.formatRange(startDate, new Date(end));
}
