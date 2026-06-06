import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { IconChevronLeft, IconChevronRight } from "@/shared/icons";
import { useCalendarExpandDrag } from "@/features/workouts-hub/hooks/useCalendarExpandDrag";
import type { WorkoutCalendarSession } from "@/features/workouts-hub/types/workoutsHub";
import {
  addMonths,
  formatDayNumber,
  formatMonthTitle,
  formatWeekdayShort,
  getMonthGridCells,
  getSessionsForDate,
  getWeekDays,
  groupSessionsByDate,
  isSameDay,
  parseISODate,
  toISODate,
} from "@/features/workouts-hub/utils/workoutCalendar";
import { getCalendarSessionDisplay } from "@/features/workouts-hub/utils/calendarSessionDisplay";
import { DEMO_TODAY } from "@/features/workouts-hub/utils/workoutReport";
import styles from "./WorkoutCalendarWidget.module.css";

const WEEKDAY_HEADERS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"] as const;

type WorkoutCalendarWidgetProps = {
  sessions: readonly WorkoutCalendarSession[];
  referenceDate?: Date;
  /** Прокрутить месячный вид к дате отчёта (ISO) */
  focusDate?: string | null;
  onDayOpen?: (date: string) => void;
};

export function WorkoutCalendarWidget({
  sessions,
  referenceDate = DEMO_TODAY,
  focusDate = null,
  onDayOpen,
}: WorkoutCalendarWidgetProps) {
  const [monthExpanded, setMonthExpanded] = useState(false);
  const [playCellIntro, setPlayCellIntro] = useState(false);
  const [viewDate, setViewDate] = useState(
    () => new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1),
  );

  const { progress, isDragging, isSettling, handleProps } = useCalendarExpandDrag({
    expanded: monthExpanded,
    onExpandedChange: setMonthExpanded,
  });

  const sessionsByDate = useMemo(
    () => groupSessionsByDate(sessions),
    [sessions],
  );

  const weekDays = useMemo(
    () => getWeekDays(referenceDate),
    [referenceDate],
  );

  useEffect(() => {
    if (!focusDate) return;
    const focused = parseISODate(focusDate);
    setViewDate(new Date(focused.getFullYear(), focused.getMonth(), 1));
  }, [focusDate]);

  const monthCells = useMemo(
    () => getMonthGridCells(viewDate.getFullYear(), viewDate.getMonth()),
    [viewDate],
  );

  const openDay = (iso: string) => {
    const daySessions = getSessionsForDate(sessions, iso);
    if (daySessions.length === 0) return;
    onDayOpen?.(iso);
  };

  const monthInteractive = progress > 0.72 || monthExpanded;
  const labelMonthOpacity = Math.max(0, Math.min(1, 1 - progress * 1.6));
  const labelWeekOpacity = Math.max(0, Math.min(1, (progress - 0.35) * 1.8));
  const isLiveMotion = isDragging || isSettling;
  const showExpandedChrome = monthExpanded && !isSettling;

  useEffect(() => {
    if (!showExpandedChrome) {
      setPlayCellIntro(false);
      return;
    }

    setPlayCellIntro(true);
    const timer = window.setTimeout(() => setPlayCellIntro(false), 520);
    return () => window.clearTimeout(timer);
  }, [showExpandedChrome]);

  return (
    <section className={styles.section} aria-label="Календарь тренировок">
      <div
        className={`${styles.widget} ${isLiveMotion ? styles.widgetLive : ""} ${showExpandedChrome ? styles.widgetExpanded : ""} ${playCellIntro ? styles.widgetCellIntro : ""}`}
        style={
          {
            "--calendar-expand-progress": String(progress),
          } as CSSProperties
        }
      >
        <div className={styles.body}>
          <div
            className={styles.weekPanel}
            style={{
              pointerEvents: progress < 0.45 ? "auto" : "none",
            }}
            aria-hidden={progress > 0.92}
          >
            <p className={styles.caption}>{formatMonthTitle(referenceDate)}</p>
            <div className={styles.weekChart}>
              {weekDays.map((day) => {
                const iso = toISODate(day);
                const daySessions = sessionsByDate.get(iso) ?? [];
                const { visible: visibleSessions, overflowCount } =
                  getCalendarSessionDisplay(daySessions);
                const hasWorkout = daySessions.length > 0;
                const isToday = isSameDay(day, referenceDate);
                return (
                  <button
                    key={iso}
                    type="button"
                    className={`${styles.weekDay} ${hasWorkout ? styles.weekDayDone : ""} ${isToday ? styles.weekDayToday : ""}`}
                    disabled={!hasWorkout}
                    aria-label={
                      hasWorkout
                        ? `${formatWeekdayShort(day)} ${formatDayNumber(day)}, ${daySessions.length} тренировок`
                        : `${formatWeekdayShort(day)} ${formatDayNumber(day)}, без тренировки`
                    }
                    onClick={() => openDay(iso)}
                  >
                    <span className={styles.weekBarTrack} aria-hidden>
                      {hasWorkout ? (
                        <span className={styles.weekBarGroup}>
                          {visibleSessions.map((session) => (
                            <span
                              key={session.id}
                              className={`${styles.weekBar} ${styles[`weekBarTone_${session.weekDifficulty}`]}`}
                            />
                          ))}
                          {overflowCount > 0 ? (
                            <span className={styles.weekBarOverflow}>
                              +{overflowCount}
                            </span>
                          ) : null}
                        </span>
                      ) : null}
                    </span>
                    <span className={styles.weekDayBottom}>
                      <span className={styles.weekDayLabel}>
                        {formatWeekdayShort(day)}
                      </span>
                      <span className={styles.weekDateLabel}>
                        {formatDayNumber(day)}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div
            className={styles.monthPanel}
            inert={!monthInteractive}
            style={{
              pointerEvents: monthInteractive ? "auto" : "none",
            }}
            aria-hidden={progress < 0.08}
          >
            <div className={styles.monthNav}>
              <button
                type="button"
                className={styles.monthNavBtn}
                aria-label="Предыдущий месяц"
                onClick={() => setViewDate((current) => addMonths(current, -1))}
              >
                <IconChevronLeft size={18} aria-hidden />
              </button>
              <p className={styles.monthNavTitle}>{formatMonthTitle(viewDate)}</p>
              <button
                type="button"
                className={styles.monthNavBtn}
                aria-label="Следующий месяц"
                onClick={() => setViewDate((current) => addMonths(current, 1))}
              >
                <IconChevronRight size={18} aria-hidden />
              </button>
            </div>
            <div className={styles.monthWeekdays} aria-hidden>
              {WEEKDAY_HEADERS.map((label) => (
                <span key={label} className={styles.monthWeekday}>
                  {label}
                </span>
              ))}
            </div>
            <div className={styles.monthGrid} role="grid">
              {monthCells.map(({ date: day, inMonth }) => {
                const iso = toISODate(day);
                const daySessions = sessionsByDate.get(iso) ?? [];
                const { visible: visibleSessions, overflowCount } =
                  getCalendarSessionDisplay(daySessions);
                const hasWorkout = daySessions.length > 0;
                const isToday = inMonth && isSameDay(day, referenceDate);

                return (
                  <button
                    key={`${iso}-${inMonth ? "in" : "out"}`}
                    type="button"
                    role="gridcell"
                    className={`${styles.monthCell} ${!inMonth ? styles.monthCellOutside : ""} ${hasWorkout ? styles.monthCellDone : ""} ${isToday ? styles.monthCellToday : ""}`}
                    disabled={!hasWorkout}
                    aria-label={
                      hasWorkout
                        ? `${formatDayNumber(day)}, ${daySessions.length} тренировок`
                        : `${formatDayNumber(day)}, без тренировки`
                    }
                    onClick={() => openDay(iso)}
                  >
                    <span className={styles.monthDayNumber}>
                      {formatDayNumber(day)}
                    </span>
                    {hasWorkout ? (
                      <span className={styles.monthDots} aria-hidden>
                        {visibleSessions.map((session) => (
                          <span
                            key={session.id}
                            className={`${styles.monthDot} ${styles[`monthDotTone_${session.weekDifficulty}`]}`}
                          />
                        ))}
                        {overflowCount > 0 ? (
                          <span className={styles.monthDotOverflow}>
                            +{overflowCount}
                          </span>
                        ) : null}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div
          className={`${styles.dragHandle} ${isDragging ? styles.dragHandleActive : ""}`}
          role="separator"
          aria-orientation="horizontal"
          aria-label={
            monthExpanded
              ? "Потяните вверх, чтобы свернуть до недели"
              : "Потяните вниз, чтобы развернуть месяц"
          }
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
          {...handleProps}
        >
          <span className={styles.dragGrip} aria-hidden />
          <span className={styles.dragLabels} aria-hidden>
            <span
              className={styles.dragLabel}
              style={{ opacity: labelMonthOpacity }}
            >
              Месяц
            </span>
            <span
              className={`${styles.dragLabel} ${styles.dragLabelAlt}`}
              style={{ opacity: labelWeekOpacity }}
            >
              Неделя
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}
