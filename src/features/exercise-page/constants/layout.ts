/**
 * Две области:
 * 1. Белый фон + таймер + hero (4:3) с отступами до контента
 * 2. Контентная панель при скролле поднимается поверх
 */

export const HERO_TOP_OFFSET_PX = 60;

/** Вертикальные зазоры: таймер ↔ видео и видео ↔ контентная панель */
export const HERO_MEDIA_GAP_PX = 40;
export const TIMER_TO_HERO_GAP_PX = HERO_MEDIA_GAP_PX;
export const HERO_BOTTOM_GAP_PX = HERO_MEDIA_GAP_PX;

/** Карточка таймера в зоне 1 (над видео), для fallback-расчёта spacer */
export const TIMER_IN_MEDIA_HEIGHT_PX = 44;

export const HERO_ASPECT_WIDTH = 4;
export const HERO_ASPECT_HEIGHT = 3;

/** Верхние скругления контентной панели (синхрон с --sheet-top-radius) */
export const SHEET_TOP_RADIUS_PX = 28;

/** Насколько панель наезжает на hero в покое — эффект выдвижного окна */
export const CONTENT_SHEET_OVERLAP_PX = 28;

/** Доля прокрутки до «прилипания» панели, за которую радиус уходит в 0 */
export const SHEET_RADIUS_COLLAPSE_RATIO = 1;

export function getHeroContainerHeightPx(containerWidth: number): number {
  return (containerWidth * HERO_ASPECT_HEIGHT) / HERO_ASPECT_WIDTH;
}

/** Позиция верха контентного блока = отступ + таймер + зазор + hero + зазор */
export function getContentScrollSpacerPx(containerWidth: number): number {
  return (
    HERO_TOP_OFFSET_PX +
    TIMER_IN_MEDIA_HEIGHT_PX +
    TIMER_TO_HERO_GAP_PX +
    getHeroContainerHeightPx(containerWidth) +
    HERO_BOTTOM_GAP_PX
  );
}
