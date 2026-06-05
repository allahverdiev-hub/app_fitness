import { IconStop } from "@/shared/icons";
import styles from "./WorkoutActiveBar.module.css";

type WorkoutActiveBarProps = {
  elapsed: string;
  isPaused?: boolean;
  onFinish?: () => void;
  onTogglePause?: () => void;
  className?: string;
};

export function WorkoutActiveBar({
  elapsed,
  isPaused = false,
  onFinish,
  onTogglePause,
  className = "",
}: WorkoutActiveBarProps) {
  return (
    <div className={`${styles.bar} ${className}`.trim()}>
      <span
        className={`${styles.time} ${isPaused ? styles.timePaused : ""}`}
        aria-live="polite"
      >
        {elapsed}
      </span>
      <button
        type="button"
        className={styles.finishBtn}
        onClick={onFinish}
        aria-label="Завершить тренировку"
      >
        Завершить
      </button>
      <button
        type="button"
        className={`${styles.stopBtn} ${isPaused ? styles.stopBtnPaused : ""}`}
        onClick={onTogglePause}
        aria-label={
          isPaused ? "Продолжить тренировку" : "Поставить тренировку на паузу"
        }
      >
        <IconStop size={16} />
      </button>
    </div>
  );
}
