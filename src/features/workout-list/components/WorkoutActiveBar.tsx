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
    <button
      type="button"
      className={`${styles.bar} ${className}`.trim()}
      onClick={onFinish}
      aria-label={`Завершить тренировку, прошло ${elapsed}`}
    >
      <span
        className={`${styles.time} ${isPaused ? styles.timePaused : ""}`}
        aria-hidden
      >
        {elapsed}
      </span>
      <span className={styles.finishLabel}>Завершить</span>
    </button>
  );
}
