import { useCallback, useEffect, useRef, useState } from "react";

const LIST_GAP_PX = 10;
const RELEASE_MS = 220;
const RELEASE_COMMIT_MS = RELEASE_MS + 30;

type Baseline = { top: number; height: number };

type DragSession = {
  fromIndex: number;
  targetIndex: number;
  pointerId: number;
  startY: number;
  currentY: number;
};

type Releasing = { fromIndex: number; targetIndex: number };

export type DropIndicator = { top: number; height: number };

function reorderIndices<T>(list: T[], from: number, to: number): T[] {
  if (from === to) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function shiftFor(
  index: number,
  fromIndex: number,
  targetIndex: number,
  stride: number,
): number {
  if (fromIndex < targetIndex && index > fromIndex && index <= targetIndex) {
    return -stride;
  }
  if (fromIndex > targetIndex && index >= targetIndex && index < fromIndex) {
    return stride;
  }
  return 0;
}

export function useDragReorder<T extends { id: string }>(
  items: T[],
  onReorder: (items: T[]) => void,
) {
  const [drag, setDrag] = useState<DragSession | null>(null);
  const [releasing, setReleasing] = useState<Releasing | null>(null);
  const [suppressTransitions, setSuppressTransitions] = useState(false);

  const dragRef = useRef<DragSession | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const baselineRef = useRef<Baseline[]>([]);
  const strideRef = useRef(0);
  const releaseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (releaseTimer.current) clearTimeout(releaseTimer.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  // Снимок статичной раскладки (offsetTop игнорирует CSS-трансформы),
  // поэтому расчёт целевой позиции не зависит от уже сдвинутых карточек.
  const captureBaseline = useCallback(() => {
    const listEl = listRef.current;
    const listTop = listEl?.getBoundingClientRect().top ?? 0;
    const refs = itemRefs.current;
    const baseline: Baseline[] = refs.map((node) => {
      if (!node) return { top: 0, height: 0 };
      const rect = node.getBoundingClientRect();
      return { top: rect.top - listTop, height: rect.height };
    });
    baselineRef.current = baseline;

    if (baseline.length >= 2) {
      strideRef.current = baseline[1].top - baseline[0].top;
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

  const computeTargetIndex = useCallback(
    (fromIndex: number, offsetY: number) => {
      const stride = strideRef.current;
      if (!stride) return fromIndex;
      const steps = Math.round(offsetY / stride);
      return clamp(fromIndex + steps, 0, items.length - 1);
    },
    [items.length],
  );

  const startDrag = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>, index: number) => {
      if (event.button !== 0) return;
      // Не перехватываем новый жест, пока предыдущая карточка приземляется.
      if (releasing) return;
      event.preventDefault();
      event.stopPropagation();
      event.currentTarget.setPointerCapture(event.pointerId);
      captureBaseline();
      const session: DragSession = {
        fromIndex: index,
        targetIndex: index,
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
      const targetIndex = computeTargetIndex(session.fromIndex, offsetY);
      if (
        targetIndex === session.targetIndex &&
        event.clientY === session.currentY
      ) {
        return;
      }
      const next: DragSession = {
        ...session,
        currentY: event.clientY,
        targetIndex,
      };
      dragRef.current = next;
      setDrag(next);
    },
    [computeTargetIndex],
  );

  const finishDrag = useCallback(
    (event: React.PointerEvent) => {
      const session = dragRef.current;
      if (!session || event.pointerId !== session.pointerId) return;
      dragRef.current = null;

      const { fromIndex, targetIndex } = session;

      // Фаза приземления: плавно доводим карточку до слота, и только
      // после завершения анимации фиксируем новый порядок — без скачка.
      setDrag(null);
      setReleasing({ fromIndex, targetIndex });

      releaseTimer.current = setTimeout(() => {
        if (fromIndex !== targetIndex) {
          onReorder(reorderIndices(items, fromIndex, targetIndex));
        }
        // На кадр коммита глушим переходы, чтобы сброс transform не
        // дал паразитный сдвиг при смене порядка в DOM.
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
    [items, onReorder],
  );

  const getItemStyle = useCallback(
    (index: number): React.CSSProperties | undefined => {
      const stride = strideRef.current;
      if (!stride) return undefined;

      if (drag) {
        const { fromIndex, targetIndex, currentY, startY } = drag;
        if (index === fromIndex) {
          return {
            transform: `translateY(${currentY - startY}px)`,
            zIndex: 3,
            position: "relative",
          };
        }
        const shift = shiftFor(index, fromIndex, targetIndex, stride);
        return shift === 0 ? undefined : { transform: `translateY(${shift}px)` };
      }

      if (releasing) {
        const { fromIndex, targetIndex } = releasing;
        const settle = `transform ${RELEASE_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`;
        if (index === fromIndex) {
          return {
            transform: `translateY(${(targetIndex - fromIndex) * stride}px)`,
            transition: settle,
            zIndex: 3,
            position: "relative",
          };
        }
        const shift = shiftFor(index, fromIndex, targetIndex, stride);
        return shift === 0 ? undefined : { transform: `translateY(${shift}px)` };
      }

      return undefined;
    },
    [drag, releasing],
  );

  const dropIndicator: DropIndicator | null = (() => {
    if (!drag) return null;
    const baseline = baselineRef.current;
    const slot = baseline[drag.targetIndex];
    const source = baseline[drag.fromIndex];
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
    draggingIndex: drag?.fromIndex ?? null,
    releasingIndex: releasing?.fromIndex ?? null,
  };
}
