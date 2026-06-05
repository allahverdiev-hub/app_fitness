import { useLayoutEffect, useState, type RefObject } from "react";

const FALLBACK_THUMB_PX = 76;

export function useThumbSizePx(ref: RefObject<HTMLElement | null>) {
  const [thumbSizePx, setThumbSizePx] = useState(FALLBACK_THUMB_PX);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const read = () => {
      const raw = getComputedStyle(el).getPropertyValue("--thumb-size").trim();
      const px = Number.parseFloat(raw);
      if (!Number.isNaN(px) && px > 0) setThumbSizePx(px);
    };

    read();
    const observer = new ResizeObserver(read);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return thumbSizePx;
}
