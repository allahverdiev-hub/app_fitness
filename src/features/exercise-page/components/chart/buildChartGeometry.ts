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
  source: ProgressPoint;
};

/** Расстояние между точками по оси X (фиксированное — график не сжимается) */
export const CHART_POINT_SPACING = 56;

export const CHART_HEIGHT = 300;
export const CHART_PAD_TOP = 28;
export const CHART_PAD_RIGHT = 16;
export const CHART_PAD_BOTTOM = 32;
export const CHART_PAD_LEFT = 12;
/** Запас под половину подписи даты (DD.MM) слева и справа */
export const CHART_X_LABEL_INSET = 24;
/** Минимальный зазор между центрами соседних подписей по X */
export const CHART_X_LABEL_MIN_GAP = 50;

const DEFAULT_Y_TICKS = [100, 90, 80, 70, 60, 50];

export function getYTicksForValues(values: number[]): number[] {
  if (values.length === 0) {
    return DEFAULT_Y_TICKS;
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(max - min, 4);
  const padding = Math.max(2, span * 0.12);
  const rawMin = min - padding;
  const rawMax = max + padding;
  const step = Math.max(1, Math.ceil((rawMax - rawMin) / 5 / 5) * 5);
  const yMin = Math.floor(rawMin / step) * step;
  const yMax = Math.ceil(rawMax / step) * step;

  const ticks: number[] = [];
  for (let value = yMax; value >= yMin; value -= step) {
    ticks.push(value);
  }

  if (ticks.length < 2) {
    return [yMax, yMin];
  }

  return ticks;
}

export function getChartLayout(seriesLength: number): ChartLayout {
  const plotSpan =
    seriesLength > 1 ? (seriesLength - 1) * CHART_POINT_SPACING : 0;
  const minPlotWidth = CHART_POINT_SPACING * 4;

  return {
    width:
      CHART_PAD_LEFT +
      CHART_X_LABEL_INSET +
      Math.max(plotSpan, minPlotWidth) +
      CHART_X_LABEL_INSET +
      CHART_PAD_RIGHT,
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
  const span = yMax - yMin;
  const t = span === 0 ? 0.5 : (value - yMin) / span;
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
  yTicks: number[],
): PlotPoint[] {
  const plotHeight = layout.height - layout.padTop - layout.padBottom;
  const yMin = yTicks[yTicks.length - 1];
  const yMax = yTicks[0];
  const step = series.length > 1 ? CHART_POINT_SPACING : 0;

  return series.map((point, index) => ({
    index,
    dateLabel: point.dateLabel,
    valueKg: point.valueKg,
    source: point,
    x: layout.padLeft + CHART_X_LABEL_INSET + step * index,
    y: valueToY(point.valueKg, yMin, yMax, plotHeight, layout.padTop),
  }));
}

export function getVisibleAxisLabelIndices(points: PlotPoint[]): Set<number> {
  if (points.length === 0) return new Set();
  if (points.length === 1) return new Set([0]);

  const indices: number[] = [0];
  let lastShownX = points[0].x;

  for (let i = 1; i < points.length; i += 1) {
    const isLast = i === points.length - 1;
    const x = points[i].x;

    if (isLast) {
      if (x - lastShownX < CHART_X_LABEL_MIN_GAP && indices.length > 1) {
        indices.pop();
      }
      indices.push(i);
      continue;
    }

    if (x - lastShownX >= CHART_X_LABEL_MIN_GAP) {
      indices.push(i);
      lastShownX = x;
    }
  }

  return new Set(indices);
}

export function formatValueLabel(value: number): string {
  return value % 1 === 0 ? String(value) : value.toFixed(1);
}
