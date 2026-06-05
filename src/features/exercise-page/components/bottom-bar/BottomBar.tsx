import { useCallback, useEffect, useRef } from "react";
import { IconChevronRight } from "@/shared/icons";
import {
  PrimaryActionButton,
  SecondaryActionButton,
} from "@/shared/ui/ActionButton";
import actionStyles from "@/shared/ui/ActionButton/ActionButton.module.css";
import {
  addSetButtonLabel,
  getAddSetButtonAriaLabel,
} from "@/features/exercise-page/utils/addSetButton";
import { FloatingIsland } from "@/shared/ui/FloatingIsland";
import styles from "./BottomBar.module.css";

const LONG_PRESS_MS = 500;

export type AddSetBarPhase = "idle" | "loading" | "success";

type BottomBarProps = {
  completedSets: number;
  targetSets: number;
  addSetPhase?: AddSetBarPhase;
  onOpenAddSet?: () => void;
  onUndoSet?: () => void;
  onNextExercise?: () => void;
  showNextExercise?: boolean;
  showFinishWorkout?: boolean;
  onFinishWorkout?: () => void;
};

export function BottomBar({
  completedSets,
  targetSets,
  addSetPhase = "idle",
  onOpenAddSet,
  onUndoSet,
  onNextExercise,
  showNextExercise = false,
  showFinishWorkout = false,
  onFinishWorkout,
}: BottomBarProps) {
  const allSetsComplete =
    targetSets > 0 && completedSets >= targetSets && showNextExercise;
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTriggered = useRef(false);

  const isAddSetBusy = addSetPhase !== "idle";

  const clearLongPress = useCallback(() => {
    if (longPressTimer.current !== null) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const handleAddPointerDown = useCallback(() => {
    longPressTriggered.current = false;
    if (isAddSetBusy || completedSets <= 0 || !onUndoSet) return;
    clearLongPress();
    longPressTimer.current = setTimeout(() => {
      longPressTriggered.current = true;
      onUndoSet();
    }, LONG_PRESS_MS);
  }, [isAddSetBusy, clearLongPress, completedSets, onUndoSet]);

  const handleAddPointerUp = useCallback(() => {
    clearLongPress();
  }, [clearLongPress]);

  const handleAddClick = useCallback(() => {
    if (longPressTriggered.current) {
      longPressTriggered.current = false;
      return;
    }
    if (isAddSetBusy) return;
    onOpenAddSet?.();
  }, [isAddSetBusy, onOpenAddSet]);

  useEffect(() => () => clearLongPress(), [clearLongPress]);

  const ariaLabel =
    addSetPhase === "loading"
      ? "Добавление подхода"
      : addSetPhase === "success"
        ? "ПОДХОД ДОБАВЛЕН"
        : getAddSetButtonAriaLabel(completedSets, targetSets);

  return (
    <footer className={styles.footer}>
      <FloatingIsland
        bare
        className={showFinishWorkout ? styles.islandStack : styles.island}
      >
        {showFinishWorkout ? (
          <SecondaryActionButton
            className={styles.finishWorkout}
            onClick={onFinishWorkout}
          >
            Завершить тренировку
          </SecondaryActionButton>
        ) : null}
        <div className={styles.addSetRow}>
          <div
            className={`${styles.addSetCluster} ${allSetsComplete ? styles.addSetClusterSplit : ""}`}
          >
            <PrimaryActionButton
              className={`${styles.addSet} ${isAddSetBusy ? styles.addSetBusy : ""}`}
              onClick={handleAddClick}
              onPointerDown={handleAddPointerDown}
              onPointerUp={handleAddPointerUp}
              onPointerLeave={handleAddPointerUp}
              onPointerCancel={handleAddPointerUp}
              disabled={isAddSetBusy}
              aria-label={ariaLabel}
              aria-busy={addSetPhase === "loading"}
            >
              {addSetPhase === "loading" && (
                <span className={styles.addSetSpinner} aria-hidden />
              )}
              {addSetPhase === "success" && (
                <span className={styles.addSetLabel}>ПОДХОД ДОБАВЛЕН</span>
              )}
              {addSetPhase === "idle" && (
                <span className={styles.addSetLabel}>{addSetButtonLabel}</span>
              )}
            </PrimaryActionButton>
            <button
              type="button"
              className={`${actionStyles.primaryCircle} ${styles.nextExercise}`}
              aria-label="Следующее упражнение"
              tabIndex={allSetsComplete ? 0 : -1}
              aria-hidden={!allSetsComplete}
              onClick={onNextExercise}
            >
              <IconChevronRight className={styles.nextExerciseIcon} size={20} />
            </button>
          </div>
        </div>
      </FloatingIsland>
    </footer>
  );
}
