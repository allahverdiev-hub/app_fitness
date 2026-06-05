import { IconClose } from "@/shared/icons";
import styles from "./SheetPopupHeader.module.css";

type SheetPopupHeaderProps = {
  title: string;
  titleId: string;
  onClose: () => void;
  className?: string;
};

export function SheetPopupHeader({
  title,
  titleId,
  onClose,
  className = "",
}: SheetPopupHeaderProps) {
  return (
    <header className={`${styles.header} ${className}`.trim()}>
      <h2 id={titleId} className={styles.title}>
        {title}
      </h2>
      <button
        type="button"
        className={styles.closeBtn}
        aria-label="Закрыть"
        onClick={onClose}
      >
        <IconClose size={18} />
      </button>
    </header>
  );
}
