import type { InputHTMLAttributes } from "react";
import { IconClose } from "@/shared/icons";
import styles from "./SearchField.module.css";

type SearchFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "onChange"
> & {
  value: string;
  onValueChange: (value: string) => void;
  clearLabel?: string;
};

export function SearchField({
  value,
  onValueChange,
  clearLabel = "Очистить",
  className = "",
  ...props
}: SearchFieldProps) {
  const hasValue = value.length > 0;

  return (
    <div
      className={`${styles.wrap} ${hasValue ? styles.wrapWithClear : ""} ${className}`.trim()}
    >
      <input
        {...props}
        type="search"
        className={styles.input}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
      />
      {hasValue ? (
        <button
          type="button"
          className={styles.clearBtn}
          aria-label={clearLabel}
          onClick={() => onValueChange("")}
        >
          <IconClose size={16} />
        </button>
      ) : null}
    </div>
  );
}
