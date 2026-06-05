import type { CSSProperties, MouseEvent } from "react";
import { useMemo } from "react";
import { useWeekTabIndicator } from "@/features/program-weeks/hooks/useWeekTabIndicator";
import { SegmentedTabPicker, segmentedTabPickerStyles } from "@/shared/ui/SegmentedTabPicker";
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

const ACTIVE_TAB_WIDTH_RATIO = 1.55;

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

  const { trackRef, setTabRef, indicatorStyle } = useWeekTabIndicator({
    activeIndex,
    tabCount: options.length,
  });

  const trackStyle = useMemo(
    () =>
      ({
        gridTemplateColumns: options
          .map((_, index) =>
            index === activeIndex
              ? `minmax(0, ${ACTIVE_TAB_WIDTH_RATIO}fr)`
              : "minmax(0, 1fr)",
          )
          .join(" "),
      }) as CSSProperties,
    [activeIndex, options],
  );

  const handleAnchorClick = (
    event: MouseEvent<HTMLAnchorElement>,
    option: ProgramWeekPickerOption,
  ) => {
    event.preventDefault();
    onAnchorNavigate?.(option);
  };

  return (
    <SegmentedTabPicker
      className={styles.weekPicker}
      trackClassName={styles.weekTrack}
      trackStyle={trackStyle}
      trackRef={trackRef}
      indicatorClassName={styles.weekIndicator}
      indicatorStyle={indicatorStyle}
      tabCount={options.length}
      activeIndex={activeIndex}
      ariaLabel="Недели программы"
    >
      {options.map((option, index) => {
        const isActive = option.weekNumber === activeWeekNumber;

        return (
          <a
            key={option.id}
            ref={setTabRef(index)}
            href={`#${option.anchorId}`}
            role="tab"
            aria-selected={isActive}
            aria-label={`Неделя ${option.weekNumber}`}
            className={`${segmentedTabPickerStyles.item} ${styles.weekTab} ${isActive ? `${segmentedTabPickerStyles.itemActive} ${styles.weekTabActive}` : ""}`}
            onClick={(event) => handleAnchorClick(event, option)}
          >
            <span className={styles.label} aria-hidden>
              {isActive ? `Неделя ${option.weekNumber}` : option.weekNumber}
            </span>
          </a>
        );
      })}
    </SegmentedTabPicker>
  );
}
