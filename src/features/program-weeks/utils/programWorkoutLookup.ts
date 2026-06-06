import type {
  ProgramDifficulty,
  ProgramOverview,
  ProgramWorkoutSession,
} from "@/features/program-weeks/types/programWeeks";

function findProgramWorkoutSession(
  overview: ProgramOverview,
  workoutId: string,
): ProgramWorkoutSession | undefined {
  for (const week of overview.weeks) {
    const workout = week.workouts.find((item) => item.id === workoutId);
    if (workout) return workout;
  }
  return undefined;
}

/** Как на карточке: title, иначе dayLabel */
export function getProgramWorkoutDisplayTitle(
  workout: ProgramWorkoutSession,
): string {
  return workout.title ?? workout.dayLabel;
}

export function getProgramWorkoutTitleById(
  overview: ProgramOverview,
  workoutId: string,
): string | undefined {
  const workout = findProgramWorkoutSession(overview, workoutId);
  return workout ? getProgramWorkoutDisplayTitle(workout) : undefined;
}

export function findProgramWorkoutWeekNumber(
  overview: ProgramOverview,
  workoutId: string,
): number | undefined {
  for (const week of overview.weeks) {
    if (week.workouts.some((item) => item.id === workoutId)) {
      return week.weekNumber;
    }
  }
  return undefined;
}

export function findProgramWorkoutWeekDifficulty(
  overview: ProgramOverview,
  workoutId: string,
): ProgramDifficulty | undefined {
  for (const week of overview.weeks) {
    if (week.workouts.some((item) => item.id === workoutId)) {
      return week.difficulty;
    }
  }
  return undefined;
}
