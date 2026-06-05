import { PageTitle } from "@/shared/ui/PageTitle/PageTitle";
import styles from "./ExerciseTitle.module.css";

type ExerciseTitleProps = {
  title: string;
  muscles: string;
  sets: number;
  repsRange: string;
};

export function ExerciseTitle({
  title,
  muscles,
  sets,
  repsRange,
}: ExerciseTitleProps) {
  const volume = `${sets} x ${repsRange} повторений`;

  return (
    <div className={styles.block}>
      <PageTitle>{title}</PageTitle>
      <p className={styles.volume}>{volume}</p>
      <p className={styles.muscles}>{muscles}</p>
    </div>
  );
}
