import {
  SegmentedProgress,
  type SegmentedProgressSize,
  type SegmentedProgressVariant,
} from "@/shared/ui/SegmentedProgress";
import styles from "./ProgressOverview.module.css";

export type ProgressOverviewSpacing = "none" | "section" | "sectionTop";

type ProgressOverviewProps = {
  completed: number;
  total: number;
  prefix?: string;
  size?: SegmentedProgressSize;
  variant?: SegmentedProgressVariant;
  spacing?: ProgressOverviewSpacing;
  className?: string;
  labelClassName?: string;
  ariaLabel?: string;
};

export function ProgressOverview({
  completed,
  total,
  prefix,
  size = "md",
  variant = "default",
  spacing = "none",
  className = "",
  labelClassName = "",
  ariaLabel,
}: ProgressOverviewProps) {
  if (total <= 0) return null;

  const spacingClass =
    spacing === "section"
      ? styles.spacingSection
      : spacing === "sectionTop"
        ? styles.spacingSectionTop
        : "";

  return (
    <div
      className={`${styles.block} ${spacingClass} ${className}`.trim()}
    >
      <p className={`${styles.label} ${labelClassName}`.trim()}>
        {prefix ? <span className={styles.labelMuted}>{prefix}</span> : null}
        <span>
          {completed} из {total}
        </span>
      </p>
      <SegmentedProgress
        completed={completed}
        total={total}
        size={size}
        variant={variant}
        ariaLabel={ariaLabel}
      />
    </div>
  );
}
