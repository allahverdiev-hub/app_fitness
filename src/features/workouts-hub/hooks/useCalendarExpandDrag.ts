import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import {
  applyRubberBand,
  runSpring,
} from "@/features/workouts-hub/utils/calendarSpring";

const EXPAND_DISTANCE_PX = 172;
const EXPAND_THRESHOLD = 0.36;
const TAP_MAX_DELTA_PX = 10;

type UseCalendarExpandDragOptions = {
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
};

export function useCalendarExpandDrag({
  expanded,
  onExpandedChange,
}: UseCalendarExpandDragOptions) {
  const [dragProgress, setDragProgress] = useState<number | null>(null);
  const [settledProgress, setSettledProgress] = useState(expanded ? 1 : 0);
  const [isDragging, setIsDragging] = useState(false);
  const [isSettling, setIsSettling] = useState(false);

  const startYRef = useRef(0);
  const startProgressRef = useRef(0);
  const lastMoveRef = useRef({ y: 0, progress: 0, time: 0 });
  const cancelSpringRef = useRef<(() => void) | null>(null);

  const stopSpring = useCallback(() => {
    cancelSpringRef.current?.();
    cancelSpringRef.current = null;
    setIsSettling(false);
  }, []);

  const animateTo = useCallback(
    (from: number, to: number, initialVelocity = 0) => {
      stopSpring();
      setIsSettling(true);
      cancelSpringRef.current = runSpring(
        from,
        to,
        setSettledProgress,
        () => {
          cancelSpringRef.current = null;
          setIsSettling(false);
        },
        undefined,
        initialVelocity,
      );
    },
    [stopSpring],
  );

  useEffect(() => () => stopSpring(), [stopSpring]);

  const progress =
    dragProgress !== null ? dragProgress : settledProgress;

  const finishDrag = useCallback(
    (clientY: number, pointerId: number, target: HTMLElement) => {
      const delta = clientY - startYRef.current;
      const raw = Math.min(
        1,
        Math.max(0, startProgressRef.current + delta / EXPAND_DISTANCE_PX),
      );

      const isTap = Math.abs(delta) <= TAP_MAX_DELTA_PX;
      const nextExpanded = isTap
        ? !expanded
        : raw >= EXPAND_THRESHOLD;

      const now = performance.now();
      const elapsed = (now - lastMoveRef.current.time) / 1000;
      let releaseVelocity = 0;
      if (elapsed > 0 && elapsed < 0.14) {
        releaseVelocity = (raw - lastMoveRef.current.progress) / elapsed;
        releaseVelocity = Math.max(-5, Math.min(5, releaseVelocity));
      }

      onExpandedChange(nextExpanded);
      const targetProgress = nextExpanded ? 1 : 0;
      setDragProgress(null);
      setIsDragging(false);
      setSettledProgress(raw);
      animateTo(raw, targetProgress, releaseVelocity);

      if (target.hasPointerCapture(pointerId)) {
        target.releasePointerCapture(pointerId);
      }
    },
    [animateTo, expanded, onExpandedChange],
  );

  const onHandlePointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      stopSpring();
      event.currentTarget.setPointerCapture(event.pointerId);
      const now = performance.now();
      startYRef.current = event.clientY;
      startProgressRef.current = settledProgress;
      lastMoveRef.current = {
        y: event.clientY,
        progress: settledProgress,
        time: now,
      };
      setIsDragging(true);
      setDragProgress(settledProgress);
    },
    [settledProgress, stopSpring],
  );

  const onHandlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!isDragging) return;
      const delta = event.clientY - startYRef.current;
      const raw = Math.min(
        1,
        Math.max(0, startProgressRef.current + delta / EXPAND_DISTANCE_PX),
      );
      const banded = applyRubberBand(raw);
      lastMoveRef.current = {
        y: event.clientY,
        progress: banded,
        time: performance.now(),
      };
      setDragProgress(banded);
    },
    [isDragging],
  );

  const onHandlePointerUp = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!isDragging) return;
      finishDrag(event.clientY, event.pointerId, event.currentTarget);
    },
    [finishDrag, isDragging],
  );

  const onHandlePointerCancel = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!isDragging) return;
      finishDrag(event.clientY, event.pointerId, event.currentTarget);
    },
    [finishDrag, isDragging],
  );

  return {
    progress,
    isDragging,
    isSettling,
    handleProps: {
      onPointerDown: onHandlePointerDown,
      onPointerMove: onHandlePointerMove,
      onPointerUp: onHandlePointerUp,
      onPointerCancel: onHandlePointerCancel,
    },
  };
}
