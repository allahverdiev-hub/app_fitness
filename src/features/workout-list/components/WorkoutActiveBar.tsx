import styles from "./WorkoutActiveBar.module.css";

type WorkoutActiveBarProps = {
  elapsed: string;
  isPaused?: boolean;
  onFinish?: () => void;
  className?: string;
};

export function WorkoutActiveBar({
  elapsed,
  isPaused = false,
  onFinish,
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
    </div>
  );
}
