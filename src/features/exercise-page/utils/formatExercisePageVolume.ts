export type WarmupVolumeType = "time" | "reps";

type FormatExercisePageVolumeParams = {
  sets: number;
  repsRange: string;
  isWarmup?: boolean;
  warmupVolumeType?: WarmupVolumeType;
};

function isTimeRepsRange(repsRange: string): boolean {
  return /\d+\s*(мин|сек)/i.test(repsRange);
}

/** Подпись объёма под названием на странице упражнения */
export function formatExercisePageVolume({
  sets,
  repsRange,
  isWarmup = false,
  warmupVolumeType,
}: FormatExercisePageVolumeParams): string {
  if (!isWarmup) {
    return `${sets} x ${repsRange} повторений`;
  }

  const isTime =
    warmupVolumeType === "time" ||
    (warmupVolumeType !== "reps" && isTimeRepsRange(repsRange));

  if (isTime) {
    return repsRange;
  }

  return `${repsRange} повторений`;
}
