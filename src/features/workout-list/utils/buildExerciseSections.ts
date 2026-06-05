import type { WorkoutListExerciseItem } from "@/features/workout-list/types/workoutOverview";

export const WARMUP_SECTION_TITLE = "Разминочные";

export type ExerciseSectionGroup = {
  title?: string;
  entries: { exercise: WorkoutListExerciseItem; index: number }[];
};

export function isWarmupExercise(exercise: WorkoutListExerciseItem): boolean {
  return exercise.section === WARMUP_SECTION_TITLE;
}

export function buildExerciseSections(
  exercises: WorkoutListExerciseItem[],
): ExerciseSectionGroup[] {
  const warmupEntries: ExerciseSectionGroup["entries"] = [];
  const workingEntries: ExerciseSectionGroup["entries"] = [];

  exercises.forEach((exercise, index) => {
    const entry = { exercise, index };
    if (isWarmupExercise(exercise)) {
      warmupEntries.push(entry);
    } else {
      workingEntries.push(entry);
    }
  });

  const groups: ExerciseSectionGroup[] = [];

  if (warmupEntries.length > 0) {
    groups.push({ title: WARMUP_SECTION_TITLE, entries: warmupEntries });
  }

  if (workingEntries.length > 0) {
    groups.push({ entries: workingEntries });
  }

  return groups;
}

/** Порядок карточек на экране: сначала разминка, затем рабочие */
export function buildVisualExerciseOrder(
  exercises: WorkoutListExerciseItem[],
): number[] {
  return buildExerciseSections(exercises).flatMap((group) =>
    group.entries.map((entry) => entry.index),
  );
}

function reorderVisualOrder(order: number[], from: number, to: number): number[] {
  if (from === to) return order;
  const next = [...order];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function reorderExercisesWithSections(
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

  const fromArrayIndex = visualOrder[fromVisual];
  const moved = exercises[fromArrayIndex];
  const warmupBefore = visualOrder.filter((index) =>
    isWarmupExercise(exercises[index]),
  ).length;

  let warmupAfter = warmupBefore;
  if (isWarmupExercise(moved) && toVisual >= warmupBefore) {
    warmupAfter -= 1;
  } else if (!isWarmupExercise(moved) && toVisual < warmupBefore) {
    warmupAfter += 1;
  }

  const nextVisualOrder = reorderVisualOrder(
    visualOrder,
    fromVisual,
    toVisual,
  );

  return nextVisualOrder.map((arrayIndex, visualIndex) => ({
    ...exercises[arrayIndex],
    section:
      visualIndex < warmupAfter ? WARMUP_SECTION_TITLE : undefined,
  }));
}
