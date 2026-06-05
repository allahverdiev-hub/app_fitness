export type ProgramDifficulty = "light" | "medium" | "heavy";

export type WorkoutSessionStatus = "not_started" | "in_progress" | "completed";

export type ProgramWorkoutSession = {
  id: string;
  dayLabel: string;
  title?: string;
};

export type ProgramWeek = {
  id: string;
  weekNumber: number;
  title: string;
  difficulty: ProgramDifficulty;
  description: string;
  workouts: ProgramWorkoutSession[];
};

export type ProgramOverview = {
  id: string;
  title: string;
  weeks: ProgramWeek[];
};

export type ProgramWeekPickerItem = {
  id: string;
  weekNumber: number;
};
