import type { ProgressPoint } from "@/features/exercise-page/mocks/progress-chart";

export type ChartLayout = {
  width: number;
  height: number;
  padTop: number;
  padRight: number;
  padBottom: number;
  padLeft: number;
};

export type PlotPoint = {
  x: number;
  y: number;
  valueKg: number;
  dateLabel: string;
  index: number;
};

const Y_TICKS = [51, 50, 49, 48, 47, 46, 45];

/** Расстояние между точками по оси X (фиксированное — график не сжимается) */
export const CHART_POINT_SPACING = 52;

export const CHART_HEIGHT = 300;
export const CHART_PAD_TOP = 28;
export const CHART_PAD_RIGHT = 16;
export const CHART_PAD_BOTTOM = 32;
export const CHART_PAD_LEFT = 12;

export function getYTicks() {
  return Y_TICKS;
}

export function getChartLayout(seriesLength: number): ChartLayout {
  const plotSpan =
    seriesLength > 1 ? (seriesLength - 1) * CHART_POINT_SPACING : 0;
  const minPlotWidth = CHART_POINT_SPACING * 4;

  return {
    width: CHART_PAD_LEFT + Math.max(plotSpan, minPlotWidth) + CHART_PAD_RIGHT,
    height: CHART_HEIGHT,
    padTop: CHART_PAD_TOP,
    padRight: CHART_PAD_RIGHT,
    padBottom: CHART_PAD_BOTTOM,
    padLeft: CHART_PAD_LEFT,
  };
}

function valueToY(
  value: number,
  yMin: number,
  yMax: number,
  plotHeight: number,
  padTop: number,
): number {
  const t = (value - yMin) / (yMax - yMin);
  return padTop + plotHeight * (1 - t);
}

/** Сглаженная линия через точки (кубические сегменты) */
export function buildSmoothLinePath(points: PlotPoint[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cx = (p0.x + p1.x) / 2;
    d += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
  }
  return d;
}

export function buildAreaPath(
  linePath: string,
  points: PlotPoint[],
  bottomY: number,
): string {
  if (points.length === 0) return "";
  const first = points[0];
  const last = points[points.length - 1];
  return `${linePath} L ${last.x} ${bottomY} L ${first.x} ${bottomY} Z`;
}

export function buildPlotPoints(
  series: ProgressPoint[],
  layout: ChartLayout,
): PlotPoint[] {
  const plotHeight = layout.height - layout.padTop - layout.padBottom;
  const yMin = Y_TICKS[Y_TICKS.length - 1];
  const yMax = Y_TICKS[0];
  const step =
    series.length > 1 ? CHART_POINT_SPACING : 0;

  return series.map((point, index) => ({
    index,
    dateLabel: point.dateLabel,
    valueKg: point.valueKg,
    x: layout.padLeft + step * index,
    y: valueToY(point.valueKg, yMin, yMax, plotHeight, layout.padTop),
  }));
}

export function formatValueLabel(value: number): string {
  return value % 1 === 0 ? String(value) : value.toFixed(1);
}
