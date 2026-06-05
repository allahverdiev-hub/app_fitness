import type { ExerciseItem, ExerciseStatus } from "@/features/exercise-page/types/exercise";

export function getExerciseStatus(
  exercise: ExerciseItem,
  activeId: string,
  completedSetsById: Record<string, number>,
): ExerciseStatus {
  if (exercise.id === activeId) return "active";
  const done = completedSetsById[exercise.id] ?? 0;
  if (done >= exercise.sets) return "completed";
  return "upcoming";
}

export function mapExercisesWithProgress(
  exercises: ExerciseItem[],
  activeId: string,
  completedSetsById: Record<string, number>,
): ExerciseItem[] {
  return exercises.map((ex) => ({
    ...ex,
    status: getExerciseStatus(ex, activeId, completedSetsById),
    completedSets: completedSetsById[ex.id] ?? 0,
  }));
}

export function buildInitialCompletedSets(
  exercises: ExerciseItem[],
): Record<string, number> {
  const map: Record<string, number> = {};
  for (const ex of exercises) {
    if (ex.status === "completed") map[ex.id] = ex.sets;
  }
  return map;
}

export function isExerciseFullyComplete(
  sets: number,
  completedSets: number,
): boolean {
  return sets > 0 && completedSets >= sets;
}

export function isWorkoutComplete(
  exercises: ExerciseItem[],
  completedSetsById: Record<string, number>,
): boolean {
  if (exercises.length === 0) return false;
  return exercises.every((ex) => {
    const done = completedSetsById[ex.id] ?? 0;
    return isExerciseFullyComplete(ex.sets, done);
  });
}

export function countFullyCompletedExercises(
  items: { id: string; sets: number }[],
  completedSetsById: Record<string, number>,
): number {
  return items.filter((item) =>
    isExerciseFullyComplete(item.sets, completedSetsById[item.id] ?? 0),
  ).length;
}
