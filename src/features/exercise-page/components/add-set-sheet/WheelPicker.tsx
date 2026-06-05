import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import styles from "./WheelPicker.module.css";

const ITEM_HEIGHT = 44;
const WHEEL_HEIGHT = 220;
const EDGE_PAD = (WHEEL_HEIGHT - ITEM_HEIGHT) / 2;

/** Постоянная времени инерции (мс): чем больше — тем дольше «докатывается» */
const MOMENTUM_TIME_CONSTANT = 320;
/** Короткий доводчик для тапа / внешнего значения */
const SETTLE_DURATION_MS = 240;
/** Если последний реальный сдвиг был давно — палец стоял, инерции нет */
const VELOCITY_STALE_MS = 70;
/** Порог «тап, а не свайп» */
const TAP_MAX_MOVE_PX = 6;

type WheelPickerProps = {
  options: readonly number[];
  value: number;
  onChange: (value: number) => void;
  format?: (value: number) => string;
  fadeBg?: string;
  scrollReady?: boolean;
  "aria-label": string;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

export function WheelPicker({
  options,
  value,
  onChange,
  format = (v) => String(v),
  fadeBg = "var(--color-surface-elevated)",
  scrollReady = true,
  "aria-label": ariaLabel,
}: WheelPickerProps) {
  const listRef = useRef<HTMLUListElement>(null);

  const indexFromValue = options.indexOf(value);
  const safeIndex = indexFromValue >= 0 ? indexFromValue : 0;
  const maxScroll = Math.max(0, (options.length - 1) * ITEM_HEIGHT);

  const [activeIndex, setActiveIndex] = useState(safeIndex);

  // Физика держится в ref'ах, чтобы кадры анимации не зависели от ре-рендеров.
  const scrollRef = useRef(safeIndex * ITEM_HEIGHT);
  const rafRef = useRef(0);
  const draggingRef = useRef(false);
  const pointerIdRef = useRef<number | null>(null);

  const startYRef = useRef(0);
  const startScrollRef = useRef(0);
  const lastYRef = useRef(0);
  const lastScrollRef = useRef(0);
  const lastMoveTimeRef = useRef(0);
  const velocityRef = useRef(0); // px/мс (знак: + = к бо́льшим значениям)
  const movedRef = useRef(0);

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const cancelAnim = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
  }, []);

  const applyTransform = useCallback((scroll: number) => {
    const list = listRef.current;
    if (list) list.style.transform = `translate3d(0, ${-scroll}px, 0)`;
  }, []);

  const setScroll = useCallback(
    (scroll: number) => {
      scrollRef.current = scroll;
      applyTransform(scroll);
      const idx = clamp(Math.round(scroll / ITEM_HEIGHT), 0, options.length - 1);
      setActiveIndex((prev) => (prev === idx ? prev : idx));
    },
    [applyTransform, options.length],
  );

  const commitIndex = useCallback(
    (idx: number) => {
      const clamped = clamp(idx, 0, options.length - 1);
      setScroll(clamped * ITEM_HEIGHT);
      if (options[clamped] !== value) onChangeRef.current(options[clamped]);
    },
    [options, setScroll, value],
  );

  /** Плавный доводчик к точному индексу (тап / внешнее значение). */
  const settleTo = useCallback(
    (idx: number) => {
      cancelAnim();
      const clamped = clamp(idx, 0, options.length - 1);
      const from = scrollRef.current;
      const to = clamped * ITEM_HEIGHT;
      if (Math.abs(to - from) < 0.5) {
        commitIndex(clamped);
        return;
      }
      const start = performance.now();
      const step = (now: number) => {
        const t = clamp((now - start) / SETTLE_DURATION_MS, 0, 1);
        setScroll(from + (to - from) * easeOutCubic(t));
        if (t < 1) {
          rafRef.current = requestAnimationFrame(step);
        } else {
          rafRef.current = 0;
          commitIndex(clamped);
        }
      };
      rafRef.current = requestAnimationFrame(step);
    },
    [cancelAnim, commitIndex, options.length, setScroll],
  );

  /**
   * Инерция по модели экспоненциального затухания (как iOS picker):
   * прогнозируем точку остановки, округляем до ближайшего значения и
   * «докатываемся» к нему — так глайд сохраняется, но фиксация чёткая.
   */
  const startMomentum = useCallback(
    (initialVelocity: number) => {
      cancelAnim();

      const predicted =
        scrollRef.current + initialVelocity * MOMENTUM_TIME_CONSTANT;
      const targetIdx = clamp(
        Math.round(predicted / ITEM_HEIGHT),
        0,
        options.length - 1,
      );
      const targetScroll = targetIdx * ITEM_HEIGHT;
      const amplitude = targetScroll - scrollRef.current;

      if (Math.abs(amplitude) < 0.5) {
        commitIndex(targetIdx);
        return;
      }

      const start = performance.now();
      const step = (now: number) => {
        const elapsed = now - start;
        const delta = amplitude * Math.exp(-elapsed / MOMENTUM_TIME_CONSTANT);
        if (Math.abs(delta) > 0.5) {
          setScroll(targetScroll - delta);
          rafRef.current = requestAnimationFrame(step);
        } else {
          rafRef.current = 0;
          commitIndex(targetIdx);
        }
      };
      rafRef.current = requestAnimationFrame(step);
    },
    [cancelAnim, commitIndex, options.length, setScroll],
  );

  const handlePointerDown = useCallback(
    (e: ReactPointerEvent<HTMLUListElement>) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      cancelAnim();
      draggingRef.current = true;
      pointerIdRef.current = e.pointerId;
      listRef.current?.setPointerCapture(e.pointerId);

      const now = performance.now();
      startYRef.current = e.clientY;
      startScrollRef.current = scrollRef.current;
      lastYRef.current = e.clientY;
      lastScrollRef.current = scrollRef.current;
      lastMoveTimeRef.current = now;
      velocityRef.current = 0;
      movedRef.current = 0;
    },
    [cancelAnim],
  );

  const handlePointerMove = useCallback(
    (e: ReactPointerEvent<HTMLUListElement>) => {
      if (!draggingRef.current || e.pointerId !== pointerIdRef.current) return;

      const now = performance.now();
      const dy = e.clientY - startYRef.current;
      movedRef.current = Math.max(movedRef.current, Math.abs(dy));

      // Перетаскивание вниз (dy > 0) → показываем меньшие значения (scroll вниз).
      const rawScroll = startScrollRef.current - dy;
      const nextScroll = clamp(rawScroll, 0, maxScroll);

      const dt = now - lastMoveTimeRef.current;
      if (dt > 0) {
        const instV = (nextScroll - lastScrollRef.current) / dt;
        // Лёгкое сглаживание, но с упором на свежую скорость — для отзывчивости.
        velocityRef.current = 0.75 * instV + 0.25 * velocityRef.current;
        lastMoveTimeRef.current = now;
        lastScrollRef.current = nextScroll;
        lastYRef.current = e.clientY;
      }

      setScroll(nextScroll);
    },
    [maxScroll, setScroll],
  );

  const finishDrag = useCallback(
    (e: ReactPointerEvent<HTMLUListElement>) => {
      if (!draggingRef.current || e.pointerId !== pointerIdRef.current) return;
      draggingRef.current = false;
      pointerIdRef.current = null;
      if (listRef.current?.hasPointerCapture(e.pointerId)) {
        listRef.current.releasePointerCapture(e.pointerId);
      }

      // Тап по элементу — доводим этот элемент в центр.
      if (movedRef.current < TAP_MAX_MOVE_PX) {
        const list = listRef.current;
        if (list) {
          const rect = list.getBoundingClientRect();
          const centerY = rect.top + WHEEL_HEIGHT / 2;
          const deltaItems = Math.round((e.clientY - centerY) / ITEM_HEIGHT);
          const currentIdx = Math.round(scrollRef.current / ITEM_HEIGHT);
          settleTo(currentIdx + deltaItems);
          return;
        }
      }

      const stale = performance.now() - lastMoveTimeRef.current > VELOCITY_STALE_MS;
      const v = stale ? 0 : velocityRef.current;
      startMomentum(v);
    },
    [settleTo, startMomentum],
  );

  // Внешнее изменение значения (или открытие) — позиционируем без анимации,
  // только когда пользователь не взаимодействует.
  useEffect(() => {
    if (draggingRef.current || rafRef.current) return;
    setScroll(safeIndex * ITEM_HEIGHT);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeIndex, scrollReady]);

  useEffect(() => () => cancelAnim(), [cancelAnim]);

  return (
    <div
      className={styles.wheel}
      role="group"
      aria-label={ariaLabel}
      style={
        {
          "--wheel-height": `${WHEEL_HEIGHT}px`,
          "--edge-pad": `${EDGE_PAD}px`,
          "--wheel-fade-bg": fadeBg,
        } as CSSProperties
      }
    >
      <div className={styles.fadeTop} aria-hidden />
      <div className={styles.fadeBottom} aria-hidden />
      <div className={styles.highlight} aria-hidden />
      <ul
        ref={listRef}
        className={styles.list}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
      >
        {options.map((option, index) => (
          <li
            key={option}
            className={`${styles.item} ${index === activeIndex ? styles.itemActive : ""}`}
          >
            {format(option)}
          </li>
        ))}
      </ul>
    </div>
  );
}
