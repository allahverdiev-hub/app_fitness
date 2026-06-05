import { useCallback, useEffect, useRef, type CSSProperties } from "react";
import styles from "./WheelPicker.module.css";

const ITEM_HEIGHT = 44;
const WHEEL_HEIGHT = 220;
const EDGE_PAD = (WHEEL_HEIGHT - ITEM_HEIGHT) / 2;

type WheelPickerProps = {
  options: readonly number[];
  value: number;
  onChange: (value: number) => void;
  format?: (value: number) => string;
  fadeBg?: string;
  scrollReady?: boolean;
  "aria-label": string;
};

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
  const scrollEndTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDragging = useRef(false);

  const indexFromValue = options.indexOf(value);
  const safeIndex = indexFromValue >= 0 ? indexFromValue : 0;

  const scrollToIndex = useCallback((index: number, smooth: boolean) => {
    const list = listRef.current;
    if (!list) return;
    const item = list.children[index] as HTMLElement | undefined;
    if (!item) return;
    item.scrollIntoView({
      block: "center",
      behavior: smooth ? "smooth" : "auto",
    });
  }, []);

  useEffect(() => {
    if (!scrollReady || isDragging.current) return;
    scrollToIndex(safeIndex, false);
  }, [safeIndex, scrollReady, scrollToIndex]);

  const readIndexFromScroll = useCallback(() => {
    const list = listRef.current;
    if (!list) return safeIndex;
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
  }, [safeIndex]);

  const handleScroll = () => {
    if (scrollEndTimer.current) clearTimeout(scrollEndTimer.current);
    scrollEndTimer.current = setTimeout(() => {
      const index = readIndexFromScroll();
      const clamped = Math.max(0, Math.min(options.length - 1, index));
      if (options[clamped] !== value) onChange(options[clamped]);
      scrollToIndex(clamped, true);
      isDragging.current = false;
    }, 80);
  };

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
        onScroll={() => {
          isDragging.current = true;
          handleScroll();
        }}
      >
        {options.map((option) => (
          <li
            key={option}
            className={`${styles.item} ${option === value ? styles.itemActive : ""}`}
          >
            {format(option)}
          </li>
        ))}
      </ul>
    </div>
  );
}
