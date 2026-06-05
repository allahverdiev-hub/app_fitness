import type { WorkoutSessionExerciseDef } from "@/features/workouts/mocks/workoutSession";

export function applyExerciseDeletion(
  defs: WorkoutSessionExerciseDef[],
  targetId: string,
): WorkoutSessionExerciseDef[] {
  return defs.filter((def) => def.id !== targetId);
}
