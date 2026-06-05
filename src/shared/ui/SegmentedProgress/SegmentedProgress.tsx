import styles from "./SegmentedProgress.module.css";

export type SegmentedProgressSize = "sm" | "md";
export type SegmentedProgressVariant = "default" | "program";

type SegmentedProgressProps = {
  completed: number;
  total: number;
  size?: SegmentedProgressSize;
  variant?: SegmentedProgressVariant;
  className?: string;
  ariaLabel?: string;
};

export function SegmentedProgress({
  completed,
  total,
  size = "md",
  variant = "default",
  className = "",
  ariaLabel,
}: SegmentedProgressProps) {
  if (total <= 0) return null;

  const sizeClass = size === "sm" ? styles.sizeSm : styles.sizeMd;
  const variantClass =
    variant === "program" ? styles.variantProgram : styles.variantDefault;

  return (
    <div
      className={`${styles.track} ${sizeClass} ${variantClass} ${className}`.trim()}
      style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}
      role="progressbar"
      aria-valuenow={completed}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={ariaLabel ?? `Выполнено: ${completed} из ${total}`}
    >
      {Array.from({ length: total }, (_, index) => (
        <span
          key={index}
          className={index < completed ? styles.segmentDone : styles.segment}
          aria-hidden
        />
      ))}
    </div>
  );
}
