import { exerciseImages } from "@/features/exercise-page/config/media";
import type { WorkoutSessionExerciseDef } from "@/features/workouts/mocks/workoutSession";
import { workoutSessionExercises } from "@/features/workouts/mocks/workoutSession";

export type ReplaceSuggestionItem = {
  id: string;
  title: string;
  subtitle: string;
  muscleGroup?: string;
  thumbnailSrc: string;
  imageAlt: string;
};

function toSuggestion(
  def: (typeof workoutSessionExercises)[number],
): ReplaceSuggestionItem {
  return {
    id: def.id,
    title: def.title,
    subtitle: def.listSubtitle,
    muscleGroup: def.muscleGroup,
    thumbnailSrc: def.thumbnailSrc,
    imageAlt: def.imageAlt,
  };
}

type ReplacementCatalogEntry = Omit<
  WorkoutSessionExerciseDef,
  "id" | "completed" | "status"
>;

export const replacementCatalog: Record<string, ReplacementCatalogEntry> = {
  "replace-1": {
    title: "Разведение в наклоне",
    listSubtitle: "3 x 10-12 повторений",
    muscleGroup: "Плечи",
    muscles: "Плечи",
    sets: 3,
    repsRange: "10-12",
    restBetweenSets: "2 мин",
    thumbnailSrc: exerciseImages.thumbnails.lateralRaise2,
    imageAlt: "Разведение в наклоне",
  },
  "replace-2": {
    title: "Тяга блока сидя",
    listSubtitle: "3 x 10-12 повторений",
    muscleGroup: "Спина",
    muscles: "Спина",
    sets: 3,
    repsRange: "10-12",
    restBetweenSets: "2 мин",
    thumbnailSrc: exerciseImages.thumbnails.cableRow,
    imageAlt: "Тяга блока сидя",
  },
  "replace-3": {
    title: "Жим гантелей сидя",
    listSubtitle: "3 x 10-12 повторений",
    muscleGroup: "Плечи",
    muscles: "Плечи",
    sets: 3,
    repsRange: "10-12",
    restBetweenSets: "2 мин",
    thumbnailSrc: exerciseImages.thumbnails.shoulderPress2,
    imageAlt: "Жим гантелей сидя",
  },
};

function catalogToSuggestion(entry: ReplacementCatalogEntry, id: string) {
  return {
    id,
    title: entry.title,
    subtitle: entry.listSubtitle,
    muscleGroup: entry.muscleGroup,
    thumbnailSrc: entry.thumbnailSrc,
    imageAlt: entry.imageAlt,
  };
}

/** Рекомендуемые замены по id текущего упражнения */
const replaceSuggestionsByExerciseId: Record<string, ReplaceSuggestionItem[]> = {
  "ex-3": [
    catalogToSuggestion(replacementCatalog["replace-1"], "replace-1"),
    catalogToSuggestion(replacementCatalog["replace-2"], "replace-2"),
    catalogToSuggestion(replacementCatalog["replace-3"], "replace-3"),
  ],
};

export function getReplaceSuggestions(
  exerciseId: string,
): ReplaceSuggestionItem[] {
  const curated = replaceSuggestionsByExerciseId[exerciseId];
  if (curated?.length) return curated;

  return workoutSessionExercises
    .filter((item) => item.id !== exerciseId && item.id !== "ex-1")
    .slice(0, 3)
    .map(toSuggestion);
}
