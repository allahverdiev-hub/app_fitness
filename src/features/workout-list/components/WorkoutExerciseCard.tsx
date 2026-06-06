import { IconCheck, IconMore } from "@/shared/icons";
import type { WorkoutListExerciseItem } from "@/features/workout-list/types/workoutOverview";
import { WorkoutExerciseMuscleLabel } from "@/features/workout-list/components/WorkoutExerciseMuscleLabel";
import { WorkoutExerciseReplacedLabel } from "@/features/workout-list/components/WorkoutExerciseReplacedLabel";
import { WorkoutExerciseTitle } from "@/features/workout-list/components/WorkoutExerciseTitle";
import { WorkoutExerciseVolumeLabel } from "@/features/workout-list/components/WorkoutExerciseVolumeLabel";
import styles from "./WorkoutExerciseCard.module.css";

type WorkoutExerciseCardProps = {
  exercise: WorkoutListExerciseItem;
  revealingReplace?: boolean;
  onPress?: () => void;
  onMenu?: () => void;
};

export function WorkoutExerciseCard({
  exercise,
  revealingReplace = false,
  onPress,
  onMenu,
}: WorkoutExerciseCardProps) {
  return (
    <div className={styles.item}>
      <article
        className={
          exercise.completed
            ? `${styles.card} ${styles.cardCompleted}`
            : `${styles.card} ${styles.cardPending}`
        }
      >
        <button
          type="button"
          className={styles.mainBtn}
          onClick={onPress}
          aria-label={
            exercise.muscleGroup
              ? `${exercise.title}, ${exercise.subtitle}, ${exercise.muscleGroup}`
              : `${exercise.title}, ${exercise.subtitle}`
          }
        >
          <div className={styles.thumbWrap}>
            <img
              className={styles.thumb}
              src={exercise.thumbnailSrc}
              alt=""
              width={72}
              height={72}
              draggable={false}
            />
            {exercise.completed ? (
              <span className={styles.doneBadge} aria-hidden>
                <IconCheck size={18} className={styles.doneIcon} />
              </span>
            ) : null}
          </div>
          <div className={styles.body}>
            <WorkoutExerciseTitle
              className={exercise.completed ? styles.titleCompleted : undefined}
            >
              {exercise.title}
            </WorkoutExerciseTitle>
            <WorkoutExerciseVolumeLabel completed={exercise.completed}>
              {exercise.subtitle}
            </WorkoutExerciseVolumeLabel>
            {exercise.muscleGroup ? (
              <WorkoutExerciseMuscleLabel className={styles.muscleLabel}>
                {exercise.muscleGroup}
              </WorkoutExerciseMuscleLabel>
            ) : null}
          </div>
        </button>
        <button
          type="button"
          className={styles.menuBtn}
          aria-label={`Меню: ${exercise.title}`}
          onClick={(e) => {
            e.stopPropagation();
            onMenu?.();
          }}
        >
          <IconMore size={20} />
        </button>
      </article>
      {exercise.replacedFromTitle ? (
        <WorkoutExerciseReplacedLabel
          previousTitle={exercise.replacedFromTitle}
          completed={exercise.completed}
          entering={revealingReplace}
        />
      ) : null}
    </div>
  );
}
