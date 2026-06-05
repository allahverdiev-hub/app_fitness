import { countFullyCompletedExercises } from "@/features/exercise-page/utils/exerciseStatus";
import type {
  ProgramOverview,
  ProgramWeek,
  ProgramWorkoutSession,
  WorkoutSessionStatus,
} from "@/features/program-weeks/types/programWeeks";

export type WorkoutProgress = {
  status: WorkoutSessionStatus;
  progressPercent: number;
};

export type EnrichedProgramWorkoutSession = ProgramWorkoutSession &
  WorkoutProgress;

export type EnrichedProgramWeek = Omit<ProgramWeek, "workouts"> & {
  workouts: EnrichedProgramWorkoutSession[];
};

export type EnrichedProgramOverview = Omit<ProgramOverview, "weeks"> & {
  weeks: EnrichedProgramWeek[];
};

export type WeekWorkoutStats = {
  completedWorkouts: number;
  totalWorkouts: number;
};

/** Тот же принцип, что и прогресс-бар на листинге: доля полностью выполненных упражнений */
export function computeWorkoutSessionProgress(
  exerciseIds: readonly string[],
  completedSetsById: Record<string, number>,
  setsByExerciseId: Record<string, number>,
): WorkoutProgress {
  if (exerciseIds.length === 0) {
    return { status: "not_started", progressPercent: 0 };
  }

  const items = exerciseIds.map((id) => ({
    id,
    sets: setsByExerciseId[id] ?? 0,
  }));

  const completedCount = countFullyCompletedExercises(
    items,
    completedSetsById,
  );
  const total = exerciseIds.length;
  const progressPercent = Math.round((completedCount / total) * 100);

  if (completedCount === 0) {
    return { status: "not_started", progressPercent: 0 };
  }

  if (completedCount >= total) {
    return { status: "completed", progressPercent: 100 };
  }

  return { status: "in_progress", progressPercent };
}

export function enrichProgramOverview(
  overview: ProgramOverview,
  sessionExerciseIds: readonly string[],
  completedSetsById: Record<string, number>,
  setsByExerciseId: Record<string, number>,
): EnrichedProgramOverview {
  const weeks: EnrichedProgramWeek[] = overview.weeks.map((week) => ({
    ...week,
    workouts: week.workouts.map(
      (workout): EnrichedProgramWorkoutSession => ({
        ...workout,
        ...computeWorkoutSessionProgress(
          sessionExerciseIds,
          completedSetsById,
          setsByExerciseId,
        ),
      }),
    ),
  }));

  return {
    ...overview,
    weeks,
  };
}

export function computeWeekWorkoutStats(
  weeks: readonly EnrichedProgramWeek[],
  weekNumber: number,
): WeekWorkoutStats {
  let completedWorkouts = 0;
  let totalWorkouts = 0;

  for (const week of weeks) {
    if (week.weekNumber !== weekNumber) continue;

    for (const workout of week.workouts) {
      totalWorkouts += 1;
      if (workout.status === "completed") {
        completedWorkouts += 1;
      }
    }
  }

  return { completedWorkouts, totalWorkouts };
}
