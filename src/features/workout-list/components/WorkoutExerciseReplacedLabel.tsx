import { IconReplace } from "@/shared/icons";
import styles from "./WorkoutExerciseReplacedLabel.module.css";

type WorkoutExerciseReplacedLabelProps = {
  previousTitle: string;
  completed?: boolean;
  entering?: boolean;
};

export function WorkoutExerciseReplacedLabel({
  previousTitle,
  completed = false,
  entering = false,
}: WorkoutExerciseReplacedLabelProps) {
  return (
    <p
      className={`${styles.plate} ${completed ? styles.plateCompleted : styles.platePending} ${entering ? styles.entering : ""}`}
    >
      <IconReplace size={14} className={styles.icon} aria-hidden />
      <span className={styles.text}>
        Заменено: {previousTitle}
      </span>
    </p>
  );
}
