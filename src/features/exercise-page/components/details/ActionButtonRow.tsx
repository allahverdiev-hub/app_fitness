import { IconList, IconPlay, IconReplace } from "@/shared/icons";
import { Level3ActionButton } from "@/shared/ui/ActionButton";
import styles from "./ActionButtonRow.module.css";

type ActionButtonRowProps = {
  onTechnique?: () => void;
  onDescription?: () => void;
  onReplace?: () => void;
};

export function ActionButtonRow({
  onTechnique,
  onDescription,
  onReplace,
}: ActionButtonRowProps) {
  return (
    <nav className={styles.column} aria-label="Действия с упражнением">
      <div className={styles.actionsColumn}>
        <div className={styles.topRow}>
          <Level3ActionButton
            grow
            icon={<IconPlay size={18} />}
            onClick={onTechnique}
          >
            Техника
          </Level3ActionButton>
          <Level3ActionButton
            grow
            icon={<IconList size={18} />}
            onClick={onDescription}
          >
            Описание
          </Level3ActionButton>
        </div>
        <Level3ActionButton
          block
          icon={<IconReplace size={18} />}
          onClick={onReplace}
        >
          Заменить
        </Level3ActionButton>
      </div>
    </nav>
  );
}
