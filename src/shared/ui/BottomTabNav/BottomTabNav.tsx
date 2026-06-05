import type { ComponentType } from "react";
import type { IconProps } from "@/shared/icons";
import { FloatingIsland } from "@/shared/ui/FloatingIsland";
import styles from "./BottomTabNav.module.css";

export type BottomTabNavItem<T extends string = string> = {
  id: T;
  label: string;
  Icon: ComponentType<IconProps>;
};

export type BottomTabNavProps<T extends string> = {
  items: readonly BottomTabNavItem<T>[];
  active: T;
  onChange: (tab: T) => void;
  ariaLabel?: string;
};

export function BottomTabNav<T extends string>({
  items,
  active,
  onChange,
  ariaLabel = "Основная навигация",
}: BottomTabNavProps<T>) {
  return (
    <nav className={styles.nav} aria-label={ariaLabel}>
      <FloatingIsland className={styles.islandShell}>
        <ul className={styles.list}>
          {items.map((tab) => {
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
                  <Icon size={22} className={styles.tabIcon} />
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
