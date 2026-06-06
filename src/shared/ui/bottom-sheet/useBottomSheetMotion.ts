import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { lockSheetHeight, unlockSheetHeight } from "./sheetMotion";

/**
 * Монтирование bottom sheet: один кадр «закрыто», затем transition в «открыто».
 * При закрытии фиксирует высоту листа до старта transform-анимации.
 */
export function useBottomSheetMotion(
  open: boolean,
  durationMs: number,
  sheetRef?: RefObject<HTMLElement | null>,
) {
  const [mounted, setMounted] = useState(open);
  const [shown, setShown] = useState(false);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const enterRafIdsRef = useRef<number[]>([]);

  const clearExitTimer = useCallback(() => {
    if (exitTimerRef.current) {
      clearTimeout(exitTimerRef.current);
      exitTimerRef.current = null;
    }
  }, []);

  const cancelEnterRaf = useCallback(() => {
    for (const id of enterRafIdsRef.current) {
      cancelAnimationFrame(id);
    }
    enterRafIdsRef.current = [];
  }, []);

  const unmount = useCallback(() => {
    clearExitTimer();
    cancelEnterRaf();
    if (sheetRef?.current) {
      unlockSheetHeight(sheetRef.current);
    }
    setMounted(false);
    setShown(false);
  }, [clearExitTimer, cancelEnterRaf, sheetRef]);

  useLayoutEffect(() => {
    cancelEnterRaf();
    const sheetEl = sheetRef?.current ?? null;

    if (open) {
      clearExitTimer();
      if (sheetEl) unlockSheetHeight(sheetEl);
      setMounted(true);
      setShown(false);

      const raf1 = requestAnimationFrame(() => {
        const raf2 = requestAnimationFrame(() => {
          enterRafIdsRef.current = [];
          setShown(true);
        });
        enterRafIdsRef.current = [raf2];
      });
      enterRafIdsRef.current = [raf1];

      return cancelEnterRaf;
    }

    if (sheetEl) lockSheetHeight(sheetEl);
    setShown(false);
    clearExitTimer();
    exitTimerRef.current = setTimeout(unmount, durationMs + 32);

    return () => {
      clearExitTimer();
      cancelEnterRaf();
    };
  }, [open, durationMs, clearExitTimer, cancelEnterRaf, unmount, sheetRef]);

  const shouldRender = mounted || open;

  return { shouldRender, shown, unmount };
}
