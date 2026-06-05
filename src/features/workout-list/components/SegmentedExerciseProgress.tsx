import {
  SegmentedProgress,
  type SegmentedProgressSize,
  type SegmentedProgressVariant,
} from "@/shared/ui/SegmentedProgress";

type SegmentedExerciseProgressProps = {
  completed: number;
  total: number;
  className?: string;
  segmentClassName?: string;
  segmentDoneClassName?: string;
  size?: SegmentedProgressSize;
  variant?: SegmentedProgressVariant;
};

/** @deprecated Используйте SegmentedProgress из shared/ui */
export function SegmentedExerciseProgress({
  completed,
  total,
  className = "",
  size = "md",
  variant = "default",
}: SegmentedExerciseProgressProps) {
  return (
    <SegmentedProgress
      completed={completed}
      total={total}
      size={size}
      variant={variant}
      className={className}
    />
  );
}
