import type { ReactNode } from "react";
import styles from "./Page.module.css";

interface PageProps {
  children: ReactNode;
  /** Stays at the bottom of the screen, e.g. the main action button. */
  footer?: ReactNode;
}

export function Page({ children, footer }: PageProps) {
  return (
    <div className={styles.page}>
      <main className={styles.content}>{children}</main>
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
}
