import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./ActionButton.module.css";

type Level2ActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  icon?: ReactNode;
  /** Растянуть в ряд (как Техника / Заменить) */
  grow?: boolean;
  /** На всю ширину (поп-ап, колонка) */
  block?: boolean;
  danger?: boolean;
};

export function Level2ActionButton({
  children,
  icon,
  grow = false,
  block = false,
  danger = false,
  className = "",
  type = "button",
  ...props
}: Level2ActionButtonProps) {
  return (
    <button
      type={type}
      className={[
        styles.level2,
        icon ? styles.level2WithIcon : "",
        grow ? styles.level2Grow : "",
        block ? styles.level2Block : "",
        danger ? styles.level2Danger : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <span className={styles.level2Label}>{children}</span>
      {icon ? <span className={styles.level2Icon}>{icon}</span> : null}
    </button>
  );
}
