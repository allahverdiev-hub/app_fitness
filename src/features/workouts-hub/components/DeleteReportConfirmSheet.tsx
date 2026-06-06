import { useEffect } from "react";
import { ActionPopup } from "@/shared/ui/ActionPopup";
import {
  Level2ActionButton,
  PrimaryActionButton,
} from "@/shared/ui/ActionButton";
import styles from "./DeleteReportConfirmSheet.module.css";

type DeleteReportConfirmSheetProps = {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function DeleteReportConfirmSheet({
  open,
  onConfirm,
  onCancel,
}: DeleteReportConfirmSheetProps) {
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
      title="Вы уверены, что хотите удалить отчёт?"
      onClose={onCancel}
    >
      <div className={styles.actions}>
        <Level2ActionButton block className={styles.actionBtn} onClick={onCancel}>
          Отмена
        </Level2ActionButton>
        <PrimaryActionButton className={styles.actionBtn} onClick={onConfirm}>
          Да
        </PrimaryActionButton>
      </div>
    </ActionPopup>
  );
}
