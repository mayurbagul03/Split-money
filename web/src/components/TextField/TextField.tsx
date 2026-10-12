import { useId, type InputHTMLAttributes } from "react";
import styles from "./TextField.module.css";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
  /** Keeps the label for screen readers but hides it visually. */
  hideLabel?: boolean;
};

export function TextField({
  label,
  error,
  hint,
  hideLabel = false,
  id,
  className,
  ...rest
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;
  const message = error ?? hint;

  return (
    <div className={[styles.field, className ?? ""].join(" ")}>
      <label
        htmlFor={inputId}
        className={hideLabel ? "visually-hidden" : styles.label}
      >
        {label}
      </label>
      <input
        id={inputId}
        className={[styles.input, error ? styles.invalid : ""].join(" ")}
        aria-invalid={error ? true : undefined}
        aria-describedby={message ? messageId : undefined}
        {...rest}
      />
      {message && (
        <p id={messageId} className={error ? styles.error : styles.hint}>
          {message}
        </p>
      )}
    </div>
  );
}
