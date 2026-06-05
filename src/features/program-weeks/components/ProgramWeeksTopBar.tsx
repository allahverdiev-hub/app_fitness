import { IconButton } from "@/shared/ui/IconButton/IconButton";
import { IconChevronDown, IconClose, IconMore } from "@/shared/icons";
import styles from "./ProgramWeeksTopBar.module.css";

type ProgramWeeksTopBarProps = {
  onClose?: () => void;
};

export function ProgramWeeksTopBar({ onClose }: ProgramWeeksTopBarProps) {
  return (
    <header className={styles.header}>
      <IconButton
        variant="capsule"
        label="Закрыть"
        className={styles.close}
        onClick={onClose}
      >
        <IconClose size={16} />
        <span>Закрыть</span>
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
