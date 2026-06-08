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
      <PageTitle>{overview.title}</PageTitle>
      <p className={styles.hint}>{overview.hint}</p>
      <ProgressOverview
        completed={done}
        total={total}
        variant="program"
        spacing="sectionTop"
        className={styles.progress}
        labelClassName={styles.progressLabel}
        ariaLabel={`Выполнено упражнений: ${done} из ${total}`}
      />
    </div>
  );
}
