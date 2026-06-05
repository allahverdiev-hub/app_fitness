import type { EnrichedProgramWeek } from "@/features/program-weeks/utils/workoutProgress";
import { DifficultyBadge } from "@/features/program-weeks/components/DifficultyBadge";
import { WorkoutSessionCard } from "@/features/program-weeks/components/WorkoutSessionCard";
import styles from "./ProgramWeekSection.module.css";

type ProgramWeekSectionProps = {
  week: EnrichedProgramWeek;
  onOpenWorkout?: (workoutId: string) => void;
};

export function ProgramWeekSection({
  week,
  onOpenWorkout,
}: ProgramWeekSectionProps) {
  return (
    <section
      id={week.id}
      className={styles.section}
      aria-labelledby={`week-${week.id}`}
    >
      <div className={styles.intro}>
        <div className={styles.header}>
          <DifficultyBadge
            id={`week-${week.id}`}
            difficulty={week.difficulty}
            weekTitle={week.title}
          />
        </div>
        <p className={styles.description}>{week.description}</p>
      </div>
      <ul className={styles.list}>
        {week.workouts.map((workout) => (
          <li key={workout.id}>
            <WorkoutSessionCard
              workout={workout}
              onOpen={onOpenWorkout}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
