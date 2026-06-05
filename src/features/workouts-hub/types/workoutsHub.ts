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

/** ISO YYYY-MM-DD */
export type WorkoutCalendarSession = {
  id: string;
  date: string;
  programId: string;
  programTitle: string;
  /** HH:mm */
  endedAt: string;
  durationMinutes: number;
};
