import type { CSSProperties } from "react";
import { IconSignalBars } from "@/shared/icons";
import { getDifficultyStyle } from "@/features/program-weeks/utils/difficulty";
import type { ProgramDifficulty } from "@/features/program-weeks/types/programWeeks";
import styles from "./DifficultyBadge.module.css";

type DifficultyBadgeProps = {
  difficulty: ProgramDifficulty;
};

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const { label, color, activeBars } = getDifficultyStyle(difficulty);

  return (
    <span
      className={styles.badge}
      style={
        {
          "--program-week-difficulty-tone": color,
        } as CSSProperties
      }
    >
      <span className={styles.label}>{label}</span>
      <span className={styles.iconWrap}>
        <IconSignalBars
          size={16}
          activeCount={activeBars}
          activeColor="var(--program-week-difficulty-tone)"
          inactiveColor="var(--program-week-difficulty-icon-inactive-color)"
          className={styles.icon}
        />
      </span>
    </span>
  );
}
