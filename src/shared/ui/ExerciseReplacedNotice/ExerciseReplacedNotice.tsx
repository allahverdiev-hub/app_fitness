import { useEffect, useRef, useState } from "react";

import {
  REPLACE_NOTICE_LEAVE_MS,
  REPLACE_NOTICE_MS,
} from "./replaceNoticeTiming";

import styles from "./ExerciseReplacedNotice.module.css";

type ExerciseReplacedNoticeProps = {
  open: boolean;
  onClose: () => void;
  bottomOffset?: string;
};

export function ExerciseReplacedNotice({
  open,
  onClose,
  bottomOffset,
}: ExerciseReplacedNoticeProps) {
  const onCloseRef = useRef(onClose);
  const [phase, setPhase] = useState<"hidden" | "entering" | "leaving">("hidden");

  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) {
      setPhase("hidden");
      return undefined;
    }

    setPhase("entering");

    const leaveTimer = window.setTimeout(() => {
      setPhase("leaving");
    }, REPLACE_NOTICE_MS - REPLACE_NOTICE_LEAVE_MS);

    const closeTimer = window.setTimeout(() => {
      setPhase("hidden");
      onCloseRef.current();
    }, REPLACE_NOTICE_MS);

    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(closeTimer);
    };
  }, [open]);

  if (phase === "hidden") return null;

  return (
    <div
      className={styles.host}
      style={
        bottomOffset
          ? ({ ["--replace-notice-bottom" as string]: bottomOffset } as const)
          : undefined
      }
      role="status"
      aria-live="polite"
    >
      <p
        className={`${styles.plate} ${
          phase === "leaving" ? styles.leaving : styles.entering
        }`}
      >
        Упражнение заменено
      </p>
    </div>
  );
}
