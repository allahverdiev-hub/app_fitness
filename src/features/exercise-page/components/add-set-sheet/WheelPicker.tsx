import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./WheelPicker.module.css";

const ITEM_HEIGHT = 44;
const WHEEL_HEIGHT = 220;
const EDGE_PAD = (WHEEL_HEIGHT - ITEM_HEIGHT) / 2;
const SETTLE_IDLE_MS = 100;

type WheelPickerProps = {
  options: readonly number[];
  value: number;
  onChange: (value: number) => void;
  format?: (value: number) => string;
  fadeBg?: string;
  scrollReady?: boolean;
  "aria-label": string;
};

function getScrollTopForIndex(list: HTMLUListElement, index: number): number {
  const item = list.children[index] as HTMLElement | undefined;
  if (!item) return 0;
  return Math.max(0, item.offsetTop - (list.clientHeight - ITEM_HEIGHT) / 2);
}

function readIndexFromScroll(list: HTMLUListElement): number {
  const centerY = list.scrollTop + list.clientHeight / 2;
  let closest = 0;
  let minDist = Number.POSITIVE_INFINITY;
  for (let i = 0; i < list.children.length; i += 1) {
    const item = list.children[i] as HTMLElement;
    const itemCenter = item.offsetTop + ITEM_HEIGHT / 2;
    const dist = Math.abs(itemCenter - centerY);
    if (dist < minDist) {
      minDist = dist;
      closest = i;
    }
  }
  return closest;
}

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
  const interactingRef = useRef(false);
  const programmaticRef = useRef(false);
  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const indexFromValue = options.indexOf(value);
  const safeIndex = indexFromValue >= 0 ? indexFromValue : 0;
  const [activeIndex, setActiveIndex] = useState(safeIndex);

  const scrollToIndex = useCallback((index: number) => {
    const list = listRef.current;
    if (!list) return;
    programmaticRef.current = true;
    list.scrollTo({
      top: getScrollTopForIndex(list, index),
      behavior: "auto",
    });
    requestAnimationFrame(() => {
      programmaticRef.current = false;
    });
  }, []);

  const snapToNearest = useCallback(() => {
    const list = listRef.current;
    if (!list) return;

    const index = readIndexFromScroll(list);
    const clamped = Math.max(0, Math.min(options.length - 1, index));
    const targetTop = getScrollTopForIndex(list, clamped);

    if (Math.abs(list.scrollTop - targetTop) > 0.5) {
      programmaticRef.current = true;
      list.scrollTo({ top: targetTop, behavior: "auto" });
      requestAnimationFrame(() => {
        programmaticRef.current = false;
      });
    }

    setActiveIndex(clamped);
    if (options[clamped] !== value) {
      onChange(options[clamped]);
    }

    interactingRef.current = false;
  }, [onChange, options, value]);

  const scheduleSettle = useCallback(() => {
    if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
    settleTimerRef.current = setTimeout(snapToNearest, SETTLE_IDLE_MS);
  }, [snapToNearest]);

  useEffect(() => {
    if (interactingRef.current) return;
    setActiveIndex(safeIndex);
  }, [safeIndex]);

  useEffect(() => {
    if (!scrollReady || interactingRef.current) return;
    scrollToIndex(safeIndex);
  }, [safeIndex, scrollReady, scrollToIndex]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return undefined;

    const onScroll = () => {
      if (programmaticRef.current) return;
      interactingRef.current = true;
      setActiveIndex(readIndexFromScroll(list));
      scheduleSettle();
    };

    const onScrollEnd = () => {
      if (programmaticRef.current) return;
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
      snapToNearest();
    };

    list.addEventListener("scroll", onScroll, { passive: true });
    list.addEventListener("scrollend", onScrollEnd);

    return () => {
      list.removeEventListener("scroll", onScroll);
      list.removeEventListener("scrollend", onScrollEnd);
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
    };
  }, [scheduleSettle, snapToNearest]);

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
      <ul ref={listRef} className={styles.list}>
        {options.map((option) => (
          <li
            key={option}
            className={`${styles.item} ${options[activeIndex] === option ? styles.itemActive : ""}`}
          >
            {format(option)}
          </li>
        ))}
      </ul>
    </div>
  );
}
