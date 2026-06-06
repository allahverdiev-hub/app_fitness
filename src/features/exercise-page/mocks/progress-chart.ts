import {
  buildExerciseDiarySessions,
  type DiaryLoad,
} from "@/features/exercise-page/mocks/diary";
import { buildProgressSeriesFromDiary } from "@/features/exercise-page/utils/buildProgressSeriesFromDiary";
import type { LoggedSet } from "@/features/exercise-page/types/set";

export type LoadFilter = "all" | "light" | "medium" | "heavy";
export type PeriodFilter = "week" | "month" | "year";

export type ProgressPoint = {
  dateLabel: string;
  valueKg: number;
  /** Неделя / месяц — календарный день */
  dateISO?: string;
  /** Год — месяц для декомпозиции по дням */
  yearMonth?: { year: number; month: number };
};

export const loadFilterLabels: Record<LoadFilter, string> = {
  all: "Все",
  light: "Легкая",
  medium: "Средняя",
  heavy: "Тяжелая",
};

export const periodFilterLabels: Record<PeriodFilter, string> = {
  week: "Неделя",
  month: "Месяц",
  year: "Год",
};

export const periodTabs: { id: PeriodFilter; label: string }[] = [
  { id: "week", label: periodFilterLabels.week },
  { id: "month", label: periodFilterLabels.month },
  { id: "year", label: periodFilterLabels.year },
];

export function getProgressSeries(
  exerciseId: string,
  load: LoadFilter,
  period: PeriodFilter,
  workoutSets: LoggedSet[] = [],
  workoutSessionLoad?: DiaryLoad,
  referenceDate: Date = new Date(),
): ProgressPoint[] {
  const sessions = buildExerciseDiarySessions(
    exerciseId,
    load,
    workoutSets,
    workoutSessionLoad,
    referenceDate,
  );

  return buildProgressSeriesFromDiary(sessions, period, referenceDate);
}
