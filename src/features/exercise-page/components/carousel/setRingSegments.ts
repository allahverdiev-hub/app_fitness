/** Синхрон с --thumb-set-gap и --thumb-set-segment-width в tokens.css */
export const RING_GAP_PX = 4;
export const SEGMENT_WIDTH_PX = 3;

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function ringSegmentStrokePath(
  cx: number,
  cy: number,
  radius: number,
  startDeg: number,
  endDeg: number,
): string {
  const start = polar(cx, cy, radius, startDeg);
  const end = polar(cx, cy, radius, endDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

function getRingRadiiViewBox(thumbSizePx: number) {
  const svgDiameterPx =
    thumbSizePx + 2 * (RING_GAP_PX + SEGMENT_WIDTH_PX);
  const unitsPerPx = 100 / svgDiameterPx;
  const thumbRadiusVb = (thumbSizePx / 2) * unitsPerPx;
  const innerR = thumbRadiusVb + RING_GAP_PX * unitsPerPx;
  const outerR = innerR + SEGMENT_WIDTH_PX * unitsPerPx;
  const midR = (innerR + outerR) / 2;
  const strokeWidth = SEGMENT_WIDTH_PX * unitsPerPx;
  const pxToDeg = (px: number) =>
    ((px * unitsPerPx) / midR) * (180 / Math.PI);
  /** Зазор между дугами = отступ от миниатюры; + компенсация stroke-linecap: round */
  const gapDeg = pxToDeg(RING_GAP_PX) + pxToDeg(strokeWidth / 2);

  return { innerR, outerR, midR, gapDeg, strokeWidth };
}

export function buildSetRingSegments(totalSets: number, thumbSizePx: number) {
  if (totalSets <= 0) return [];

  const { midR, gapDeg, strokeWidth } = getRingRadiiViewBox(thumbSizePx);
  const segmentDeg = (360 - gapDeg * totalSets) / totalSets;
  const cx = 50;
  const cy = 50;

  return Array.from({ length: totalSets }, (_, index) => {
    const startDeg = index * (segmentDeg + gapDeg) + gapDeg / 2;
    const endDeg = startDeg + segmentDeg;
    return {
      index,
      d: ringSegmentStrokePath(cx, cy, midR, startDeg, endDeg),
      strokeWidth,
    };
  });
}
