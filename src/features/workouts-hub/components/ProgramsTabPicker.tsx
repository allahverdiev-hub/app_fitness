import { SegmentedTabPicker, segmentedTabPickerStyles } from "@/shared/ui/SegmentedTabPicker";
import type { HubProgramsTab } from "@/features/workouts-hub/types/workoutsHub";
import styles from "./ProgramsTabPicker.module.css";

const TABS: { id: HubProgramsTab; label: string }[] = [
  { id: "mine", label: "Мои" },
  { id: "catalog", label: "Каталог" },
];

type ProgramsTabPickerProps = {
  active: HubProgramsTab;
  mineCount: number;
  onChange: (tab: HubProgramsTab) => void;
};

export function ProgramsTabPicker({
  active,
  mineCount,
  onChange,
}: ProgramsTabPickerProps) {
  const activeIndex = TABS.findIndex((tab) => tab.id === active);

  return (
    <SegmentedTabPicker
      tabCount={TABS.length}
      activeIndex={activeIndex < 0 ? 0 : activeIndex}
      ariaLabel="Программы"
    >
      {TABS.map((tab) => {
        const isActive = tab.id === active;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`${segmentedTabPickerStyles.item} ${isActive ? segmentedTabPickerStyles.itemActive : ""}`}
            aria-label={
              tab.id === "mine" ? `Мои, ${mineCount} программ` : tab.label
            }
            onClick={() => onChange(tab.id)}
          >
            {tab.id === "mine" ? (
              <span className={styles.tabLabel}>
                <span>{tab.label}</span>
                <span className={styles.count} aria-hidden>
                  {mineCount}
                </span>
              </span>
            ) : (
              tab.label
            )}
          </button>
        );
      })}
    </SegmentedTabPicker>
  );
}
