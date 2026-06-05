import { useCallback, useId, useRef, type ReactNode } from "react";
import {
  BOTTOM_SHEET_DURATION_MS,
  useBottomSheetMotion,
} from "@/shared/ui/bottom-sheet";
import { SheetPopupHeader } from "@/shared/ui/SheetPopupHeader";
import styles from "./ActionPopup.module.css";

export type ActionPopupProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  /** Для aria-labelledby; по умолчанию генерируется */
  titleId?: string;
  /** Заголовок в несколько строк без сокращения */
  titleWrap?: boolean;
};

export function ActionPopup({
  open,
  title,
  onClose,
  children,
  titleId: titleIdProp,
  titleWrap = false,
}: ActionPopupProps) {
  const autoTitleId = useId();
  const titleId = titleIdProp ?? autoTitleId;
  const sheetRef = useRef<HTMLDivElement>(null);
  const { shouldRender, shown, unmount } = useBottomSheetMotion(
    open,
    BOTTOM_SHEET_DURATION_MS,
  );

  const handleSheetTransitionEnd = useCallback(
    (e: React.TransitionEvent<HTMLDivElement>) => {
      if (e.target !== sheetRef.current || e.propertyName !== "transform") return;
      if (!open) unmount();
    },
    [open, unmount],
  );

  if (!shouldRender) return null;

  return (
    <div
      className={`${styles.root} ${shown ? styles.rootShown : ""}`}
      role="presentation"
    >
      <button
        type="button"
        className={styles.backdrop}
        aria-label="Закрыть"
        onClick={onClose}
        tabIndex={shown ? 0 : -1}
      />
      <div
        ref={sheetRef}
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onTransitionEnd={handleSheetTransitionEnd}
      >
        <SheetPopupHeader
          title={title}
          titleId={titleId}
          onClose={onClose}
          titleWrap={titleWrap}
        />
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
}
