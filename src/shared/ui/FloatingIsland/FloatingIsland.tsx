import type { ReactNode } from "react";
import styles from "./FloatingIsland.module.css";

type FloatingIslandProps = {
  children: ReactNode;
  className?: string;
};

export function FloatingIsland({
  children,
  className = "",
}: FloatingIslandProps) {
  return (
    <div className={`${styles.island} ${styles.row} ${className}`.trim()}>
      {children}
    </div>
  );
}
