export type ExerciseStatus = "completed" | "active" | "upcoming";

export interface ExerciseDescription {
  steps: string[];
  mistakes: string[];
}

export type WarmupVolumeType = "time" | "reps";

export interface ExerciseItem {
  id: string;
  title: string;
  sets: number;
  repsRange: string;
  muscles: string;
  restBetweenSets: string;
  thumbnailSrc: string;
  heroSrc: string;
  imageAlt: string;
  description: ExerciseDescription;
  /** Ссылка на видео техники (Kinescope) */
  techniqueVideoUrl?: string;
  status: ExerciseStatus;
  /** Заполняется при отображении прогресса подходов */
  completedSets?: number;
  /** Разминочное упражнение — объём без подходов */
  isWarmup?: boolean;
  warmupVolumeType?: WarmupVolumeType;
  /** Название до замены */
  replacedFromTitle?: string;
}

export interface WorkoutSession {
  elapsed: string;
  exercises: ExerciseItem[];
  activeExerciseId: string;
}
