export type WorkoutListExerciseItem = {
  id: string;
  title: string;
  subtitle: string;
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
