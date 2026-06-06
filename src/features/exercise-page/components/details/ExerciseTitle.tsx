import { PageTitle } from "@/shared/ui/PageTitle/PageTitle";
import type { WarmupVolumeType } from "@/features/exercise-page/types/exercise";
import { formatExercisePageVolume } from "@/features/exercise-page/utils/formatExercisePageVolume";
import { WorkoutExerciseReplacedLabel } from "@/shared/ui/exercise-list";
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
      <PageTitle>{title}</PageTitle>
      {replacedFromTitle ? (
        <div className={styles.replacedWrap}>
          <WorkoutExerciseReplacedLabel
            previousTitle={replacedFromTitle}
            completed={completed}
            entering={revealingReplace}
          />
        </div>
      ) : null}
      <p className={styles.volume}>{volume}</p>
      {!isWarmup ? <p className={styles.muscles}>{muscles}</p> : null}
    </div>
  );
}
