import styles from "./SegmentedExerciseProgress.module.css";

type SegmentedExerciseProgressProps = {
  completed: number;
  total: number;
};

export function SegmentedExerciseProgress({
  completed,
  total,
}: SegmentedExerciseProgressProps) {
  if (total <= 0) return null;

  return (
    <div
      className={styles.track}
      style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}
      role="progressbar"
      aria-valuenow={completed}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={`Выполнено упражнений: ${completed} из ${total}`}
    >
      {Array.from({ length: total }, (_, index) => (
        <span
          key={index}
          className={
            index < completed ? styles.segmentDone : styles.segment
          }
          aria-hidden
        />
      ))}
    </div>
  );
}
