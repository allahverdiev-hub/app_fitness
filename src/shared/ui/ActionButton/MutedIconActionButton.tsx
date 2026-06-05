import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./ActionButton.module.css";

type MutedIconActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  label: string;
};

export function MutedIconActionButton({
  children,
  label,
  className = "",
  type = "button",
  ...props
}: MutedIconActionButtonProps) {
  return (
    <button
      type={type}
      className={`${styles.mutedIcon} ${className}`.trim()}
      aria-label={label}
      {...props}
    >
      {children}
    </button>
  );
}
