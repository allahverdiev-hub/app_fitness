import type { ExerciseDescription as ExerciseDescriptionData } from "@/features/exercise-page/types/exercise";
import { IconCheck, IconExclamation } from "@/shared/icons";
import styles from "./ExerciseDescription.module.css";

type ExerciseDescriptionProps = {
  description: ExerciseDescriptionData;
};

export function ExerciseDescription({ description }: ExerciseDescriptionProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.block}>
        <h2 className={styles.heading}>
          <IconCheck size={18} className={styles.headingIcon} />
          <span>Как выполнять</span>
        </h2>
        <ol className={styles.list}>
          {description.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>
      <div className={styles.block}>
        <h2 className={styles.heading}>
          <IconExclamation size={18} className={styles.headingIcon} />
          <span>Как нельзя делать</span>
        </h2>
        <ul className={`${styles.list} ${styles.listMistakes}`}>
          {description.mistakes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
