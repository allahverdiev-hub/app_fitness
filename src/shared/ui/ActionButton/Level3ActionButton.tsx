import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./ActionButton.module.css";

type Level3ActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  icon?: ReactNode;
  /** Растянуть в ряд (как Техника / Заменить) */
  grow?: boolean;
  /** На всю ширину (поп-ап, колонка) */
  block?: boolean;
  danger?: boolean;
};

export function Level3ActionButton({
  children,
  icon,
  grow = false,
  block = false,
  danger = false,
  className = "",
  type = "button",
  ...props
}: Level3ActionButtonProps) {
  return (
    <button
      type={type}
      className={[
        styles.level3,
        grow ? styles.level3Grow : "",
        block ? styles.level3Block : "",
        danger ? styles.level3Danger : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {icon ? <span className={styles.level3Icon}>{icon}</span> : null}
      <span className={styles.level3Label}>{children}</span>
    </button>
  );
}
