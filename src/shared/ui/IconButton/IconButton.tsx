import type { ReactNode, ButtonHTMLAttributes } from "react";
import styles from "./IconButton.module.css";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "ghost" | "capsule" | "circle";
  label: string;
};

export function IconButton({
  children,
  variant = "ghost",
  label,
  className = "",
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      className={`${styles.btn} ${styles[variant]} ${className}`.trim()}
      aria-label={label}
      {...props}
    >
      {children}
    </button>
  );
}
