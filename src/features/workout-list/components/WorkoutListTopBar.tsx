import { IconButton } from "@/shared/ui/IconButton/IconButton";
import { IconChevronDown, IconChevronLeft, IconMore } from "@/shared/icons";
import styles from "./WorkoutListTopBar.module.css";

type WorkoutListTopBarProps = {
  onBack?: () => void;
};

export function WorkoutListTopBar({ onBack }: WorkoutListTopBarProps) {
  return (
    <header className={styles.header}>
      <IconButton
        variant="capsule"
        label="Назад"
        className={styles.back}
        onClick={onBack}
      >
        <IconChevronLeft size={18} />
        <span>Назад</span>
      </IconButton>
      <div className={styles.menuGroup} role="group" aria-label="Действия">
        <IconButton variant="ghost" label="Свернуть" className={styles.menuBtn}>
          <IconChevronDown size={18} />
        </IconButton>
        <span className={styles.menuDivider} aria-hidden />
        <IconButton variant="ghost" label="Ещё" className={styles.menuBtn}>
          <IconMore size={18} />
        </IconButton>
      </div>
    </header>
  );
}
