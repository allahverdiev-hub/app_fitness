import type { WorkoutListExerciseItem } from "@/features/workout-list/types/workoutOverview";

export type ExerciseSectionGroup = {
  title?: string;
  entries: { exercise: WorkoutListExerciseItem; index: number }[];
};

export function buildExerciseSections(
  exercises: WorkoutListExerciseItem[],
): ExerciseSectionGroup[] {
  const groups: ExerciseSectionGroup[] = [];
  let i = 0;

  while (i < exercises.length) {
    const sectionTitle = exercises[i].section;
    if (sectionTitle) {
      const entries: ExerciseSectionGroup["entries"] = [];
      while (i < exercises.length && exercises[i].section === sectionTitle) {
        entries.push({ exercise: exercises[i], index: i });
        i += 1;
      }
      groups.push({ title: sectionTitle, entries });
      continue;
    }

    const entries: ExerciseSectionGroup["entries"] = [];
    while (i < exercises.length && !exercises[i].section) {
      entries.push({ exercise: exercises[i], index: i });
      i += 1;
    }
    groups.push({ entries });
  }

  return groups;
}
