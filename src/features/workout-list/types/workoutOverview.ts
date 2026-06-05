export type WorkoutListExerciseItem = {
  id: string;
  title: string;
  subtitle: string;
  /** Только WARMUP_SECTION_TITLE («Разминочные»); иначе — рабочая группа */
  section?: string;
  muscleGroup?: string;
  thumbnailSrc: string;
  imageAlt: string;
  completed: boolean;
  replacedFromTitle?: string;
};

export type WorkoutOverview = {
  intensityLabel: string;
  durationLabel: string;
  title: string;
  hint: string;
  completedExerciseCount: number;
  exercises: WorkoutListExerciseItem[];
};
