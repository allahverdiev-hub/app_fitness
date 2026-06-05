import { useCallback } from "react";
import { IconClose, IconSettings } from "@/shared/icons";
import { FloatingIsland } from "@/shared/ui/FloatingIsland";
import { PrimaryActionButton } from "@/shared/ui/ActionButton";
import { WorkoutActiveBar } from "@/features/workout-list/components/WorkoutActiveBar";
import actionStyles from "@/shared/ui/ActionButton/ActionButton.module.css";
import styles from "./WorkoutListActions.module.css";

type WorkoutListActionsProps = {
  editing: boolean;
  workoutActive: boolean;
  workoutElapsed: string;
  workoutPaused?: boolean;
  onEditingChange: (editing: boolean) => void;
  onStartWorkout?: () => void;
  onSaveWorkout?: () => void;
  onFinishWorkout?: () => void;
  onToggleWorkoutPause?: () => void;
};

export function WorkoutListActions({
  editing,
  workoutActive,
  workoutElapsed,
  workoutPaused = false,
  onEditingChange,
  onStartWorkout,
  onSaveWorkout,
  onFinishWorkout,
  onToggleWorkoutPause,
}: WorkoutListActionsProps) {
  const openEdit = useCallback(() => {
    onEditingChange(true);
  }, [onEditingChange]);

  const closeEdit = useCallback(() => {
    onEditingChange(false);
  }, [onEditingChange]);

  const handleSave = useCallback(() => {
    onSaveWorkout?.();
    onEditingChange(false);
  }, [onSaveWorkout, onEditingChange]);

  const handleLeftClick = useCallback(() => {
    if (editing) {
      closeEdit();
    } else {
      openEdit();
    }
  }, [editing, closeEdit, openEdit]);

  const clusterClass = [
    styles.cluster,
    editing ? styles.clusterEditing : "",
    workoutActive && !editing ? styles.clusterWorkoutActive : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <FloatingIsland className={styles.island}>
      <div className={clusterClass}>
        <div className={`${styles.slot} ${styles.slotLeft}`}>
          <button
            type="button"
            className={`${actionStyles.mutedIcon} ${styles.leftCircleBtn}`}
            aria-label={editing ? "Закрыть" : "Настройки тренировки"}
            onClick={handleLeftClick}
          >
            <span
              className={`${styles.iconLayer} ${styles.iconLayerDefault}`}
              aria-hidden
            >
              <IconSettings size={20} />
            </span>
            <span
              className={`${styles.iconLayer} ${styles.iconLayerEdit}`}
              aria-hidden
            >
              <IconClose size={20} />
            </span>
          </button>
        </div>

        <div className={`${styles.slot} ${styles.slotRight}`}>
          <PrimaryActionButton
            className={`${styles.layer} ${styles.layerStart} ${styles.startBtn}`}
            tabIndex={editing || workoutActive ? -1 : 0}
            aria-hidden={editing || workoutActive}
            onClick={onStartWorkout}
          >
            Начать тренировку
          </PrimaryActionButton>
          <div
            className={`${styles.layer} ${styles.layerActiveBar}`}
            aria-hidden={!workoutActive || editing}
          >
            <WorkoutActiveBar
              elapsed={workoutElapsed}
              isPaused={workoutPaused}
              onFinish={onFinishWorkout}
              onTogglePause={onToggleWorkoutPause}
            />
          </div>
          <PrimaryActionButton
            className={`${styles.layer} ${styles.layerEdit} ${styles.startBtn}`}
            aria-label="Сохранить"
            tabIndex={editing ? 0 : -1}
            aria-hidden={!editing}
            onClick={handleSave}
          >
            Сохранить
          </PrimaryActionButton>
        </div>
      </div>
    </FloatingIsland>
  );
}
