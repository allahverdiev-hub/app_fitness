import type { ReactNode } from "react";
import styles from "./MobileFrame.module.css";

type MobileFrameProps = {
  children: ReactNode;
};

export function MobileFrame({ children }: MobileFrameProps) {
  return (
    <div className={styles.viewport}>
      <div className={styles.phone}>{children}</div>
    </div>
  );
}
