import { IconClose } from "@/shared/icons";
import styles from "./SheetPopupHeader.module.css";

type SheetPopupHeaderProps = {
  title: string;
  titleId: string;
  onClose: () => void;
  className?: string;
  /** Заголовок в несколько строк без сокращения */
  titleWrap?: boolean;
};

export function SheetPopupHeader({
  title,
  titleId,
  onClose,
  className = "",
  titleWrap = false,
}: SheetPopupHeaderProps) {
  return (
    <header
      className={`${styles.header} ${titleWrap ? styles.headerWrap : ""} ${className}`.trim()}
    >
      <h2
        id={titleId}
        className={`${styles.title} ${titleWrap ? styles.titleWrap : ""}`.trim()}
      >
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
