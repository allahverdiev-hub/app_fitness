import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./ActionButton.module.css";

type PrimaryActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function PrimaryActionButton({
  children,
  className = "",
  type = "button",
  ...props
}: PrimaryActionButtonProps) {
  return (
    <button
      type={type}
      className={`${styles.primary} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
