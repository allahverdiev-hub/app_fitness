import { useEffect, useRef, type ReactNode } from "react";

import { REPLACE_REVEAL_MS } from "./replaceAnimationTiming";

import styles from "./ReplaceReveal.module.css";

type ReplaceRevealProps = {
  active: boolean;
  onComplete?: () => void;
  children: ReactNode;
};

export function ReplaceReveal({
  active,
  onComplete,
  children,
}: ReplaceRevealProps) {
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!active) return undefined;

    const timer = window.setTimeout(() => {
      onCompleteRef.current?.();
    }, REPLACE_REVEAL_MS);

    return () => window.clearTimeout(timer);
  }, [active]);

  return (
    <div className={`${styles.wrap} ${active ? styles.active : ""}`}>
      <div className={styles.flashRing} aria-hidden />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
