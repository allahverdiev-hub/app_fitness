import { useCallback, useEffect, useMemo, useState } from "react";
import type { WarmupVolumeType } from "@/features/exercise-page/types/exercise";
import { WheelPicker } from "@/features/exercise-page/components/add-set-sheet/WheelPicker";
import type { ExerciseVolumeUpdate } from "@/features/workouts/utils/applyExerciseVolumeChange";
import { PrimaryActionButton } from "@/shared/ui/ActionButton";
import { ActionPopup } from "@/shared/ui/ActionPopup";
import {
  REP_RANGE_INDEX_OPTIONS,
  REP_RANGE_OPTIONS,
  SETS_OPTIONS,
  WARMUP_MINUTES_OPTIONS,
  WARMUP_REPS_OPTIONS,
} from "./editVolumePickerData";
import styles from "./EditExerciseVolumeSheet.module.css";

export type ExerciseVolumeSnapshot = {
  sets: number;
  repsRange: string;
  isWarmup: boolean;
  warmupVolumeType?: WarmupVolumeType;
};

type EditExerciseVolumeSheetProps = {
  open: boolean;
  exerciseTitle: string;
  volume: ExerciseVolumeSnapshot | null;
  onClose: () => void;
  onConfirm: (update: ExerciseVolumeUpdate) => void;
};

function parseWarmupMinutes(repsRange: string): number {
  const match = repsRange.match(/(\d+)/);
  return match ? Number(match[1]) : 5;
}

function parseWarmupReps(repsRange: string): number {
  const match = repsRange.match(/(\d+)/);
  return match ? Number(match[1]) : 15;
}

function parseRepRangeIndex(repsRange: string): number {
  const index = REP_RANGE_OPTIONS.indexOf(
    repsRange as (typeof REP_RANGE_OPTIONS)[number],
  );
  return index >= 0 ? index : REP_RANGE_OPTIONS.indexOf("10-12");
}

export function EditExerciseVolumeSheet({
  open,
  exerciseTitle,
  volume,
  onClose,
  onConfirm,
}: EditExerciseVolumeSheetProps) {
  const [sets, setSets] = useState(3);
  const [repRangeIndex, setRepRangeIndex] = useState(2);
  const [warmupType, setWarmupType] = useState<WarmupVolumeType>("time");
  const [warmupMinutes, setWarmupMinutes] = useState(5);
  const [warmupReps, setWarmupReps] = useState(15);

  const resetForm = useCallback(() => {
    if (!volume) return;
    if (volume.isWarmup) {
      const type = volume.warmupVolumeType ?? "time";
      setWarmupType(type);
      if (type === "time") {
        setWarmupMinutes(parseWarmupMinutes(volume.repsRange));
      } else {
        setWarmupReps(parseWarmupReps(volume.repsRange));
      }
      return;
    }
    setSets(volume.sets);
    setRepRangeIndex(parseRepRangeIndex(volume.repsRange));
  }, [volume]);

  useEffect(() => {
    if (!open) return;
    resetForm();
  }, [open, resetForm]);

  const isWarmup = volume?.isWarmup ?? false;

  const handleConfirm = () => {
    if (!volume) return;
    if (isWarmup) {
      if (warmupType === "time") {
        onConfirm({
          sets: 1,
          repsRange: `${warmupMinutes} мин`,
          warmupVolumeType: "time",
        });
      } else {
        onConfirm({
          sets: 1,
          repsRange: String(warmupReps),
          warmupVolumeType: "reps",
        });
      }
      return;
    }

    onConfirm({
      sets,
      repsRange: REP_RANGE_OPTIONS[repRangeIndex],
    });
  };

  const wheelsReady = open;

  const warmupTypeLabel = useMemo(
    () => (warmupType === "time" ? "Время" : "Повторения"),
    [warmupType],
  );

  return (
    <ActionPopup open={open} title={exerciseTitle} onClose={onClose}>
      <div className={styles.body}>
        {isWarmup ? (
          <>
            <div className={styles.typeRow} role="group" aria-label="Тип объёма">
              <button
                type="button"
                className={
                  warmupType === "time"
                    ? `${styles.typeBtn} ${styles.typeBtnActive}`
                    : styles.typeBtn
                }
                onClick={() => setWarmupType("time")}
              >
                Время
              </button>
              <button
                type="button"
                className={
                  warmupType === "reps"
                    ? `${styles.typeBtn} ${styles.typeBtnActive}`
                    : styles.typeBtn
                }
                onClick={() => setWarmupType("reps")}
              >
                Повторения
              </button>
            </div>
            <div className={styles.pickerRow}>
              {warmupType === "time" ? (
                <WheelPicker
                  options={WARMUP_MINUTES_OPTIONS}
                  value={warmupMinutes}
                  onChange={setWarmupMinutes}
                  format={(value) => `${value} мин`}
                  fadeBg="var(--color-workout-card)"
                  scrollReady={wheelsReady}
                  aria-label="Длительность разминки"
                />
              ) : (
                <WheelPicker
                  options={WARMUP_REPS_OPTIONS}
                  value={warmupReps}
                  onChange={setWarmupReps}
                  format={(value) => `${value} повт.`}
                  fadeBg="var(--color-workout-card)"
                  scrollReady={wheelsReady}
                  aria-label="Число повторений разминки"
                />
              )}
            </div>
            <p className={styles.hint}>Тип: {warmupTypeLabel}</p>
          </>
        ) : (
          <div className={styles.pickerGrid}>
            <div className={styles.pickerCol}>
              <p className={styles.pickerLabel}>Подходы</p>
              <WheelPicker
                options={SETS_OPTIONS}
                value={sets}
                onChange={setSets}
                fadeBg="var(--color-workout-card)"
                scrollReady={wheelsReady}
                aria-label="Число подходов"
              />
            </div>
            <div className={styles.pickerCol}>
              <p className={styles.pickerLabel}>Повторения</p>
              <WheelPicker
                options={REP_RANGE_INDEX_OPTIONS}
                value={repRangeIndex}
                onChange={setRepRangeIndex}
                format={(index) => REP_RANGE_OPTIONS[index]}
                fadeBg="var(--color-workout-card)"
                scrollReady={wheelsReady}
                aria-label="Диапазон повторений"
              />
            </div>
          </div>
        )}
        <PrimaryActionButton className={styles.confirmBtn} onClick={handleConfirm}>
          Сохранить
        </PrimaryActionButton>
      </div>
    </ActionPopup>
  );
}
