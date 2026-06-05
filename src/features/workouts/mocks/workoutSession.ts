import { exerciseImages } from "@/features/exercise-page/config/media";
import { defaultTechniqueVideoUrl } from "@/features/exercise-page/config/techniqueVideo";
import { exerciseDescriptionsById } from "@/features/exercise-page/mocks/descriptions";
import type {
  ExerciseItem,
  WorkoutSession,
} from "@/features/exercise-page/types/exercise";
import type { WorkoutOverview } from "@/features/workout-list/types/workoutOverview";

export type WorkoutSessionExerciseDef = {
  id: string;
  title: string;
  listSubtitle: string;
  listSection?: string;
  muscleGroup?: string;
  muscles: string;
  sets: number;
  repsRange: string;
  restBetweenSets: string;
  thumbnailSrc: string;
  imageAlt: string;
  completed: boolean;
  status?: ExerciseItem["status"];
};

/** Единый порядок и содержание: листинг тренировки ↔ карусель на странице упражнения */
export const workoutSessionExercises: WorkoutSessionExerciseDef[] = [
  {
    id: "ex-1",
    title: "Ходьба на беговой дорожке",
    listSubtitle: "5 мин.",
    listSection: "Разминочные",
    muscles: "Разминка",
    sets: 1,
    repsRange: "5 мин",
    restBetweenSets: "—",
    thumbnailSrc: exerciseImages.thumbnails.shoulderPress,
    imageAlt: "Ходьба на беговой дорожке",
    completed: true,
    status: "completed",
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

function toExerciseItem(def: WorkoutSessionExerciseDef): ExerciseItem {
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
    description: exerciseDescriptionsById[def.id],
    techniqueVideoUrl: defaultTechniqueVideoUrl,
    status: def.status ?? (def.completed ? "completed" : "upcoming"),
  };
}

export function buildMockWorkoutSession(): WorkoutSession {
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

export function buildWorkoutOverview(): WorkoutOverview {
  const exercises = workoutSessionExercises.map((def) => ({
    id: def.id,
    title: def.title,
    subtitle: def.listSubtitle,
    section: def.listSection,
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

/** Число подходов по id — для синхронизации листинга со страницей упражнения */
export const workoutExerciseSetsById: Record<string, number> =
  Object.fromEntries(
    workoutSessionExercises.map((def) => [def.id, def.sets]),
  );

export const mockWorkout = buildMockWorkoutSession();
export const mockWorkoutOverview = buildWorkoutOverview();
