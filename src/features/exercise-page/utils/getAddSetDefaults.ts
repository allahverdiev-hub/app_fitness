import type { LoadFilter } from "@/features/exercise-page/mocks/progress-chart";
import { getLastDiarySetEntry } from "@/features/exercise-page/mocks/diary";
import type { AddSetSheetDefaults, LoggedSet } from "@/features/exercise-page/types/set";
import { getDefaultRepsFromRange } from "@/features/exercise-page/utils/parseRepsRange";
import { splitWeightKgToPickers } from "@/features/exercise-page/utils/weightUnits";

const FALLBACK_WEIGHT_KG = 20;

export function getAddSetDefaults(
  exerciseId: string,
  loadFilter: LoadFilter,
  repsRange: string,
  sessionSets: LoggedSet[] | undefined,
): AddSetSheetDefaults {
  const lastSession = sessionSets?.[sessionSets.length - 1];
  if (lastSession) {
    return {
      reps: lastSession.reps,
      weightKg: lastSession.weightKg,
      weightGrams: lastSession.weightGrams,
    };
  }

  const diaryLast = getLastDiarySetEntry(exerciseId, loadFilter, sessionSets ?? []);
  if (diaryLast) {
    const { weightKg, weightGrams } = splitWeightKgToPickers(diaryLast.weightKg);
    return {
      reps: diaryLast.reps,
      weightKg,
      weightGrams,
    };
  }

  return {
    reps: getDefaultRepsFromRange(repsRange),
    weightKg: FALLBACK_WEIGHT_KG,
    weightGrams: 0,
  };
}
