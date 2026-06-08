import { PageTitle } from "@/shared/ui/PageTitle/PageTitle";
import type { WarmupVolumeType } from "@/features/exercise-page/types/exercise";
import { formatExercisePageVolume } from "@/features/exercise-page/utils/formatExercisePageVolume";
import {
  WorkoutExerciseMuscleLabel,
  WorkoutExerciseReplacedLabel,
} from "@/shared/ui/exercise-list";
import styles from "./ExerciseTitle.module.css";

type ExerciseTitleProps = {
  title: string;
  muscles: string;
  sets: number;
  repsRange: string;
  isWarmup?: boolean;
  warmupVolumeType?: WarmupVolumeType;
  replacedFromTitle?: string;
  completed?: boolean;
  revealingReplace?: boolean;
};

export function ExerciseTitle({
  title,
  muscles,
  sets,
  repsRange,
  isWarmup,
  warmupVolumeType,
  replacedFromTitle,
  completed = false,
  revealingReplace = false,
}: ExerciseTitleProps) {
  const volume = formatExercisePageVolume({
    sets,
    repsRange,
    isWarmup,
    warmupVolumeType,
  });

  return (
    <div className={styles.block}>
      {!isWarmup && muscles ? (
        <WorkoutExerciseMuscleLabel className={styles.muscleTag}>
          {muscles}
        </WorkoutExerciseMuscleLabel>
      ) : null}
      <PageTitle className={styles.exerciseTitle}>{title}</PageTitle>
      <p className={styles.volume}>{volume}</p>
      {replacedFromTitle ? (
        <div className={styles.replacedWrap}>
          <WorkoutExerciseReplacedLabel
            previousTitle={replacedFromTitle}
            completed={completed}
            entering={revealingReplace}
          />
        </div>
      ) : null}
    </div>
  );
}
