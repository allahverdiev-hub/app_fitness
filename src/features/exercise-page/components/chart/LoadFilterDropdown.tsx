import { useEffect, useId, useRef, useState } from "react";
import { IconChevronDown } from "@/shared/icons";
import {
  loadFilterLabels,
  type LoadFilter,
} from "@/features/exercise-page/mocks/progress-chart";
import styles from "./LoadFilterDropdown.module.css";

type LoadFilterDropdownProps = {
  value: LoadFilter;
  onChange: (value: LoadFilter) => void;
};

const options = Object.keys(loadFilterLabels) as LoadFilter[];

export function LoadFilterDropdown({ value, onChange }: LoadFilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        type="button"
        className={styles.trigger}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className={styles.triggerLabel}>{loadFilterLabels[value]}</span>
        <IconChevronDown
          size={18}
          className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}
        />
      </button>
      {open && (
        <ul id={listId} className={styles.menu} role="listbox" aria-label="Нагрузка">
          {options.map((key) => (
            <li key={key} role="option" aria-selected={value === key}>
              <button
                type="button"
                className={`${styles.option} ${value === key ? styles.optionActive : ""}`}
                onClick={() => {
                  onChange(key);
                  setOpen(false);
                }}
              >
                {loadFilterLabels[key]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
