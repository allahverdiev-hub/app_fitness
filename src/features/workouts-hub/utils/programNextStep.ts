import type { ProgramOverview } from "@/features/program-weeks/types/programWeeks";
import type { EnrichedProgramOverview } from "@/features/program-weeks/utils/workoutProgress";
import {
  enrichProgramOverview,
  getActiveProgramWeek,
} from "@/features/program-weeks/utils/workoutProgress";

export type ProgramSessionProgress = {
  sessionExerciseIds: readonly string[];
  completedSetsById: Record<string, number>;
  setsByExerciseId: Record<string, number>;
};

export function getHubProgramActiveWeekBlock(
  programOverview: ProgramOverview,
  sessionProgress: ProgramSessionProgress,
) {
  const enriched: EnrichedProgramOverview = enrichProgramOverview(
    programOverview,
    sessionProgress.sessionExerciseIds,
    sessionProgress.completedSetsById,
    sessionProgress.setsByExerciseId,
  );

  return getActiveProgramWeek(enriched);
}
