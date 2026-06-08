import type { WorkoutListExerciseItem } from "@/features/workout-list/types/workoutOverview";

export function buildVisualExerciseOrder(
  exercises: WorkoutListExerciseItem[],
): number[] {
  return exercises.map((_, index) => index);
}

function reorderVisualOrder(order: number[], from: number, to: number): number[] {
  if (from === to) return order;
  const next = [...order];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function reorderExercises(
  exercises: WorkoutListExerciseItem[],
  fromVisual: number,
  toVisual: number,
): WorkoutListExerciseItem[] {
  const visualOrder = buildVisualExerciseOrder(exercises);
  if (
    fromVisual < 0 ||
    toVisual < 0 ||
    fromVisual >= visualOrder.length ||
    toVisual >= visualOrder.length
  ) {
    return exercises;
  }

  const nextVisualOrder = reorderVisualOrder(
    visualOrder,
    fromVisual,
    toVisual,
  );

  return nextVisualOrder.map((arrayIndex) => exercises[arrayIndex]);
}
