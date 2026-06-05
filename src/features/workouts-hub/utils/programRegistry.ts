import {
  mockProgramOverview,
  mockUpperLowerSplitOverview,
} from "@/features/program-weeks/mocks/programWeeksMock";
import type { ProgramOverview } from "@/features/program-weeks/types/programWeeks";

const PROGRAMS: Record<string, ProgramOverview> = {
  [mockProgramOverview.id]: mockProgramOverview,
  [mockUpperLowerSplitOverview.id]: mockUpperLowerSplitOverview,
};

export function getProgramOverviewById(
  programId: string,
): ProgramOverview | undefined {
  return PROGRAMS[programId];
}

export function getAllProgramOverviews(): ProgramOverview[] {
  return Object.values(PROGRAMS);
}
