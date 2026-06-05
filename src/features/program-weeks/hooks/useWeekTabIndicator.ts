import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";

type IndicatorRect = {
  left: number;
  width: number;
};

type UseWeekTabIndicatorOptions = {
  activeIndex: number;
  tabCount: number;
};

type UseWeekTabIndicatorResult = {
  trackRef: RefObject<HTMLDivElement | null>;
  setTabRef: (index: number) => (element: HTMLAnchorElement | null) => void;
  indicatorStyle: CSSProperties | undefined;
};

export function useWeekTabIndicator({
  activeIndex,
  tabCount,
}: UseWeekTabIndicatorOptions): UseWeekTabIndicatorResult {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [indicatorRect, setIndicatorRect] = useState<IndicatorRect | null>(null);

  const setTabRef = useCallback(
    (index: number) => (element: HTMLAnchorElement | null) => {
      tabRefs.current[index] = element;
    },
    [],
  );

  const updateIndicator = useCallback(() => {
    const track = trackRef.current;
    const activeTab = tabRefs.current[activeIndex];

    if (!track || !activeTab) {
      setIndicatorRect(null);
      return;
    }

    setIndicatorRect({
      left: activeTab.offsetLeft,
      width: activeTab.offsetWidth,
    });
  }, [activeIndex]);

  useLayoutEffect(() => {
    updateIndicator();
  }, [updateIndicator, tabCount]);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const resizeObserver = new ResizeObserver(() => updateIndicator());
    resizeObserver.observe(track);
    tabRefs.current.forEach((tab) => {
      if (tab) resizeObserver.observe(tab);
    });

    window.addEventListener("resize", updateIndicator);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateIndicator);
    };
  }, [updateIndicator, tabCount, activeIndex]);

  const indicatorStyle =
    indicatorRect === null
      ? undefined
      : ({
          left: `${indicatorRect.left}px`,
          width: `${indicatorRect.width}px`,
        } as CSSProperties);

  return {
    trackRef,
    setTabRef,
    indicatorStyle,
  };
}
