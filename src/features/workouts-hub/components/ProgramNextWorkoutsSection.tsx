import { WorkoutSessionCard } from "@/features/program-weeks/components/WorkoutSessionCard";
import type { EnrichedProgramWeek } from "@/features/program-weeks/utils/workoutProgress";
import styles from "./ProgramNextWorkoutsSection.module.css";

type ProgramNextWorkoutsSectionProps = {
  programId: string;
  week: EnrichedProgramWeek | null;
  onOpenWorkout?: (programId: string, workoutId: string) => void;
};

export function ProgramNextWorkoutsSection({
  programId,
  week,
  onOpenWorkout,
}: ProgramNextWorkoutsSectionProps) {
  if (!week) return null;

  return (
    <section className={styles.section} aria-label="Следующие тренировки">
      <h2 className={styles.title}>Следующие тренировки</h2>
      <ul className={styles.list}>
        {week.workouts.map((workout) => (
          <li key={workout.id}>
            <WorkoutSessionCard
              workout={workout}
              onOpen={(workoutId) =>
                onOpenWorkout?.(programId, workoutId)
              }
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
