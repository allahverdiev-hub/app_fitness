import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  buildExerciseDiarySessions,
  type DiaryLoad,
} from "@/features/exercise-page/mocks/diary";
import {
  getProgressSeries,
  periodTabs,
  type LoadFilter,
  type PeriodFilter,
  type ProgressPoint,
} from "@/features/exercise-page/mocks/progress-chart";
import type { LoggedSet } from "@/features/exercise-page/types/set";
import type { ChartPointDetail } from "@/features/exercise-page/utils/chartPointDetail";
import { buildChartPointDetail } from "@/features/exercise-page/utils/chartPointDetail";
import { WorkoutExerciseTitle } from "@/features/workout-list/components/WorkoutExerciseTitle";
import { LoadFilterTabPicker } from "./LoadFilterTabPicker";
import {
  buildAreaPath,
  buildPlotPoints,
  buildSmoothLinePath,
  CHART_HEIGHT,
  formatValueLabel,
  getChartLayout,
  getVisibleAxisLabelIndices,
  getYTicksForValues,
  type PlotPoint,
} from "./buildChartGeometry";
import styles from "./ExerciseProgressChart.module.css";

/** Сколько точек помещается без горизонтального свайпа (подсказка и градиент) */
const SCROLL_HINT_MIN_POINTS = 6;
const POINT_HIT_RADIUS = 18;
const POINT_RING_RADIUS = 9;
const POINT_DOT_RADIUS = 4;

type ExerciseProgressChartProps = {
  exerciseId: string;
  loadFilter: LoadFilter;
  onLoadFilterChange: (value: LoadFilter) => void;
  workoutSets?: LoggedSet[];
  workoutSessionLoad?: DiaryLoad;
  onPointDetailChange?: (detail: ChartPointDetail | null) => void;
};

type ChartPointButtonProps = {
  point: PlotPoint;
  pointIndex: number;
  isLast: boolean;
  onSelect: (point: ProgressPoint) => void;
};

function ChartPointButton({
  point,
  pointIndex,
  isLast,
  onSelect,
}: ChartPointButtonProps) {
  const label = formatValueLabel(point.valueKg);
  const labelY = point.y - 10;
  const pillWidth = 34;
  const pillHeight = 18;

  const handleActivate = useCallback(() => {
    onSelect(point.source);
  }, [onSelect, point.source]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<SVGGElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleActivate();
      }
    },
    [handleActivate],
  );

  return (
    <g
      role="button"
      tabIndex={0}
      className={`${styles.pointButton} ${isLast ? styles.pointButtonLast : ""}`}
      style={{ ["--point-index" as string]: String(pointIndex) }}
      aria-label={`Подробнее: ${point.dateLabel}, ${label} кг`}
      onClick={handleActivate}
      onKeyDown={handleKeyDown}
    >
      <circle
        className={styles.pointHit}
        cx={point.x}
        cy={point.y}
        r={POINT_HIT_RADIUS}
      />
      <circle
        className={styles.pointRing}
        cx={point.x}
        cy={point.y}
        r={POINT_RING_RADIUS}
      />
      <circle
        className={styles.dot}
        cx={point.x}
        cy={point.y}
        r={isLast ? POINT_DOT_RADIUS : 3.5}
      />

      {isLast ? (
        <>
          <rect
            x={point.x - pillWidth / 2}
            y={labelY - pillHeight + 4}
            width={pillWidth}
            height={pillHeight}
            rx={pillHeight / 2}
            className={styles.valuePill}
            pointerEvents="none"
          />
          <text
            x={point.x}
            y={labelY}
            textAnchor="middle"
            className={styles.valuePillText}
            pointerEvents="none"
          >
            {label}
          </text>
        </>
      ) : (
        <text
          x={point.x}
          y={labelY}
          textAnchor="middle"
          className={styles.valueLabel}
          pointerEvents="none"
        >
          {label}
        </text>
      )}
    </g>
  );
}

