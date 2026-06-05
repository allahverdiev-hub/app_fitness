import type { CSSProperties, ReactNode, Ref } from "react";
import styles from "./SegmentedTabPicker.module.css";

export { styles as segmentedTabPickerStyles };

type SegmentedTabPickerProps = {
  tabCount: number;
  activeIndex: number;
  ariaLabel: string;
  className?: string;
  indicatorClassName?: string;
  indicatorStyle?: CSSProperties;
  trackClassName?: string;
  trackStyle?: CSSProperties;
  trackRef?: Ref<HTMLDivElement>;
  children: ReactNode;
};

export function SegmentedTabPicker({
  tabCount,
  activeIndex,
  ariaLabel,
  className = "",
  indicatorClassName = "",
  indicatorStyle,
  trackClassName = "",
  trackStyle,
  trackRef,
  children,
}: SegmentedTabPickerProps) {
  const pickerStyle = {
    "--tab-count": String(tabCount),
    "--active-index": String(Math.max(0, activeIndex)),
  } as CSSProperties;

  return (
    <div
      className={`${styles.wrap} ${className}`.trim()}
      style={pickerStyle}
    >
      <div
        ref={trackRef}
        className={`${styles.track} ${trackClassName}`.trim()}
        style={trackStyle}
        role="tablist"
        aria-label={ariaLabel}
      >
        <div
          className={`${styles.indicator} ${indicatorClassName}`.trim()}
          style={indicatorStyle}
          aria-hidden
        />

        {children}
      </div>
    </div>
  );
}
