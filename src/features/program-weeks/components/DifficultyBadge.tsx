import type { CSSProperties } from "react";
import { IconSignalBars } from "@/shared/icons";
import { getDifficultyStyle } from "@/features/program-weeks/utils/difficulty";
import type { ProgramDifficulty } from "@/features/program-weeks/types/programWeeks";
import styles from "./DifficultyBadge.module.css";

type DifficultyBadgeProps = {
  difficulty: ProgramDifficulty;
  weekTitle?: string;
  id?: string;
};

export function DifficultyBadge({
  difficulty,
  weekTitle,
  id,
}: DifficultyBadgeProps) {
  const { label, color, activeBars } = getDifficultyStyle(difficulty);
  const hasWeekTitle = Boolean(weekTitle);
  const ariaLabel = weekTitle ? `${weekTitle}, ${label}` : label;

  return (
    <span
      id={id}
      className={`${styles.badge} ${hasWeekTitle ? styles.badgeWithWeek : ""}`}
      aria-label={ariaLabel}
      style={{ "--program-week-difficulty-tone": color } as CSSProperties}
    >
      <span className={styles.iconWrap}>
        <IconSignalBars
          size={20}
          activeCount={activeBars}
          activeColor="var(--program-week-difficulty-tone)"
          inactiveColor="var(--program-week-difficulty-icon-inactive-color)"
          className={styles.icon}
        />
      </span>
      {hasWeekTitle ? (
        <span className={styles.weekTitle}>{weekTitle}</span>
      ) : null}
    </span>
  );
}
