import { exerciseImages } from "@/features/exercise-page/config/media";
import { defaultTechniqueVideoUrl } from "@/features/exercise-page/config/techniqueVideo";
import { exerciseDescriptionsById } from "@/features/exercise-page/mocks/descriptions";
import type {
  ExerciseDescription,
  ExerciseItem,
  WarmupVolumeType,
  WorkoutSession,
} from "@/features/exercise-page/types/exercise";
import type {
  WorkoutListExerciseItem,
  WorkoutOverview,
} from "@/features/workout-list/types/workoutOverview";
export type WorkoutSessionExerciseDef = {
  id: string;
  title: string;
  listSubtitle: string;
  muscleGroup?: string;
  muscles: string;
  sets: number;
  repsRange: string;
  restBetweenSets: string;
  thumbnailSrc: string;
  imageAlt: string;
  completed: boolean;
  status?: ExerciseItem["status"];
  description?: ExerciseDescription;
  /** Название до замены — для подписи в листинге */
  replacedFromTitle?: string;
  isWarmup?: boolean;
  warmupVolumeType?: WarmupVolumeType;
};

/** Единый порядок и содержание: листинг тренировки ↔ карусель на странице упражнения */
export const workoutSessionExercises: WorkoutSessionExerciseDef[] = [
  {
    id: "ex-1",
    title: "Ходьба на беговой дорожке",
    listSubtitle: "5 мин.",
    muscles: "Разминка",
    sets: 1,
    repsRange: "5 мин",
    restBetweenSets: "—",
    thumbnailSrc: exerciseImages.thumbnails.shoulderPress,
    imageAlt: "Ходьба на беговой дорожке",
    completed: true,
    status: "completed",
    isWarmup: true,
    warmupVolumeType: "time",
  },
  {
    id: "ex-2",
    title: "Тяга штанги к поясу",
    listSubtitle: "3 x 10-12 повторений",
    muscleGroup: "Спина",
    muscles: "Спина",
    sets: 3,
    repsRange: "10-12",
    restBetweenSets: "2 мин",
    thumbnailSrc: exerciseImages.thumbnails.barbellRow,
    imageAlt: "Тяга штанги к поясу",
    completed: true,
    status: "completed",
  },
  {
    id: "ex-3",
    title: "Разведение рук с гантелями",
    listSubtitle: "3 x 10-12 повторений",
    muscleGroup: "Спина",
    muscles: "Плечи, спина",
    sets: 3,
    repsRange: "10-12",
    restBetweenSets: "2 мин",
    thumbnailSrc: exerciseImages.thumbnails.lateralRaise,
    imageAlt: "Разведение рук с гантелями",
    completed: false,
    status: "active",
  },
  {
    id: "ex-4",
    title: "Разведение лопаток",
    listSubtitle: "3 x 10-12 повторений",
    muscleGroup: "Спина",
    muscles: "Спина",
    sets: 3,
    repsRange: "10-12",
    restBetweenSets: "90 сек",
    thumbnailSrc: exerciseImages.thumbnails.cableRow,
    imageAlt: "Разведение лопаток",
    completed: false,
    status: "upcoming",
  },
  {
    id: "ex-5",
    title: "Тяга верхнего блока",
    listSubtitle: "3 x 10-12 повторений",
    muscleGroup: "Спина",
    muscles: "Спина",
    sets: 3,
    repsRange: "10-12",
    restBetweenSets: "2 мин",
    thumbnailSrc: exerciseImages.thumbnails.barbellRow2,
    imageAlt: "Тяга верхнего блока",
    completed: false,
    status: "upcoming",
  },
  {
    id: "ex-6",
    title: "Жим гантелей сидя",
    listSubtitle: "3 x 10-12 повторений",
    muscleGroup: "Плечи",
    muscles: "Плечи",
    sets: 3,
    repsRange: "10-12",
    restBetweenSets: "2 мин",
    thumbnailSrc: exerciseImages.thumbnails.shoulderPress2,
    imageAlt: "Жим гантелей сидя",
    completed: false,
    status: "upcoming",
  },
  {
    id: "ex-7",
    title: "Обратная разводка в блоке",
    listSubtitle: "3 x 12-15 повторений",
    muscleGroup: "Плечи",
    muscles: "Плечи, спина",
    sets: 3,
    repsRange: "12-15",
    restBetweenSets: "90 сек",
    thumbnailSrc: exerciseImages.thumbnails.cableRow2,
    imageAlt: "Обратная разводка в блоке",
    completed: false,
    status: "upcoming",
  },
  {
    id: "ex-8",
    title: "Тяга гантели в наклоне",
    listSubtitle: "3 x 10-12 повторений",
    muscleGroup: "Спина",
    muscles: "Спина",
    sets: 3,
    repsRange: "10-12",
    restBetweenSets: "2 мин",
    thumbnailSrc: exerciseImages.thumbnails.lateralRaise2,
    imageAlt: "Тяга гантели в наклоне",
    completed: false,
    status: "upcoming",
  },
];

