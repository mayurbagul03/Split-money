import type { Category } from "../../types";
import styles from "./CategoryIcon.module.css";

const icons: Record<Category, string[]> = {
  FOOD: ["M4 3v8a3 3 0 0 0 6 0V3", "M7 3v18", "M17 3c-2 0-3 3-3 6s1 4 3 4v8"],
  STAY: ["M3 20V8l9-5 9 5v12", "M9 20v-6h6v6"],
  TRAVEL: [
    "M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z",
  ],
  FUN: [
    "M3 9a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v6a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2z",
    "M10 7v10",
  ],
  OTHER: ["M6 3h12v18l-3-2-3 2-3-2-3 2z", "M9 8h6", "M9 12h6"],
};

export function CategoryIcon({ category }: { category: Category }) {
  return (
    <span
      className={`${styles.tile} ${styles[category.toLowerCase()]}`}
      aria-hidden="true"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {icons[category].map((d) => (
          <path key={d} d={d} />
        ))}
      </svg>
    </span>
  );
}
