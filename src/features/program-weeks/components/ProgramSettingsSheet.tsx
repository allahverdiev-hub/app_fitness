import { useEffect } from "react";
import { IconList, IconSync } from "@/shared/icons";
import { ActionPopup, ActionPopupMenu } from "@/shared/ui/ActionPopup";

export type ProgramSettingsAction = "reset" | "refresh";

type ProgramSettingsSheetProps = {
  open: boolean;
  programTitle: string;
  onClose: () => void;
  onAction: (action: ProgramSettingsAction) => void;
};

export function ProgramSettingsSheet({
  open,
  programTitle,
  onClose,
  onAction,
}: ProgramSettingsSheetProps) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const run = (action: ProgramSettingsAction) => {
    onAction(action);
    onClose();
  };

  return (
    <ActionPopup open={open} title={programTitle} onClose={onClose}>
      <ActionPopupMenu
        items={[
          {
            id: "reset",
            label: "Сбросить к исходным",
            icon: <IconList size={18} />,
            onClick: () => run("reset"),
          },
          {
            id: "refresh",
            label: "Обновить прогресс",
            icon: <IconSync size={18} />,
            onClick: () => run("refresh"),
          },
        ]}
      />
    </ActionPopup>
  );
}
