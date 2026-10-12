const colors = [
  "var(--avatar-1)",
  "var(--avatar-2)",
  "var(--avatar-3)",
  "var(--avatar-4)",
  "var(--avatar-5)",
];

export function colorFor(text: string): string {
  let hash = 0;
  for (const char of text) {
    hash = (hash * 31 + char.codePointAt(0)!) >>> 0;
  }
  return colors[hash % colors.length]!;
}

export function initialOf(name: string): string {
  return name.trim().charAt(0).toUpperCase() || "?";
}
