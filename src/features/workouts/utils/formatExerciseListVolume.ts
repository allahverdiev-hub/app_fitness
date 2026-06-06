import type { WarmupVolumeType } from "@/features/exercise-page/types/exercise";

type FormatExerciseListVolumeParams = {
  sets: number;
  repsRange: string;
  isWarmup?: boolean;
  warmupVolumeType?: WarmupVolumeType;
};

function isTimeRepsRange(repsRange: string): boolean {
  return /\d+\s*(мин|сек)/i.test(repsRange);
}

/** Подпись объёма на карточке упражнения в листинге тренировки */
export function formatExerciseListVolume({
  sets,
  repsRange,
  isWarmup = false,
  warmupVolumeType,
}: FormatExerciseListVolumeParams): string {
  if (!isWarmup) {
    return `${sets} x ${repsRange} повторений`;
  }

  const isTime =
    warmupVolumeType === "time" ||
    (warmupVolumeType !== "reps" && isTimeRepsRange(repsRange));

  if (isTime) {
    const normalized = repsRange.replace(/\.$/, "");
    return `${normalized}.`;
  }

  return `${repsRange} повторений`;
}
