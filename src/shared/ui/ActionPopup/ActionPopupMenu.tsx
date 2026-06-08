import type { ComponentType, ReactNode } from "react";
import {
  Level2ActionButton,
  Level3ActionButton,
} from "@/shared/ui/ActionButton";
import menuStyles from "./ActionPopupMenu.module.css";

type ActionPopupMenuButtonLevel = 2 | 3;

const MENU_BUTTON_BY_LEVEL: Record<
  ActionPopupMenuButtonLevel,
  ComponentType<{
    block?: boolean;
    icon?: ReactNode;
    danger?: boolean;
    onClick: () => void;
    children: ReactNode;
  }>
> = {
  2: Level2ActionButton,
  3: Level3ActionButton,
};

export type ActionPopupMenuItem = {
  id: string;
  label: string;
  icon?: ReactNode;
  danger?: boolean;
  onClick: () => void;
};

type ActionPopupMenuProps = {
  items: ActionPopupMenuItem[];
  /** 3 — контекстное меню упражнения; 2 — прочие action-popup */
  buttonLevel?: ActionPopupMenuButtonLevel;
};

export function ActionPopupMenu({
  items,
  buttonLevel = 2,
}: ActionPopupMenuProps) {
  const MenuButton = MENU_BUTTON_BY_LEVEL[buttonLevel];

  return (
    <ul className={menuStyles.menu}>
      {items.map((item) => (
        <li key={item.id}>
          <MenuButton
            block
            icon={item.icon}
            danger={item.danger}
            onClick={item.onClick}
          >
            {item.label}
          </MenuButton>
        </li>
      ))}
    </ul>
  );
}
