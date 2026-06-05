/** Длительность slide sheet (синхрон с --bottom-sheet-duration в CSS) */
export const BOTTOM_SHEET_DURATION_MS = 420;

/** Задержка инициализации колёс — после основного хода sheet */
export const BOTTOM_SHEET_WHEELS_DELAY_MS = Math.round(
  BOTTOM_SHEET_DURATION_MS * 0.72,
);
