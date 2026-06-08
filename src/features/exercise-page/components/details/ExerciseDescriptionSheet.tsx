import { useEffect } from "react";
import type { ExerciseDescription as ExerciseDescriptionData } from "@/features/exercise-page/types/exercise";
import { ActionPopup } from "@/shared/ui/ActionPopup";
import { ExerciseDescription } from "@/features/exercise-page/components/details/ExerciseDescription";
type ExerciseDescriptionSheetProps = {
  open: boolean;
  exerciseTitle: string;
  description: ExerciseDescriptionData;
  onClose: () => void;
};

export function ExerciseDescriptionSheet({
  open,
  exerciseTitle,
  description,
  onClose,
}: ExerciseDescriptionSheetProps) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <ActionPopup
      open={open}
      title={exerciseTitle}
      onClose={onClose}
    >
      <ExerciseDescription description={description} embedded />
    </ActionPopup>
  );
}
