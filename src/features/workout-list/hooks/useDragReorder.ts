import { useCallback, useEffect, useRef, useState } from "react";

const LIST_GAP_PX = 10;
const RELEASE_MS = 220;
const RELEASE_COMMIT_MS = RELEASE_MS + 30;

type Baseline = { top: number; height: number };

type DragSession = {
  fromArrayIndex: number;
  fromVisual: number;
  targetVisual: number;
  pointerId: number;
  startY: number;
  currentY: number;
};

type Releasing = { fromArrayIndex: number; fromVisual: number; targetVisual: number };

export type DropIndicator = { top: number; height: number };

type UseDragReorderOptions<T> = {
  visualOrder?: number[];
  commitReorder?: (items: T[], fromVisual: number, toVisual: number) => T[];
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function shiftFor(
  visualIndex: number,
  fromVisual: number,
  targetVisual: number,
  stride: number,
): number {
  if (fromVisual < targetVisual && visualIndex > fromVisual && visualIndex <= targetVisual) {
    return -stride;
  }
  if (fromVisual > targetVisual && visualIndex >= targetVisual && visualIndex < fromVisual) {
    return stride;
  }
  return 0;
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

export function useDragReorder<T extends { id: string }>(
  items: T[],
  onReorder: (items: T[]) => void,
  options: UseDragReorderOptions<T> = {},
) {
  const [drag, setDrag] = useState<DragSession | null>(null);
  const [releasing, setReleasing] = useState<Releasing | null>(null);
  const [suppressTransitions, setSuppressTransitions] = useState(false);

  const dragRef = useRef<DragSession | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const baselineRef = useRef<Baseline[]>([]);
  const strideRef = useRef(0);
  const visualOrderRef = useRef<number[]>([]);
  const releaseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);

  const visualOrder =
    options.visualOrder ??
    items.map((_, index) => index);

  visualOrderRef.current = visualOrder;

  useEffect(
    () => () => {
      if (releaseTimer.current) clearTimeout(releaseTimer.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  const captureBaseline = useCallback(() => {
    const listEl = listRef.current;
    const listTop = listEl?.getBoundingClientRect().top ?? 0;
    const order = visualOrderRef.current;
    const baseline: Baseline[] = order.map((arrayIndex) => {
      const node = itemRefs.current[arrayIndex];
      if (!node) return { top: 0, height: 0 };
      const rect = node.getBoundingClientRect();
      return { top: rect.top - listTop, height: rect.height };
    });
    baselineRef.current = baseline;

    const gaps: number[] = [];
    for (let i = 1; i < baseline.length; i += 1) {
      gaps.push(baseline[i].top - baseline[i - 1].top);
    }

    if (gaps.length > 0) {
      strideRef.current = median(gaps);
    } else if (baseline.length === 1) {
      strideRef.current = baseline[0].height + LIST_GAP_PX;
    } else {
      strideRef.current = 0;
    }
  }, []);

  const setItemRef = useCallback(
    (index: number) => (node: HTMLLIElement | null) => {
      itemRefs.current[index] = node;
    },
    [],
  );

  const computeTargetVisual = useCallback(
    (fromVisual: number, offsetY: number) => {
      const baseline = baselineRef.current;
      if (!baseline.length) return fromVisual;

      const draggedCenter =
        baseline[fromVisual].top +
        offsetY +
        baseline[fromVisual].height / 2;

      let targetVisual = 0;
      for (let i = 0; i < baseline.length; i += 1) {
        const slotCenter = baseline[i].top + baseline[i].height / 2;
        if (draggedCenter > slotCenter) {
          targetVisual = i;
        }
      }

      return clamp(targetVisual, 0, baseline.length - 1);
    },
    [],
  );

  const startDrag = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>, arrayIndex: number) => {
      if (event.button !== 0) return;
      if (releasing) return;

      const fromVisual = visualOrderRef.current.indexOf(arrayIndex);
      if (fromVisual < 0) return;

      event.preventDefault();
      event.stopPropagation();
      event.currentTarget.setPointerCapture(event.pointerId);
      captureBaseline();

      const session: DragSession = {
        fromArrayIndex: arrayIndex,
        fromVisual,
        targetVisual: fromVisual,
        pointerId: event.pointerId,
        startY: event.clientY,
        currentY: event.clientY,
      };
      dragRef.current = session;
      setDrag(session);
    },
    [captureBaseline, releasing],
  );

  const updateDrag = useCallback(
    (event: React.PointerEvent) => {
      const session = dragRef.current;
      if (!session || event.pointerId !== session.pointerId) return;

      const offsetY = event.clientY - session.startY;
      const targetVisual = computeTargetVisual(session.fromVisual, offsetY);
      if (
        targetVisual === session.targetVisual &&
        event.clientY === session.currentY
      ) {
        return;
      }

      const next: DragSession = {
        ...session,
        currentY: event.clientY,
        targetVisual,
      };
      dragRef.current = next;
      setDrag(next);
    },
    [computeTargetVisual],
  );

  const finishDrag = useCallback(
    (event: React.PointerEvent) => {
      const session = dragRef.current;
      if (!session || event.pointerId !== session.pointerId) return;
      dragRef.current = null;

      const { fromArrayIndex, fromVisual, targetVisual } = session;

      setDrag(null);
      setReleasing({ fromArrayIndex, fromVisual, targetVisual });

      releaseTimer.current = setTimeout(() => {
        if (fromVisual !== targetVisual) {
          const commit =
            options.commitReorder ??
            ((list, from, to) => {
              const order = visualOrderRef.current;
              const nextOrder = [...order];
              const [item] = nextOrder.splice(from, 1);
              nextOrder.splice(to, 0, item);
              return nextOrder.map((arrayIndex) => list[arrayIndex]);
            });
          onReorder(commit(items, fromVisual, targetVisual));
        }

        setSuppressTransitions(true);
        setReleasing(null);
        rafRef.current = requestAnimationFrame(() => {
          rafRef.current = requestAnimationFrame(() => {
            setSuppressTransitions(false);
          });
        });
        releaseTimer.current = null;
      }, RELEASE_COMMIT_MS);
    },
    [items, onReorder, options.commitReorder],
  );

  const getItemStyle = useCallback(
    (arrayIndex: number): React.CSSProperties | undefined => {
      const visualIndex = visualOrderRef.current.indexOf(arrayIndex);
      if (visualIndex < 0) return undefined;

      const stride = strideRef.current;
      if (!stride) return undefined;

      if (drag) {
        const { fromArrayIndex, fromVisual, targetVisual, currentY, startY } =
          drag;
        if (arrayIndex === fromArrayIndex) {
          return {
            transform: `translateY(${currentY - startY}px)`,
            zIndex: 3,
            position: "relative",
          };
        }
        const shift = shiftFor(visualIndex, fromVisual, targetVisual, stride);
        return shift === 0 ? undefined : { transform: `translateY(${shift}px)` };
      }

      if (releasing) {
        const { fromArrayIndex, fromVisual, targetVisual } = releasing;
        const settle = `transform ${RELEASE_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`;
        if (arrayIndex === fromArrayIndex) {
          return {
            transform: `translateY(${(targetVisual - fromVisual) * stride}px)`,
            transition: settle,
            zIndex: 3,
            position: "relative",
          };
        }
        const shift = shiftFor(visualIndex, fromVisual, targetVisual, stride);
        return shift === 0 ? undefined : { transform: `translateY(${shift}px)` };
      }

      return undefined;
    },
    [drag, releasing],
  );

  const dropIndicator: DropIndicator | null = (() => {
    if (!drag) return null;
    const baseline = baselineRef.current;
    const slot = baseline[drag.targetVisual];
    const source = baseline[drag.fromVisual];
    if (!slot || !source) return null;
    return { top: slot.top, height: source.height };
  })();

  return {
    listRef,
    setItemRef,
    startDrag,
    updateDrag,
    finishDrag,
    getItemStyle,
    dropIndicator,
    suppressTransitions,
    isDragging: drag !== null,
    draggingIndex: drag?.fromArrayIndex ?? null,
    releasingIndex: releasing?.fromArrayIndex ?? null,
  };
}
