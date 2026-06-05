import type { WorkoutOverview } from "@/features/workout-list/types/workoutOverview";
import { SegmentedExerciseProgress } from "@/features/workout-list/components/SegmentedExerciseProgress";
import { PageTitle } from "@/shared/ui/PageTitle/PageTitle";
import styles from "./WorkoutOverviewHeader.module.css";

type WorkoutOverviewHeaderProps = {
  overview: WorkoutOverview;
};

export function WorkoutOverviewHeader({ overview }: WorkoutOverviewHeaderProps) {
  const total = overview.exercises.length;
  const done = overview.completedExerciseCount;

  return (
    <div className={styles.block}>
      <p className={styles.meta}>
        <span>{overview.intensityLabel}</span>
        <span className={styles.metaDot} aria-hidden>
          •
        </span>
        <span>{overview.durationLabel}</span>
      </p>
      <PageTitle>{overview.title}</PageTitle>
      <p className={styles.hint}>{overview.hint}</p>
      <div className={styles.progressBlock}>
        <p className={styles.progressLabel}>
          {done} из {total}
        </p>
        <SegmentedExerciseProgress completed={done} total={total} />
      </div>
    </div>
  );
}
