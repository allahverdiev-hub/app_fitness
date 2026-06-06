import { SegmentedTabPicker, segmentedTabPickerStyles } from "@/shared/ui/SegmentedTabPicker";
import {
  loadFilterLabels,
  type LoadFilter,
} from "@/features/exercise-page/mocks/progress-chart";

const LOAD_FILTERS = Object.keys(loadFilterLabels) as LoadFilter[];

type LoadFilterTabPickerProps = {
  value: LoadFilter;
  onChange: (value: LoadFilter) => void;
  className?: string;
};

export function LoadFilterTabPicker({
  value,
  onChange,
  className = "",
}: LoadFilterTabPickerProps) {
  const activeIndex = Math.max(0, LOAD_FILTERS.indexOf(value));

  return (
    <SegmentedTabPicker
      className={className}
      tabCount={LOAD_FILTERS.length}
      activeIndex={activeIndex}
      ariaLabel="Нагрузка"
    >
      {LOAD_FILTERS.map((key) => {
        const isActive = key === value;

        return (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`${segmentedTabPickerStyles.item} ${isActive ? segmentedTabPickerStyles.itemActive : ""}`}
            onClick={() => onChange(key)}
          >
            {loadFilterLabels[key]}
          </button>
        );
      })}
    </SegmentedTabPicker>
  );
}
