import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./ActionButton.module.css";

type SecondaryActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function SecondaryActionButton({
  children,
  className = "",
  type = "button",
  ...props
}: SecondaryActionButtonProps) {
  return (
    <button
      type={type}
      className={`${styles.secondary} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
