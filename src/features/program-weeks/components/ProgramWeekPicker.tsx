import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./ProgramWeekPicker.module.css";

export type ProgramWeekPickerOption = {
  id: string;
  weekNumber: number;
};

type ProgramWeekPickerProps = {
  options: readonly ProgramWeekPickerOption[];
  activeWeekNumber: number;
  onChange?: (weekNumber: number) => void;
};

type IndicatorState = {
  left: number;
  width: number;
};

export function ProgramWeekPicker({
  options,
  activeWeekNumber,
  onChange,
}: ProgramWeekPickerProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const activeIndex = useMemo(
    () =>
      Math.max(
        0,
        options.findIndex((option) => option.weekNumber === activeWeekNumber),
      ),
    [options, activeWeekNumber],
  );

  const activeId = options[activeIndex]?.id;

  const [indicator, setIndicator] = useState<IndicatorState>({
    left: 0,
    width: 0,
  });

  const updateIndicator = useCallback(() => {
    const track = trackRef.current;
    const activeEl = activeId ? itemRefs.current[activeId] : null;
    if (!track || !activeEl) return;

    setIndicator({
      left: activeEl.offsetLeft,
      width: activeEl.offsetWidth,
    });
  }, [activeId]);

  useLayoutEffect(() => {
    updateIndicator();
  }, [updateIndicator, activeWeekNumber, options]);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const observer = new ResizeObserver(() => updateIndicator());
    observer.observe(track);

    for (const option of options) {
      const el = itemRefs.current[option.id];
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [options, updateIndicator]);

  return (
    <div className={styles.wrap}>
      <div
        ref={trackRef}
        className={styles.track}
        role="tablist"
        aria-label="Недели программы"
      >
        <div
          className={styles.indicator}
          style={{
            width: indicator.width,
            transform: `translateX(${indicator.left}px)`,
          }}
          aria-hidden
        />
        {options.map((option) => {
          const isActive = option.weekNumber === activeWeekNumber;

          return (
            <button
              key={option.id}
              ref={(element) => {
                itemRefs.current[option.id] = element;
              }}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Неделя ${option.weekNumber}`}
              className={`${styles.item} ${isActive ? styles.itemActive : ""}`}
              onClick={() => onChange?.(option.weekNumber)}
            >
              {isActive ? `Неделя ${option.weekNumber}` : option.weekNumber}
            </button>
          );
        })}
      </div>
    </div>
  );
}
