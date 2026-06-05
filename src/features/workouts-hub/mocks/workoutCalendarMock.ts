import { mockProgramOverview } from "@/features/program-weeks/mocks/programWeeksMock";
import type { WorkoutCalendarSession } from "@/features/workouts-hub/types/workoutsHub";

export const mockWorkoutCalendarSessions: WorkoutCalendarSession[] = [
  {
    id: "cal-0603",
    date: "2026-06-03",
    programId: mockProgramOverview.id,
    programTitle: mockProgramOverview.title,
    endedAt: "19:10",
    durationMinutes: 52,
  },
  {
    id: "cal-0604",
    date: "2026-06-04",
    programId: mockProgramOverview.id,
    programTitle: mockProgramOverview.title,
    endedAt: "20:05",
    durationMinutes: 61,
  },
  {
    id: "cal-0605",
    date: "2026-06-05",
    programId: mockProgramOverview.id,
    programTitle: mockProgramOverview.title,
    endedAt: "18:30",
    durationMinutes: 47,
  },
  {
    id: "cal-0528",
    date: "2026-05-28",
    programId: mockProgramOverview.id,
    programTitle: mockProgramOverview.title,
    endedAt: "21:00",
    durationMinutes: 58,
  },
  {
    id: "cal-0515",
    date: "2026-05-15",
    programId: mockProgramOverview.id,
    programTitle: mockProgramOverview.title,
    endedAt: "19:45",
    durationMinutes: 55,
  },
  {
    id: "cal-0507",
    date: "2026-05-07",
    programId: mockProgramOverview.id,
    programTitle: mockProgramOverview.title,
    endedAt: "18:20",
    durationMinutes: 44,
  },
];
