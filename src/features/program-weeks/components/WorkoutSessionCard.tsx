import type { EnrichedProgramWorkoutSession } from "@/features/program-weeks/utils/workoutProgress";
import { WorkoutProgressIndicator } from "@/features/program-weeks/components/WorkoutProgressIndicator";
import styles from "./WorkoutSessionCard.module.css";

type WorkoutSessionCardProps = {
  workout: EnrichedProgramWorkoutSession;
  onOpen?: (workoutId: string) => void;
};

export function WorkoutSessionCard({
  workout,
  onOpen,
}: WorkoutSessionCardProps) {
  const isDone = workout.status === "completed";
  const isSingleLine = !workout.title;

  return (
    <button
      type="button"
      className={`${styles.card} ${isDone ? styles.cardDone : ""}`}
      onClick={() => onOpen?.(workout.id)}
    >
      <WorkoutProgressIndicator
        status={workout.status}
        progressPercent={workout.progressPercent}
      />
      <span
        className={`${styles.body} ${isDone ? styles.bodyDone : ""} ${isSingleLine ? styles.bodySingleLine : ""}`}
      >
        {workout.title ? (
          <span className={styles.title}>{workout.title}</span>
        ) : null}
        <span
          className={
            workout.title ? styles.dayLabel : styles.dayLabelPrimary
          }
        >
          {workout.dayLabel}
        </span>
      </span>
    </button>
  );
}
