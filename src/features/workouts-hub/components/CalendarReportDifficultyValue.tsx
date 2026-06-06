import type { ProgramDifficulty } from "@/features/program-weeks/types/programWeeks";
import { getDifficultyDisplayLabel } from "@/features/program-weeks/utils/difficulty";
import styles from "./CalendarReportDifficultyValue.module.css";

type CalendarReportDifficultyValueProps = {
  difficulty: ProgramDifficulty;
};

export function CalendarReportDifficultyValue({
  difficulty,
}: CalendarReportDifficultyValueProps) {
  return (
    <span className={`${styles.value} ${styles[`tone_${difficulty}`]}`}>
      {getDifficultyDisplayLabel(difficulty)}
    </span>
  );
}
