import type { ReactNode } from "react";
import styles from "./Alert.module.css";

export function Alert({
  children,
  action,
}: {
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div role="alert" className={styles.alert}>
      <p className={styles.message}>{children}</p>
      {action}
    </div>
  );
}
