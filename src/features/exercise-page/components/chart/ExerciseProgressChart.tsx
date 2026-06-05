import { useEffect, useMemo, useRef, useState } from "react";
import {
  getProgressSeries,
  periodTabs,
  type LoadFilter,
  type PeriodFilter,
} from "@/features/exercise-page/mocks/progress-chart";
import { LoadFilterDropdown } from "./LoadFilterDropdown";
import {
  buildAreaPath,
  buildPlotPoints,
  buildSmoothLinePath,
  CHART_HEIGHT,
  formatValueLabel,
  getChartLayout,
  getYTicks,
} from "./buildChartGeometry";
import styles from "./ExerciseProgressChart.module.css";

/** Сколько точек помещается без горизонтального свайпа (подсказка и градиент) */
const SCROLL_HINT_MIN_POINTS = 6;

type ExerciseProgressChartProps = {
  exerciseId: string;
  loadFilter: LoadFilter;
  onLoadFilterChange: (value: LoadFilter) => void;
};

export function ExerciseProgressChart({
  exerciseId,
  loadFilter,
  onLoadFilterChange,
}: ExerciseProgressChartProps) {
  const [period, setPeriod] = useState<PeriodFilter>("week");
  const scrollRef = useRef<HTMLDivElement>(null);

  const series = useMemo(
    () => getProgressSeries(exerciseId, loadFilter, period),
    [exerciseId, loadFilter, period],
  );

  const layout = useMemo(() => getChartLayout(series.length), [series.length]);

  const geometry = useMemo(() => {
    const points = buildPlotPoints(series, layout);
    const linePath = buildSmoothLinePath(points);
    const bottomY = layout.height - layout.padBottom;
    const areaPath = buildAreaPath(linePath, points, bottomY);
    const yTicks = getYTicks();
    const plotHeight = layout.height - layout.padTop - layout.padBottom;
    const yMin = yTicks[yTicks.length - 1];
    const yMax = yTicks[0];
    const gridYs = yTicks.map((tick) => {
      const t = (tick - yMin) / (yMax - yMin);
      return layout.padTop + plotHeight * (1 - t);
    });
    const lastIndex = points.length - 1;

    return { points, linePath, areaPath, gridYs, lastIndex, bottomY };
  }, [series, layout]);

  const showScrollHint = series.length >= SCROLL_HINT_MIN_POINTS;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollLeft = el.scrollWidth - el.clientWidth;
  }, [series, layout.width, period]);

  return (
    <section className={styles.section} aria-label="Динамика роста">
      <h2 className={styles.title}>Динамика роста</h2>

      <LoadFilterDropdown value={loadFilter} onChange={onLoadFilterChange} />

      <div className={styles.periodStrip} role="tablist" aria-label="Период">
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

      <div
        className={styles.chartCard}
        style={{ ["--chart-height" as string]: `${CHART_HEIGHT}px` }}
      >
        <div
          className={`${styles.chartViewport} ${showScrollHint ? styles.chartViewportScrollable : ""}`}
        >
          <div className={styles.yAxis} aria-hidden>
            {getYTicks().map((tick, i) => (
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
              aria-hidden
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
                  key={getYTicks()[i]}
                  x1={layout.padLeft}
                  y1={y}
                  x2={layout.width - layout.padRight}
                  y2={y}
                  className={styles.gridLineH}
                />
              ))}

              {geometry.points.map((p) => (
                <line
                  key={`v-${p.dateLabel}-${p.index}`}
                  x1={p.x}
                  y1={layout.padTop}
                  x2={p.x}
                  y2={geometry.bottomY}
                  className={styles.gridLineV}
                />
              ))}

              <path d={geometry.areaPath} className={styles.areaFill} />
              <path d={geometry.linePath} className={styles.lineStroke} />

              {geometry.points.map((p, i) => {
                const isLast = i === geometry.lastIndex;
                const label = formatValueLabel(p.valueKg);
                const labelY = p.y - 10;
                const pillWidth = 34;
                const pillHeight = 18;

                if (isLast) {
                  return (
                    <g key={`${p.dateLabel}-${p.index}`}>
                      <circle cx={p.x} cy={p.y} r={4} className={styles.dot} />
                      <rect
                        x={p.x - pillWidth / 2}
                        y={labelY - pillHeight + 4}
                        width={pillWidth}
                        height={pillHeight}
                        rx={pillHeight / 2}
                        className={styles.valuePill}
                      />
                      <text
                        x={p.x}
                        y={labelY}
                        textAnchor="middle"
                        className={styles.valuePillText}
                      >
                        {label}
                      </text>
                      <text
                        x={p.x}
                        y={geometry.bottomY + 16}
                        textAnchor="middle"
                        className={styles.axisLabelX}
                      >
                        {p.dateLabel}
                      </text>
                    </g>
                  );
                }

                return (
                  <g key={`${p.dateLabel}-${p.index}`}>
                    <circle cx={p.x} cy={p.y} r={3.5} className={styles.dot} />
                    <text
                      x={p.x}
                      y={labelY}
                      textAnchor="middle"
                      className={styles.valueLabel}
                    >
                      {label}
                    </text>
                    <text
                      x={p.x}
                      y={geometry.bottomY + 16}
                      textAnchor="middle"
                      className={styles.axisLabelX}
                    >
                      {p.dateLabel}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
