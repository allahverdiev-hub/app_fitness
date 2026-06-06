import type { ButtonHTMLAttributes, ReactNode } from "react";
import { IconCheck } from "@/shared/icons";
import styles from "./FilterTag.module.css";

type FilterTagProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "children"
> & {
  children: ReactNode;
  active?: boolean;
};

export function FilterTag({
  children,
  active = false,
  className = "",
  ...props
}: FilterTagProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={`${styles.tag} ${active ? styles.tagActive : ""} ${className}`.trim()}
      {...props}
    >
      <span
        className={`${styles.check} ${active ? styles.checkVisible : ""}`.trim()}
        aria-hidden
      >
        <IconCheck size={14} />
      </span>
      <span className={styles.label}>{children}</span>
    </button>
  );
}

type FilterTagRowProps = {
  children: ReactNode;
  ariaLabel?: string;
  className?: string;
};

export function FilterTagRow({
  children,
  ariaLabel = "Фильтры",
  className = "",
}: FilterTagRowProps) {
  return (
    <div className={`${styles.row} ${className}`.trim()} aria-label={ariaLabel}>
      {children}
    </div>
  );
}
