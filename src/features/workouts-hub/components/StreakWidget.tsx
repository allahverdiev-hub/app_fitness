import type { CSSProperties } from "react";
import { IconCheck, IconSolarFireBold } from "@/shared/icons";
import type { HubStreak } from "@/features/workouts-hub/types/workoutsHub";
import styles from "./StreakWidget.module.css";

type StreakWidgetProps = {
  streak: HubStreak;
};

function formatWorkoutsInRow(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) return "тренировка";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return "тренировки";
  }
  return "тренировок";
}

export function StreakWidget({ streak }: StreakWidgetProps) {
  return (
    <section className={styles.widget} aria-label="Серия тренировок">
      <div className={styles.headline}>
        <IconSolarFireBold size={30} className={styles.flame} />
        <span className={styles.headlineText}>
          {streak.daysInRow} {formatWorkoutsInRow(streak.daysInRow)} подряд
        </span>
      </div>
      <div
        className={styles.days}
        role="list"
        style={
          { "--streak-day-count": String(streak.days.length) } as CSSProperties
        }

      >
        {streak.days.map((day, index) => (
          <span
            key={`${day.status}-${index}`}
            role="listitem"
            className={[
              styles.day,
              day.status === "done"
                ? styles.dayDone
                : day.status === "upcoming"
                  ? styles.dayUpcoming
                  : styles.dayEmpty,
            ].join(" ")}
          >
            {day.status === "done" ? (
              <IconCheck size={16} className={styles.check} aria-hidden />
            ) : day.label ? (
              <span className={styles.dayLabel}>{day.label}</span>
            ) : null}
          </span>
        ))}
      </div>
    </section>
  );
}
