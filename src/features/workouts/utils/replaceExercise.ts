import { exerciseDescriptionsById } from "@/features/exercise-page/mocks/descriptions";
import type { ExerciseDescription } from "@/features/exercise-page/types/exercise";
import type { WorkoutSessionExerciseDef } from "@/features/workouts/mocks/workoutSession";
import { workoutSessionExercises } from "@/features/workouts/mocks/workoutSession";
import { replacementCatalog } from "@/features/exercise-page/mocks/replaceSuggestions";

type ReplacementPatch = Omit<
  WorkoutSessionExerciseDef,
  "id" | "completed" | "status"
>;

function resolveReplacementPatch(
  suggestionId: string,
): ReplacementPatch | null {
  const catalog = replacementCatalog[suggestionId];
  if (catalog) return catalog;

  const fromSession = workoutSessionExercises.find(
    (item) => item.id === suggestionId,
  );
  if (!fromSession) return null;

  const { id: _id, completed: _completed, status: _status, ...patch } =
    fromSession;
  return patch;
}

function resolveReplacementDescription(
  suggestionId: string,
  fallbackId: string,
): ExerciseDescription | undefined {
  return (
    exerciseDescriptionsById[suggestionId] ??
    exerciseDescriptionsById[fallbackId]
  );
}

export function applyExerciseReplacement(
  defs: WorkoutSessionExerciseDef[],
  targetId: string,
  suggestionId: string,
): WorkoutSessionExerciseDef[] {
  const patch = resolveReplacementPatch(suggestionId);
  if (!patch) return defs;

  return defs.map((def) => {
    if (def.id !== targetId) return def;

    const description = resolveReplacementDescription(suggestionId, def.id);

    return {
      ...def,
      ...patch,
      id: targetId,
      completed: def.completed,
      status: def.status,
      description,
    };
  });
}
