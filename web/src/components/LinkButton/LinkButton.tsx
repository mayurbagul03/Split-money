import { Link, type LinkProps } from "react-router";
import styles from "../Button/Button.module.css";

type LinkButtonProps = LinkProps & {
  variant?: "primary" | "secondary";
  fullWidth?: boolean;
};

export function LinkButton({
  variant = "primary",
  fullWidth = false,
  className,
  ...rest
}: LinkButtonProps) {
  const classes = [
    styles.button,
    styles[variant],
    fullWidth ? styles.fullWidth : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");
  return <Link className={classes} {...rest} />;
}
