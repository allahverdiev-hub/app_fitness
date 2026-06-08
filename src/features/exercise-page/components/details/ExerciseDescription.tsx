import type { ExerciseDescription as ExerciseDescriptionData } from "@/features/exercise-page/types/exercise";
import { IconCheck, IconExclamation } from "@/shared/icons";
import styles from "./ExerciseDescription.module.css";

type ExerciseDescriptionProps = {
  description: ExerciseDescriptionData;
  className?: string;
  /** Вариант для bottom sheet: без рамки, выравнивание по шапке */
  embedded?: boolean;
};

export function ExerciseDescription({
  description,
  className = "",
  embedded = false,
}: ExerciseDescriptionProps) {
  const panelClass = [
    styles.panel,
    embedded ? styles.panelEmbedded : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  const blockClass = [styles.block, embedded ? styles.blockEmbedded : ""]
    .filter(Boolean)
    .join(" ");
  const listClass = [styles.list, embedded ? styles.listEmbedded : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={panelClass}>
      <div className={blockClass}>
        <h2 className={styles.heading}>
          <IconCheck size={18} className={styles.headingIcon} />
          <span>Как выполнять</span>
        </h2>
        <ol className={listClass}>
          {description.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>
      <div className={blockClass}>
        <h2 className={styles.heading}>
          <IconExclamation size={18} className={styles.headingIcon} />
          <span>Как нельзя делать</span>
        </h2>
        <ul className={`${listClass} ${styles.listMistakes}`}>
          {description.mistakes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
