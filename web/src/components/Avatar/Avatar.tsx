import { colorFor, initialOf } from "../../utils/avatar";
import styles from "./Avatar.module.css";

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
}

export function Avatar({ name, size = "md" }: AvatarProps) {
  return (
    <span
      className={`${styles.avatar} ${styles[size]}`}
      style={{ background: colorFor(name) }}
      aria-hidden="true"
    >
      {initialOf(name)}
    </span>
  );
}
