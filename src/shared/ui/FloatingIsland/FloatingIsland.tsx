import type { ReactNode } from "react";
import styles from "./FloatingIsland.module.css";

type FloatingIslandProps = {
  children: ReactNode;
  className?: string;
  /** Без подложки, тени и внутренних отступов (панели кнопок) */
  bare?: boolean;
  /** Без подложки и тени, но с обычными отступами (таб-бар) */
  transparent?: boolean;
};

export function FloatingIsland({
  children,
  className = "",
  bare = false,
  transparent = false,
}: FloatingIslandProps) {
  return (
    <div
      className={`${styles.island} ${styles.row} ${bare ? styles.bare : ""} ${
        transparent ? styles.transparent : ""
      } ${className}`.trim()}
    >
      {children}
    </div>
  );
}
