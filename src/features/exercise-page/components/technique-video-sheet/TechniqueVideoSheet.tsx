import { useEffect, useMemo, useRef } from "react";
import {
  BOTTOM_SHEET_DURATION_MS,
  useBottomSheetMotion,
} from "@/shared/ui/bottom-sheet";
import { SheetPopupHeader } from "@/shared/ui/SheetPopupHeader";
import { toKinescopeEmbedUrl } from "@/shared/lib/kinescope";
import styles from "./TechniqueVideoSheet.module.css";

type TechniqueVideoSheetProps = {
  open: boolean;
  videoUrl: string;
  title?: string;
  onClose: () => void;
};

export function TechniqueVideoSheet({
  open,
  videoUrl,
  title = "Техника",
  onClose,
}: TechniqueVideoSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const { shouldRender, shown, unmount } = useBottomSheetMotion(
    open,
    BOTTOM_SHEET_DURATION_MS,
    sheetRef,
  );

  const embedUrl = useMemo(() => toKinescopeEmbedUrl(videoUrl), [videoUrl]);

  useEffect(() => {
    if (!shouldRender) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shouldRender, open, onClose]);

  const handleSheetTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== sheetRef.current || e.propertyName !== "transform") return;
    if (!open && !shown) unmount();
  };

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      className={`${styles.root} ${shown ? styles.rootShown : ""}`}
      role="presentation"
      aria-hidden={!open}
    >
      <button
        type="button"
        className={styles.backdrop}
        aria-label="Закрыть видео"
        onClick={onClose}
        tabIndex={shown ? 0 : -1}
      />
      <div
        ref={sheetRef}
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby="technique-video-title"
        onTransitionEnd={handleSheetTransitionEnd}
      >
        <div className={styles.sheetBody}>
          <SheetPopupHeader
            title={title}
            titleId="technique-video-title"
            onClose={onClose}
          />

          <div className={styles.playerWrap}>
            {embedUrl ? (
              <iframe
                className={styles.player}
                src={shown ? embedUrl : undefined}
                title={`Видео: ${title}`}
                loading="lazy"
                allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer; clipboard-write; screen-wake-lock;"
                allowFullScreen
              />
            ) : (
              <p className={styles.playerError}>
                Не удалось загрузить видео. Проверьте ссылку Kinescope.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
