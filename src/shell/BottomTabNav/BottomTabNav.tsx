import type { ComponentType } from "react";
import type { IconProps } from "@/shared/icons";
import {
  IconTabCatalog,
  IconTabProfile,
  IconTabWorkouts,
} from "@/shared/icons/tabNavIcons";
import { FloatingIsland } from "@/shared/ui/FloatingIsland";
import styles from "./BottomTabNav.module.css";

export type AppTabId = "workouts" | "catalog" | "profile";

const TABS: {
  id: AppTabId;
  label: string;
  Icon: ComponentType<IconProps>;
}[] = [
  { id: "workouts", label: "Тренировки", Icon: IconTabWorkouts },
  { id: "catalog", label: "Справочник", Icon: IconTabCatalog },
  { id: "profile", label: "Профиль", Icon: IconTabProfile },
];

type BottomTabNavProps = {
  active: AppTabId;
  onChange: (tab: AppTabId) => void;
};

export function BottomTabNav({ active, onChange }: BottomTabNavProps) {
  return (
    <nav className={styles.nav} aria-label="Основная навигация">
      <FloatingIsland className={styles.islandShell}>
        <ul className={styles.list}>
          {TABS.map((tab) => {
            const isActive = tab.id === active;
            const Icon = tab.Icon;
            return (
              <li key={tab.id} className={styles.item}>
                <button
                  type="button"
                  className={`${styles.tab} ${isActive ? styles.tabActive : ""}`}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => onChange(tab.id)}
                >
                  <Icon size={24} className={styles.tabIcon} />
                  <span className={styles.label}>{tab.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </FloatingIsland>
    </nav>
  );
}
