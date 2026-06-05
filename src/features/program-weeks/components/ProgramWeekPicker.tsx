import type { CSSProperties, MouseEvent } from "react";
import { useMemo } from "react";
import styles from "./ProgramWeekPicker.module.css";

export type ProgramWeekPickerOption = {
  id: string;
  weekNumber: number;
  anchorId: string;
};

type ProgramWeekPickerProps = {
  options: readonly ProgramWeekPickerOption[];
  activeWeekNumber: number;
  onAnchorNavigate?: (option: ProgramWeekPickerOption) => void;
};

export function ProgramWeekPicker({
  options,
  activeWeekNumber,
  onAnchorNavigate,
}: ProgramWeekPickerProps) {
  const activeIndex = useMemo(
    () =>
      Math.max(
        0,
        options.findIndex((option) => option.weekNumber === activeWeekNumber),
      ),
    [options, activeWeekNumber],
  );

  const trackStyle = {
    "--tab-count": String(options.length),
    "--active-index": String(activeIndex),
  } as CSSProperties;

  const handleAnchorClick = (
    event: MouseEvent<HTMLAnchorElement>,
    option: ProgramWeekPickerOption,
  ) => {
    event.preventDefault();
    onAnchorNavigate?.(option);
  };

  return (
    <div className={styles.wrap}>
      <div
        className={styles.track}
        style={trackStyle}
        role="tablist"
        aria-label="Недели программы"
      >
        <div className={styles.indicator} aria-hidden />
        {options.map((option) => {
          const isActive = option.weekNumber === activeWeekNumber;

          return (
            <a
              key={option.id}
              href={`#${option.anchorId}`}
              role="tab"
              aria-selected={isActive}
              aria-label={`Неделя ${option.weekNumber}`}
              className={`${styles.item} ${isActive ? styles.itemActive : ""}`}
              onClick={(event) => handleAnchorClick(event, option)}
            >
              <span className={styles.labelWrap} aria-hidden>
                <span
                  className={`${styles.label} ${styles.labelShort} ${isActive ? styles.labelHidden : ""}`}
                >
                  {option.weekNumber}
                </span>
                <span
                  className={`${styles.label} ${styles.labelLong} ${isActive ? "" : styles.labelHidden}`}
                >
                  Неделя {option.weekNumber}
                </span>
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
