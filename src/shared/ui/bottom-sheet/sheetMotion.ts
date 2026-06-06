/** Длительность slide sheet (синхрон с --bottom-sheet-duration в CSS) */
export const BOTTOM_SHEET_DURATION_MS = 420;

/** Фиксирует высоту листа перед close-анимацией (fit-content + flex иначе «схлопывается»). */
export function lockSheetHeight(el: HTMLElement) {
  const height = el.getBoundingClientRect().height;
  if (height <= 0) return;
  el.style.setProperty("height", `${height}px`);
  el.style.setProperty("min-height", `${height}px`);
  el.style.setProperty("max-height", `${height}px`);
}

export function unlockSheetHeight(el: HTMLElement) {
  el.style.removeProperty("height");
  el.style.removeProperty("min-height");
  el.style.removeProperty("max-height");
}