export function toExerciseItem(def: WorkoutSessionExerciseDef): ExerciseItem {
  return {
    id: def.id,
    title: def.title,
    sets: def.sets,
    repsRange: def.repsRange,
    muscles: def.muscles,
    restBetweenSets: def.restBetweenSets,
    thumbnailSrc: def.thumbnailSrc,
    heroSrc: exerciseImages.hero,
    imageAlt: def.imageAlt,
    description:
      def.description ?? exerciseDescriptionsById[def.id] ?? exerciseDescriptionsById["ex-3"],
    techniqueVideoUrl: defaultTechniqueVideoUrl,
    status: def.status ?? (def.completed ? "completed" : "upcoming"),
    isWarmup: def.isWarmup,
    warmupVolumeType: def.warmupVolumeType,
    replacedFromTitle: def.replacedFromTitle,
  };
}

export function toListExerciseItem(
  def: WorkoutSessionExerciseDef,
): WorkoutListExerciseItem {
  return {
    id: def.id,
    title: def.title,
    subtitle: def.listSubtitle,
    muscleGroup: def.muscleGroup,
    thumbnailSrc: def.thumbnailSrc,
    imageAlt: def.imageAlt,
    completed: def.completed,
    replacedFromTitle: def.replacedFromTitle,
  };
}

export function toExerciseItems(
  defs: WorkoutSessionExerciseDef[],
): ExerciseItem[] {
  return defs.map(toExerciseItem);
}

export function toListExerciseItems(
  defs: WorkoutSessionExerciseDef[],
) {
  return defs.map(toListExerciseItem);
}

export function buildWorkoutExerciseSetsById(
  defs: WorkoutSessionExerciseDef[],
): Record<string, number> {
  return Object.fromEntries(defs.map((def) => [def.id, def.sets]));
}

export function cloneWorkoutSessionExercises(): WorkoutSessionExerciseDef[] {
  return workoutSessionExercises.map((def) => ({ ...def }));
}

function buildMockWorkoutSession(): WorkoutSession {
  const exercises = workoutSessionExercises.map(toExerciseItem);
  const active =
    exercises.find((e) => e.status === "active") ??
    exercises.find((e) => e.status === "upcoming") ??
    exercises[0];

  return {
    elapsed: "0:00:00",
    exercises,
    activeExerciseId: active?.id ?? "ex-3",
  };
}

function buildWorkoutOverview(): WorkoutOverview {
  const exercises = workoutSessionExercises.map((def) => ({
    id: def.id,
    title: def.title,
    subtitle: def.listSubtitle,
    muscleGroup: def.muscleGroup,
    thumbnailSrc: def.thumbnailSrc,
    imageAlt: def.imageAlt,
    completed: def.completed,
  }));

  return {
    intensityLabel: "Легкая",
    durationLabel: "45 мин",
    title: "Спина + плечи",
    hint: "В каждом упражнении учитывайте по 1-2 подхода в запас",
    completedExerciseCount: exercises.filter((e) => e.completed).length,
    exercises,
  };
}

export const mockWorkout = buildMockWorkoutSession();
export const mockWorkoutOverview = buildWorkoutOverview();
