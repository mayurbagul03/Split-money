import type { ReactNode } from "react";
import { Link } from "react-router";
import styles from "./PageHeader.module.css";

interface PageHeaderProps {
  title: string;
  eyebrow?: string;
  subtitle?: ReactNode;
  backTo?: string;
  backLabel?: string;
}

export function PageHeader({
  title,
  eyebrow,
  subtitle,
  backTo,
  backLabel = "Back",
}: PageHeaderProps) {
  return (
    <header className={styles.header}>
      {backTo && (
        <Link to={backTo} className={styles.back} aria-label={backLabel}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
      )}
      <div className={styles.titles}>
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
    </header>
  );
}
