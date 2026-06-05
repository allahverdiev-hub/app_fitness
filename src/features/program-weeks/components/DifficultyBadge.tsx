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
  const { label, color, borderColor, activeBars } = getDifficultyStyle(difficulty);
  const hasWeekTitle = Boolean(weekTitle);
  const ariaLabel = weekTitle ? `${weekTitle}, ${label}` : label;

  return (
    <span
      id={id}
      className={`${styles.badge} ${hasWeekTitle ? styles.badgeWithWeek : ""}`}
      aria-label={ariaLabel}
      style={
        {
          "--program-week-difficulty-tone": color,
          border: `1px solid ${borderColor}`,
        } as CSSProperties
      }
    >
      {hasWeekTitle ? (
        <span className={styles.weekTitle}>{weekTitle}</span>
      ) : null}
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
