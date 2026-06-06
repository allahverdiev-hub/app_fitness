import { mockProgramOverview } from "@/features/program-weeks/mocks/programWeeksMock";
import type { WorkoutCalendarSession } from "@/features/workouts-hub/types/workoutsHub";

function session(
  partial: Omit<WorkoutCalendarSession, "programId" | "programTitle"> &
    Partial<Pick<WorkoutCalendarSession, "programId" | "programTitle">>,
): WorkoutCalendarSession {
  return {
    programId: mockProgramOverview.id,
    programTitle: mockProgramOverview.title,
    ...partial,
  };
}

export const mockWorkoutCalendarSessions: WorkoutCalendarSession[] = [
  // 3 июня — ровно 3 отчёта
  session({
    id: "cal-0603-1",
    date: "2026-06-03",
    workoutTitle: "Грудь + бицепс",
    weekDifficulty: "light",
    endedAt: "08:40",
    durationMinutes: 42,
  }),
  session({
    id: "cal-0603-2",
    date: "2026-06-03",
    workoutTitle: "Спина + плечи",
    weekDifficulty: "medium",
    endedAt: "14:20",
    durationMinutes: 51,
  }),
  session({
    id: "cal-0603-3",
    date: "2026-06-03",
    workoutTitle: "Ноги + пресс",
    weekDifficulty: "heavy",
    endedAt: "19:10",
    durationMinutes: 48,
  }),
  // 4 июня — больше трёх (5 отчётов, в UI «+2»)
  session({
    id: "cal-0604-1",
    date: "2026-06-04",
    workoutTitle: "Верх",
    weekDifficulty: "light",
    endedAt: "07:50",
    durationMinutes: 38,
  }),
  session({
    id: "cal-0604-2",
    date: "2026-06-04",
    workoutTitle: "Низ",
    weekDifficulty: "medium",
    endedAt: "11:30",
    durationMinutes: 44,
  }),
  session({
    id: "cal-0604-3",
    date: "2026-06-04",
    workoutTitle: "Грудь + руки",
    weekDifficulty: "medium",
    endedAt: "15:05",
    durationMinutes: 52,
  }),
  session({
    id: "cal-0604-4",
    date: "2026-06-04",
    workoutTitle: "Спина + плечи",
    weekDifficulty: "heavy",
    endedAt: "18:15",
    durationMinutes: 47,
  }),
  session({
    id: "cal-0604-5",
    date: "2026-06-04",
    workoutTitle: "Ноги",
    weekDifficulty: "heavy",
    endedAt: "21:00",
    durationMinutes: 55,
  }),
  // 5 июня — 2 отчёта
  session({
    id: "cal-0605-am",
    date: "2026-06-05",
    workoutTitle: "Ноги",
    weekDifficulty: "light",
    endedAt: "10:15",
    durationMinutes: 47,
  }),
  session({
    id: "cal-0605-pm",
    date: "2026-06-05",
    workoutTitle: "Спина + плечи",
    weekDifficulty: "heavy",
    endedAt: "18:30",
    durationMinutes: 38,
  }),
  session({
    id: "cal-0528",
    date: "2026-05-28",
    workoutTitle: "Грудь + руки",
    weekDifficulty: "heavy",
    endedAt: "21:00",
    durationMinutes: 58,
  }),
  session({
    id: "cal-0515",
    date: "2026-05-15",
    workoutTitle: "Ноги",
    weekDifficulty: "medium",
    endedAt: "19:45",
    durationMinutes: 55,
  }),
  session({
    id: "cal-0507",
    date: "2026-05-07",
    workoutTitle: "Спина + плечи",
    weekDifficulty: "light",
    endedAt: "18:20",
    durationMinutes: 44,
  }),
];
