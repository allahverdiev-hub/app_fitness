import { IconButton } from "@/shared/ui/IconButton/IconButton";
import { IconStop } from "@/shared/icons";
import styles from "./TimerBar.module.css";

type TimerBarProps = {
  elapsed: string;
  isPaused?: boolean;
  onStop?: () => void;
};

export function TimerBar({ elapsed, isPaused = false, onStop }: TimerBarProps) {
  return (
    <div className={styles.bar}>
      <p className={styles.text}>
        <span className={styles.label}>Тренировка</span>
        <span
          className={`${styles.time} ${isPaused ? styles.timePaused : ""}`}
          aria-live="off"
        >
          {elapsed}
        </span>
      </p>
      <IconButton
        variant="ghost"
        label={
          isPaused ? "Продолжить тренировку" : "Поставить тренировку на паузу"
        }
        className={`${styles.stopBtn} ${isPaused ? styles.stopBtnPaused : ""}`}
        onClick={onStop}
      >
        <IconStop size={18} />
      </IconButton>
    </div>
  );
}
