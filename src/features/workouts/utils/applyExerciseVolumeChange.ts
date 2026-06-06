import type { WarmupVolumeType } from "@/features/exercise-page/types/exercise";
import type { WorkoutSessionExerciseDef } from "@/features/workouts/mocks/workoutSession";
import { formatExerciseListVolume } from "@/features/workouts/utils/formatExerciseListVolume";

export type ExerciseVolumeUpdate = {
  sets: number;
  repsRange: string;
  warmupVolumeType?: WarmupVolumeType;
};

export function applyExerciseVolumeChange(
  def: WorkoutSessionExerciseDef,
  update: ExerciseVolumeUpdate,
): WorkoutSessionExerciseDef {
  const isWarmup = def.isWarmup ?? Boolean(def.listSection);

  return {
    ...def,
    sets: update.sets,
    repsRange: update.repsRange,
    warmupVolumeType: isWarmup ? update.warmupVolumeType : def.warmupVolumeType,
    listSubtitle: formatExerciseListVolume({
      sets: update.sets,
      repsRange: update.repsRange,
      isWarmup,
      warmupVolumeType: isWarmup ? update.warmupVolumeType : undefined,
    }),
  };
}
