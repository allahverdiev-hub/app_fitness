import { useCallback, useId, useLayoutEffect, useRef, type ReactNode } from "react";
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
};

/**
 * Bottom sheet с закреплённой шапкой: если контент не помещается,
 * прокручивается только область под заголовком (без видимого скроллбара).
 */
export function ActionPopup({
  open,
  title,
  onClose,
  children,
  titleId: titleIdProp,
}: ActionPopupProps) {
  const autoTitleId = useId();
  const titleId = titleIdProp ?? autoTitleId;
  const sheetMotionRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { shouldRender, shown, unmount } = useBottomSheetMotion(
    open,
    BOTTOM_SHEET_DURATION_MS,
    sheetMotionRef,
  );

  useLayoutEffect(() => {
    if (!open || !shown || !scrollRef.current) return;
    scrollRef.current.scrollTop = 0;
  }, [open, shown, title]);

  const handleSheetTransitionEnd = useCallback(
    (e: React.TransitionEvent<HTMLDivElement>) => {
      if (e.target !== sheetMotionRef.current || e.propertyName !== "transform") {
        return;
      }
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
        ref={sheetMotionRef}
        className={styles.sheetMotion}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onTransitionEnd={handleSheetTransitionEnd}
      >
        <SheetPopupHeader
          className={styles.sheetHeader}
          title={title}
          titleId={titleId}
          onClose={onClose}
        />
        <div ref={scrollRef} className={styles.scroll}>
          {children}
        </div>
      </div>
    </div>
  );
}
