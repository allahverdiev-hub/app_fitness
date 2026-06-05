export type WorkoutListExerciseItem = {
  id: string;
  title: string;
  subtitle: string;
  /** Группа в листинге, например «Разминочные» */
  section?: string;
  muscleGroup?: string;
  thumbnailSrc: string;
  imageAlt: string;
  completed: boolean;
};

export type WorkoutOverview = {
  intensityLabel: string;
  durationLabel: string;
  title: string;
  hint: string;
  completedExerciseCount: number;
  exercises: WorkoutListExerciseItem[];
};
