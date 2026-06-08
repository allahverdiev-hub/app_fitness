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

type ThumbnailKey = keyof typeof exerciseImages.thumbnails;

function catalogEntry(
  title: string,
  muscleGroup: string,
  thumbnail: ThumbnailKey,
  listSubtitle = "3 x 10-12 повторений",
): ReplacementCatalogEntry {
  return {
    title,
    listSubtitle,
    muscleGroup,
    muscles: muscleGroup,
    sets: 3,
    repsRange: "10-12",
    restBetweenSets: "2 мин",
    thumbnailSrc: exerciseImages.thumbnails[thumbnail],
    imageAlt: title,
  };
}

export const replacementCatalog: Record<string, ReplacementCatalogEntry> = {
  "replace-1": catalogEntry(
    "Разведение в наклоне",
    "Плечи",
    "lateralRaise2",
  ),
  "replace-2": catalogEntry("Тяга блока сидя", "Спина", "cableRow"),
  "replace-3": catalogEntry(
    "Жим гантелей сидя",
    "Плечи",
    "shoulderPress2",
  ),
  "replace-4": catalogEntry(
    "Жим штанги лёжа",
    "Грудь",
    "shoulderPress",
  ),
  "replace-5": catalogEntry(
    "Жим гантелей на наклонной",
    "Грудь",
    "lateralRaise",
  ),
  "replace-6": catalogEntry(
    "Отжимания на брусьях",
    "Грудь",
    "barbellRow",
  ),
  "replace-7": catalogEntry(
    "Разводка гантелей лёжа",
    "Грудь",
    "lateralRaise2",
  ),
  "replace-8": catalogEntry(
    "Сведение в кроссовере",
    "Грудь",
    "cableRow2",
  ),
  "replace-9": catalogEntry(
    "Приседания со штангой",
    "Ноги",
    "barbellRow2",
  ),
  "replace-10": catalogEntry("Жим ногами", "Ноги", "cableRow"),
  "replace-11": catalogEntry(
    "Выпады с гантелями",
    "Ноги",
    "shoulderPress2",
  ),
  "replace-12": catalogEntry(
    "Румынская тяга",
    "Ноги",
    "barbellRow",
  ),
  "replace-13": catalogEntry(
    "Разгибание ног",
    "Ноги",
    "lateralRaise",
  ),
  "replace-14": catalogEntry(
    "Подтягивания широким хватом",
    "Спина",
    "barbellRow2",
  ),
  "replace-15": catalogEntry("Тяга Т-штанги", "Спина", "cableRow2"),
  "replace-16": catalogEntry(
    "Гиперэкстензия",
    "Спина",
    "shoulderPress",
  ),
  "replace-17": catalogEntry(
    "Махи гантелями в стороны",
    "Плечи",
    "lateralRaise",
  ),
  "replace-18": catalogEntry("Жим Арнольда", "Плечи", "shoulderPress2"),
  "replace-19": catalogEntry(
    "Подъём гантелей перед собой",
    "Плечи",
    "lateralRaise2",
  ),
  "replace-20": catalogEntry(
    "Сгибание рук со штангой",
    "Руки",
    "barbellRow",
  ),
  "replace-21": catalogEntry("Французский жим", "Руки", "cableRow"),
  "replace-22": catalogEntry(
    "Молотковые сгибания",
    "Руки",
    "shoulderPress",
  ),
  "replace-23": catalogEntry(
    "Разгибание на блоке",
    "Руки",
    "cableRow2",
  ),
  "replace-24": catalogEntry("Скручивания", "Пресс", "lateralRaise"),
  "replace-25": catalogEntry("Планка", "Пресс", "barbellRow2", "3 x 45 сек"),
  "replace-26": catalogEntry(
    "Подъём ног в висе",
    "Пресс",
    "shoulderPress2",
  ),
  "replace-27": catalogEntry(
    "Ягодичный мостик",
    "Ягодицы",
    "cableRow",
  ),
  "replace-28": catalogEntry(
    "Отведение ног в кроссовере",
    "Ягодицы",
    "lateralRaise2",
  ),
  "replace-29": catalogEntry(
    "Подъём на носки стоя",
    "Икры",
    "barbellRow2",
  ),
  "replace-30": catalogEntry(
    "Подъём на носки сидя",
    "Икры",
    "shoulderPress",
  ),
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

function isReplaceableExercise(def: WorkoutSessionExerciseDef): boolean {
  return !def.isWarmup && def.id !== "ex-1";
}

/** Полный каталог упражнений для экрана «Все упражнения» */
export function getAllReplaceExercises(
  excludeExerciseId: string,
): ReplaceSuggestionItem[] {
  const byId = new Map<string, ReplaceSuggestionItem>();

  for (const def of workoutSessionExercises) {
    if (!isReplaceableExercise(def) || def.id === excludeExerciseId) continue;
    byId.set(def.id, toSuggestion(def));
  }

  for (const [id, entry] of Object.entries(replacementCatalog)) {
    if (id === excludeExerciseId) continue;
    byId.set(id, catalogToSuggestion(entry, id));
  }

  return [...byId.values()].sort((a, b) =>
    a.title.localeCompare(b.title, "ru"),
  );
}

export type ReplaceExerciseGroup = {
  muscleGroup: string;
  items: ReplaceSuggestionItem[];
};

export function groupReplaceExercisesByMuscle(
  items: ReplaceSuggestionItem[],
): ReplaceExerciseGroup[] {
  const map = new Map<string, ReplaceSuggestionItem[]>();

  for (const item of items) {
    const muscleGroup = item.muscleGroup ?? "Другое";
    if (!map.has(muscleGroup)) map.set(muscleGroup, []);
    map.get(muscleGroup)!.push(item);
  }

  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b, "ru"))
    .map(([muscleGroup, groupItems]) => ({
      muscleGroup,
      items: groupItems.sort((a, b) =>
        a.title.localeCompare(b.title, "ru"),
      ),
    }));
}

export function getReplaceMuscleCategories(
  items: ReplaceSuggestionItem[],
): string[] {
  return groupReplaceExercisesByMuscle(items).map(
    (group) => group.muscleGroup,
  );
}
