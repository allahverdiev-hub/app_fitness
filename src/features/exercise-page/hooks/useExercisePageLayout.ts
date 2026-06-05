import { useLayoutEffect, type RefObject } from "react";
import {
  getContentScrollSpacerPx,
  HERO_BOTTOM_GAP_PX,
  HERO_TOP_OFFSET_PX,
  SHEET_RADIUS_COLLAPSE_RATIO,
  SHEET_TOP_RADIUS_PX,
  TIMER_IN_MEDIA_HEIGHT_PX,
  TIMER_TO_HERO_GAP_PX,
} from "@/features/exercise-page/constants/layout";

export function getScrollCollapseProgress(
  scrollTop: number,
  collapseDistance: number,
): number {
  if (collapseDistance <= 0) return 0;
  return Math.min(
    1,
    Math.max(0, scrollTop / (collapseDistance * SHEET_RADIUS_COLLAPSE_RATIO)),
  );
}

export function getContentSheetRadiusPx(
  scrollTop: number,
  collapseDistance: number,
): number {
  const progress = getScrollCollapseProgress(scrollTop, collapseDistance);
  return SHEET_TOP_RADIUS_PX * (1 - progress);
}

export function useExercisePageLayout(
  bodyRef: RefObject<HTMLElement | null>,
  contentScrollRef: RefObject<HTMLElement | null>,
  contentSheetRef: RefObject<HTMLElement | null>,
  /** Сброс скролла только при входе на страницу (не при смене упражнения в карусели) */
  scrollResetKey?: string,
) {
  useLayoutEffect(() => {
    const body = bodyRef.current;
    const scroller = contentScrollRef.current;
    if (!body || !scroller) return undefined;

    const getSheet = () =>
      contentSheetRef.current ??
      scroller.querySelector<HTMLElement>(`:scope > section`);

    const getSpacer = () =>
      scroller.firstElementChild as HTMLElement | null;

    let scrollRaf = 0;

    const getCollapseDistance = () => {
      const spacer = getSpacer();
      const measured = spacer?.offsetHeight ?? 0;
      if (measured > 0) return measured;
      return getContentScrollSpacerPx(body.clientWidth);
    };

    const applyScrollEffects = () => {
      const collapseDistance = getCollapseDistance();
      const scrollTop = scroller.scrollTop;
      const progress = getScrollCollapseProgress(scrollTop, collapseDistance);

      body.style.setProperty("--hero-dim-progress", String(progress));

      const sheet = getSheet();
      if (!sheet) return;
      const radius = getContentSheetRadiusPx(scrollTop, collapseDistance);
      const radiusPx = `${radius}px`;
      sheet.style.setProperty("--content-sheet-radius", radiusPx);
      sheet.style.borderTopLeftRadius = radiusPx;
      sheet.style.borderTopRightRadius = radiusPx;
    };

    const measureMediaStackHeight = () => {
      const stack = body.querySelector<HTMLElement>("[data-exercise-media-stack]");
      return stack?.offsetHeight ?? 0;
    };

    const applyLayout = () => {
      const width = body.clientWidth;
      const measuredStack = measureMediaStackHeight();
      const spacerHeight =
        measuredStack > 0 ? measuredStack : getContentScrollSpacerPx(width);
      const spacerPx = `${spacerHeight}px`;
      body.style.setProperty("--content-scroll-spacer", spacerPx);
      scroller.style.setProperty("--content-scroll-spacer", spacerPx);
      const spacer = getSpacer();
      if (spacer) spacer.style.height = spacerPx;
      body.style.setProperty("--hero-top-offset", `${HERO_TOP_OFFSET_PX}px`);
      body.style.setProperty("--hero-bottom-gap", `${HERO_BOTTOM_GAP_PX}px`);
      body.style.setProperty(
        "--timer-in-media-height",
        `${TIMER_IN_MEDIA_HEIGHT_PX}px`,
      );
      body.style.setProperty(
        "--timer-to-hero-gap",
        `${TIMER_TO_HERO_GAP_PX}px`,
      );
    };

    const resetScroll = () => {
      scroller.scrollTop = 0;
      applyScrollEffects();
    };

    const onScroll = () => {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        applyScrollEffects();
      });
    };

    applyLayout();
    resetScroll();
    const observer = new ResizeObserver(() => {
      applyLayout();
      applyScrollEffects();
    });
    observer.observe(body);
    observer.observe(scroller);
    const mediaStack = body.querySelector<HTMLElement>(
      "[data-exercise-media-stack]",
    );
    if (mediaStack) observer.observe(mediaStack);
    window.addEventListener("resize", applyLayout);
    scroller.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", applyLayout);
      scroller.removeEventListener("scroll", onScroll);
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      const sheet = getSheet();
      sheet?.style.removeProperty("--content-sheet-radius");
      sheet?.style.removeProperty("border-top-left-radius");
      sheet?.style.removeProperty("border-top-right-radius");
      getSpacer()?.style.removeProperty("height");
      scroller.style.removeProperty("--content-scroll-spacer");
      body.style.removeProperty("--hero-dim-progress");
    };
  }, [bodyRef, contentScrollRef, contentSheetRef, scrollResetKey]);
}
