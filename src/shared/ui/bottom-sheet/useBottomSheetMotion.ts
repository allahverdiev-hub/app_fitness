import { useCallback, useLayoutEffect, useRef, useState } from "react";

/**
 * Монтирование bottom sheet: один кадр «закрыто», затем transition в «открыто».
 */
export function useBottomSheetMotion(open: boolean, durationMs: number) {
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
    setMounted(false);
    setShown(false);
  }, [clearExitTimer, cancelEnterRaf]);

  useLayoutEffect(() => {
    cancelEnterRaf();

    if (open) {
      clearExitTimer();
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

    setShown(false);
    clearExitTimer();
    exitTimerRef.current = setTimeout(unmount, durationMs + 32);

    return () => {
      clearExitTimer();
      cancelEnterRaf();
    };
  }, [open, durationMs, clearExitTimer, cancelEnterRaf, unmount]);

  const shouldRender = mounted || open;

  return { shouldRender, shown, unmount };
}
