export type HubStreakDayStatus = "done" | "upcoming" | "empty";

export type HubStreakDay = {
  status: HubStreakDayStatus;
  label?: string;
};

export type HubStreak = {
  daysInRow: number;
  days: HubStreakDay[];
};

export type HubProgramCard = {
  id: string;
  programId: string;
  subtitle: string;
};

export type HubProgramsTab = "mine" | "catalog";

import type { ProgramDifficulty } from "@/features/program-weeks/types/programWeeks";

/** ISO YYYY-MM-DD */
export type WorkoutCalendarSession = {
  id: string;
  date: string;
  programId: string;
  programTitle: string;
  workoutTitle: string;
  /** Сложность недели программы, с которой пришёл отчёт */
  weekDifficulty: ProgramDifficulty;
  /** HH:mm */
  endedAt: string;
  durationMinutes: number;
};