export function ExerciseProgressChart({
  exerciseId,
  loadFilter,
  onLoadFilterChange,
  workoutSets = [],
  workoutSessionLoad,
  onPointDetailChange,
}: ExerciseProgressChartProps) {
  const [period, setPeriod] = useState<PeriodFilter>("week");
  const scrollRef = useRef<HTMLDivElement>(null);
  const chartAnimateKey = `${period}-${loadFilter}`;

  const diarySessions = useMemo(
    () =>
      buildExerciseDiarySessions(
        exerciseId,
        loadFilter,
        workoutSets,
        workoutSessionLoad,
      ),
    [exerciseId, loadFilter, workoutSets, workoutSessionLoad],
  );

  const series = useMemo(
    () =>
      getProgressSeries(
        exerciseId,
        loadFilter,
        period,
        workoutSets,
        workoutSessionLoad,
      ),
    [exerciseId, loadFilter, period, workoutSets, workoutSessionLoad],
  );

  const handlePointSelect = useCallback(
    (point: ProgressPoint) => {
      const detail = buildChartPointDetail(point, period, diarySessions);
      onPointDetailChange?.(detail);
    },
    [diarySessions, onPointDetailChange, period],
  );

  const yTicks = useMemo(
    () => getYTicksForValues(series.map((point) => point.valueKg)),
    [series],
  );

  const layout = useMemo(
    () => getChartLayout(Math.max(series.length, 1)),
    [series.length],
  );

  const geometry = useMemo(() => {
    const points = buildPlotPoints(series, layout, yTicks);
    const linePath = buildSmoothLinePath(points);
    const bottomY = layout.height - layout.padBottom;
    const areaPath = buildAreaPath(linePath, points, bottomY);
    const plotHeight = layout.height - layout.padTop - layout.padBottom;
    const yMin = yTicks[yTicks.length - 1];
    const yMax = yTicks[0];
    const span = yMax - yMin;
    const gridYs = yTicks.map((tick) => {
      const t = span === 0 ? 0.5 : (tick - yMin) / span;
      return layout.padTop + plotHeight * (1 - t);
    });
    const lastIndex = points.length - 1;
    const visibleAxisLabelIndices = getVisibleAxisLabelIndices(points);

    return {
      points,
      linePath,
      areaPath,
      gridYs,
      lastIndex,
      bottomY,
      visibleAxisLabelIndices,
    };
  }, [series, layout, yTicks]);

  const showScrollHint = series.length >= SCROLL_HINT_MIN_POINTS;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollLeft = el.scrollWidth - el.clientWidth;
  }, [series, layout.width, period]);

  useEffect(() => {
    onPointDetailChange?.(null);
  }, [period, loadFilter, exerciseId, onPointDetailChange]);

  return (
    <section className={styles.section} aria-label="Динамика роста">
      <h2 className={styles.title}>Динамика роста</h2>

      <LoadFilterTabPicker
        value={loadFilter}
        onChange={onLoadFilterChange}
        className={styles.loadFilterPicker}
      />

      <div
        className={styles.chartCard}
        style={{ ["--chart-height" as string]: `${CHART_HEIGHT}px` }}
      >
        <div className={styles.chartHeader}>
          <WorkoutExerciseTitle as="h3" className={styles.chartHeaderTitle}>
            Динамика
          </WorkoutExerciseTitle>
          <div className={styles.periodTabs} role="tablist" aria-label="Период">
            {periodTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={period === tab.id}
                className={`${styles.periodTab} ${period === tab.id ? styles.periodTabActive : ""}`}
                onClick={() => setPeriod(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div
          className={`${styles.chartViewport} ${showScrollHint ? styles.chartViewportScrollable : ""}`}
        >
          <div key={chartAnimateKey} className={styles.yAxis} aria-hidden>
            {yTicks.map((tick, i) => (
              <span
                key={tick}
                className={styles.yAxisLabel}
                style={{ top: `${(geometry.gridYs[i] / layout.height) * 100}%` }}
              >
                {tick} кг
              </span>
            ))}
          </div>

          <div
            ref={scrollRef}
            className={styles.chartScroller}
            role="region"
            aria-label="График нагрузки, прокрутите по горизонтали"
            tabIndex={showScrollHint ? 0 : undefined}
          >
            <svg
              className={styles.chartSvg}
              width={layout.width}
              height={layout.height}
              viewBox={`0 0 ${layout.width} ${layout.height}`}
              preserveAspectRatio="none"
              role="img"
              aria-label="График динамики веса"
            >
              <defs>
                <linearGradient
                  id="progressAreaGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="rgba(212, 255, 0, 0.35)" />
                  <stop offset="100%" stopColor="rgba(212, 255, 0, 0)" />
                </linearGradient>
              </defs>

              {geometry.gridYs.map((y, i) => (
                <line
                  key={yTicks[i]}
                  x1={layout.padLeft}
                  y1={y}
                  x2={layout.width - layout.padRight}
                  y2={y}
                  className={styles.gridLineH}
                />
              ))}

              <g key={chartAnimateKey} className={styles.chartPlot}>
                {geometry.points.map((p) => (
                  <line
                    key={`v-${p.dateLabel}-${p.index}`}
                    x1={p.x}
                    y1={layout.padTop}
                    x2={p.x}
                    y2={geometry.bottomY}
                    className={styles.gridLineV}
                    style={{ ["--point-index" as string]: String(p.index) }}
                  />
                ))}

                <path
                  d={geometry.areaPath}
                  className={styles.areaFill}
                  pathLength={1}
                />
                <path
                  d={geometry.linePath}
                  className={styles.lineStroke}
                  pathLength={1}
                />

                {geometry.points.map((p, i) => (
                  <ChartPointButton
                    key={`${p.dateLabel}-${p.index}`}
                    point={p}
                    pointIndex={i}
                    isLast={i === geometry.lastIndex}
                    onSelect={handlePointSelect}
                  />
                ))}

                <g className={styles.axisLabelsX} aria-hidden>
                  {geometry.points.map((p, i) =>
                    geometry.visibleAxisLabelIndices.has(i) ? (
                      <text
                        key={`x-${p.dateLabel}-${p.index}`}
                        x={p.x}
                        y={geometry.bottomY + 16}
                        textAnchor="middle"
                        className={styles.axisLabelX}
                      >
                        {p.dateLabel}
                      </text>
                    ) : null,
                  )}
                </g>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
