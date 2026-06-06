import type { WorkoutCalendarSession } from "@/features/workouts-hub/types/workoutsHub";

/** Сколько отчётов показываем в ячейке календаря; остальные — «+N» */
export const CALENDAR_VISIBLE_REPORTS_MAX = 3;

export type CalendarSessionDisplay = {
  visible: WorkoutCalendarSession[];
  overflowCount: number;
};

export function getCalendarSessionDisplay(
  sessions: readonly WorkoutCalendarSession[],
): CalendarSessionDisplay {
  const overflowCount = Math.max(
    0,
    sessions.length - CALENDAR_VISIBLE_REPORTS_MAX,
  );

  return {
    visible: sessions.slice(0, CALENDAR_VISIBLE_REPORTS_MAX),
    overflowCount,
  };
}
