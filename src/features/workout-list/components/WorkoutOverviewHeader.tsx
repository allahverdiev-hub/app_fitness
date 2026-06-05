import type { WorkoutOverview } from "@/features/workout-list/types/workoutOverview";
import { PageTitle } from "@/shared/ui/PageTitle/PageTitle";
import { ProgressOverview } from "@/shared/ui/ProgressOverview";
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
      <ProgressOverview
        completed={done}
        total={total}
        spacing="section"
        ariaLabel={`Выполнено упражнений: ${done} из ${total}`}
      />
    </div>
  );
}
