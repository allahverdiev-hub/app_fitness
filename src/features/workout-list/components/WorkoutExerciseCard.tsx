import { IconCheck, IconMore } from "@/shared/icons";
import type { WorkoutListExerciseItem } from "@/features/workout-list/types/workoutOverview";
import styles from "./WorkoutExerciseCard.module.css";

type WorkoutExerciseCardProps = {
  exercise: WorkoutListExerciseItem;
  onPress?: () => void;
  onMenu?: () => void;
};

function subtitleHasDigits(text: string): boolean {
  return /\d/.test(text);
}

export function WorkoutExerciseCard({
  exercise,
  onPress,
  onMenu,
}: WorkoutExerciseCardProps) {
  const volumeSubtitle = subtitleHasDigits(exercise.subtitle);

  return (
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
            <h2 className={styles.title}>{exercise.title}</h2>
            <p
              className={
                volumeSubtitle
                  ? `${styles.subtitle} ${styles.subtitleVolume}`
                  : styles.subtitle
              }
            >
              {exercise.subtitle}
            </p>
            {exercise.muscleGroup ? (
              <p className={styles.muscle}>{exercise.muscleGroup}</p>
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
  );
}
