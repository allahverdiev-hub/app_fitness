import type { ReactNode } from "react";
import { Level2ActionButton } from "@/shared/ui/ActionButton";
import menuStyles from "./ActionPopupMenu.module.css";

export type ActionPopupMenuItem = {
  id: string;
  label: string;
  icon?: ReactNode;
  danger?: boolean;
  onClick: () => void;
};

type ActionPopupMenuProps = {
  items: ActionPopupMenuItem[];
};

export function ActionPopupMenu({ items }: ActionPopupMenuProps) {
  return (
    <ul className={menuStyles.menu}>
      {items.map((item) => (
        <li key={item.id}>
          <Level2ActionButton
            block
            icon={item.icon}
            danger={item.danger}
            onClick={item.onClick}
          >
            {item.label}
          </Level2ActionButton>
        </li>
      ))}
    </ul>
  );
}
