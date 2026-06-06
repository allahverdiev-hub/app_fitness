import { useEffect } from "react";
import { ActionPopup } from "@/shared/ui/ActionPopup";
import {
  Level2ActionButton,
  PrimaryActionButton,
} from "@/shared/ui/ActionButton";
import styles from "./FinishWorkoutConfirmSheet.module.css";

type FinishWorkoutConfirmSheetProps = {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function FinishWorkoutConfirmSheet({
  open,
  onConfirm,
  onCancel,
}: FinishWorkoutConfirmSheetProps) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  return (
    <ActionPopup
      open={open}
      title="Вы уверены, что хотите завершить тренировку?"
      onClose={onCancel}
    >
      <div className={styles.actions}>
        <Level2ActionButton block className={styles.actionBtn} onClick={onCancel}>
          Нет
        </Level2ActionButton>
        <PrimaryActionButton className={styles.actionBtn} onClick={onConfirm}>
          Да
        </PrimaryActionButton>
      </div>
    </ActionPopup>
  );
}
