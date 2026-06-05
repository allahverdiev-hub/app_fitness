import { IconEdit, IconReplace, IconTrash } from "@/shared/icons";
import { ActionPopup, ActionPopupMenu } from "@/shared/ui/ActionPopup";

export type ExerciseMenuAction = "replace" | "edit" | "delete";

type ExerciseActionsSheetProps = {
  open: boolean;
  exerciseTitle: string;
  onClose: () => void;
  onAction: (action: ExerciseMenuAction) => void;
};

export function ExerciseActionsSheet({
  open,
  exerciseTitle,
  onClose,
  onAction,
}: ExerciseActionsSheetProps) {
  const run = (action: ExerciseMenuAction) => {
    onAction(action);
    onClose();
  };

  return (
    <ActionPopup open={open} title={exerciseTitle} onClose={onClose}>
      <ActionPopupMenu
        items={[
          {
            id: "replace",
            label: "Заменить",
            icon: <IconReplace size={18} />,
            onClick: () => run("replace"),
          },
          {
            id: "edit",
            label: "Изменить",
            icon: <IconEdit size={18} />,
            onClick: () => run("edit"),
          },
          {
            id: "delete",
            label: "Удалить",
            icon: <IconTrash size={18} />,
            danger: true,
            onClick: () => run("delete"),
          },
        ]}
      />
    </ActionPopup>
  );
}
