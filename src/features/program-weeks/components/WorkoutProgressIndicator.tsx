import { IconCheck } from "@/shared/icons";
import { getWorkoutProgressRingColor } from "@/features/program-weeks/utils/workoutProgress";
import type { WorkoutSessionStatus } from "@/features/program-weeks/types/programWeeks";
import styles from "./WorkoutProgressIndicator.module.css";

const SIZE = 56;
const STROKE = 5;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type WorkoutProgressIndicatorProps = {
  status: WorkoutSessionStatus;
  progressPercent?: number;
};

export function WorkoutProgressIndicator({
  status,
  progressPercent = 0,
}: WorkoutProgressIndicatorProps) {
  if (status === "completed") {
    return (
      <span className={styles.done} aria-hidden>
        <IconCheck size={24} className={styles.doneIcon} />
      </span>
    );
  }

  const clamped = Math.max(0, Math.min(100, progressPercent));
  const dashOffset = CIRCUMFERENCE * (1 - clamped / 100);
  const ringColor =
    status === "in_progress" ? getWorkoutProgressRingColor() : "transparent";

  return (
    <span className={styles.ringWrap} aria-hidden>
      <svg
        className={styles.ring}
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="img"
        aria-label={
          status === "not_started"
            ? "Не начата"
            : `Выполнено ${clamped} процентов`
        }
      >
        <circle
          className={styles.track}
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          strokeWidth={STROKE}
          fill="none"
        />
        {status === "in_progress" ? (
          <circle
            className={styles.progress}
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            strokeWidth={STROKE}
            fill="none"
            stroke={ringColor}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          />
        ) : null}
      </svg>
      <span className={styles.label}>
        {status === "not_started" ? "0%" : `${clamped}%`}
      </span>
    </span>
  );
}
