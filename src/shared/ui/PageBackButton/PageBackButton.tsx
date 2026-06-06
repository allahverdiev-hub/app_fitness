import type { ButtonHTMLAttributes } from "react";
import { IconChevronLeft } from "@/shared/icons";
import styles from "./PageBackButton.module.css";

type PageBackButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  label?: string;
};

export function PageBackButton({
  label = "Назад",
  className = "",
  type = "button",
  ...props
}: PageBackButtonProps) {
  return (
    <button
      type={type}
      className={`${styles.btn} ${className}`.trim()}
      aria-label={label}
      {...props}
    >
      <IconChevronLeft size={18} />
    </button>
  );
}
