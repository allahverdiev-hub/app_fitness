import { useMemo, useState } from "react";
import {
  mockProgramOverview,
  mockProgramWeekPicker,
} from "@/features/program-weeks/mocks/programWeeksMock";
import { ProgramWeeksTopBar } from "@/features/program-weeks/components/ProgramWeeksTopBar";
import { ProgramWeekPicker } from "@/features/program-weeks/components/ProgramWeekPicker";
import { ProgramOverviewHeader } from "@/features/program-weeks/components/ProgramOverviewHeader";
import { ProgramWeekSection } from "@/features/program-weeks/components/ProgramWeekSection";
import {
  computeWeekWorkoutStats,
  enrichProgramOverview,
} from "@/features/program-weeks/utils/workoutProgress";
import { ProgressOverview } from "@/shared/ui/ProgressOverview";
import styles from "./ProgramWeeksPage.module.css";

type ProgramWeeksPageProps = {
  onOpenWorkout?: (workoutId: string) => void;
  sessionExerciseIds: readonly string[];
  completedSetsById: Record<string, number>;
  setsByExerciseId: Record<string, number>;
};

export function ProgramWeeksPage({
  onOpenWorkout,
  sessionExerciseIds,
  completedSetsById,
  setsByExerciseId,
}: ProgramWeeksPageProps) {
  const [activeWeekNumber, setActiveWeekNumber] = useState(1);

  const overview = useMemo(
    () =>
      enrichProgramOverview(
        mockProgramOverview,
        sessionExerciseIds,
        completedSetsById,
        setsByExerciseId,
      ),
    [sessionExerciseIds, completedSetsById, setsByExerciseId],
  );

  const activeWeekStats = useMemo(
    () => computeWeekWorkoutStats(overview.weeks, activeWeekNumber),
    [overview.weeks, activeWeekNumber],
  );

  const visibleWeeks = useMemo(
    () =>
      overview.weeks.filter((week) => week.weekNumber === activeWeekNumber),
    [overview.weeks, activeWeekNumber],
  );

  return (
    <div className={styles.page}>
      <ProgramWeeksTopBar />
      <div className={styles.scroll}>
        <div className={styles.content}>
          <div className={styles.intro}>
            <ProgramOverviewHeader title={overview.title} />
            <ProgramWeekPicker
              options={mockProgramWeekPicker}
              activeWeekNumber={activeWeekNumber}
              onChange={setActiveWeekNumber}
            />
            <ProgressOverview
              completed={activeWeekStats.completedWorkouts}
              total={activeWeekStats.totalWorkouts}
              className={styles.weekProgress}
              ariaLabel={`Выполнено тренировок за неделю: ${activeWeekStats.completedWorkouts} из ${activeWeekStats.totalWorkouts}`}
            />
          </div>
          <div className={styles.weeks}>
            {visibleWeeks.map((week) => (
              <ProgramWeekSection
                key={week.id}
                week={week}
                onOpenWorkout={onOpenWorkout}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
