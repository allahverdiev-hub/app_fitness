import type {
  HubProgramCard,
  HubStreak,
} from "@/features/workouts-hub/types/workoutsHub";
import {
  mockProgramOverview,
  mockUpperLowerSplitOverview,
} from "@/features/program-weeks/mocks/programWeeksMock";
export const mockHubStreak: HubStreak = {
  daysInRow: 3,
  days: [
    { status: "done" },
    { status: "done" },
    { status: "done" },
    { status: "upcoming", label: "1" },
    { status: "upcoming", label: "2" },
  ],
};

export const mockHubPrograms: HubProgramCard[] = [
  {
    id: "hub-fullbody",
    programId: mockProgramOverview.id,
    subtitle: "Мужчинам • Для зала • Новичкам",
  },
  {
    id: "hub-upper-lower-split",
    programId: mockUpperLowerSplitOverview.id,
    subtitle: "Мужчинам • Для зала • Опытным",
  },
];
