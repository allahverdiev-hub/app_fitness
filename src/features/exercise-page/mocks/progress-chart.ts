export type LoadFilter = "all" | "light" | "medium" | "heavy";
export type PeriodFilter = "week" | "month" | "year";

export type ProgressPoint = {
  dateLabel: string;
  valueKg: number;
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

const weekSeries: ProgressPoint[] = [
  { dateLabel: "1.06", valueKg: 47.6 },
  { dateLabel: "2.06", valueKg: 47.4 },
  { dateLabel: "3.06", valueKg: 47.2 },
  { dateLabel: "4.06", valueKg: 47.0 },
  { dateLabel: "5.06", valueKg: 46.8 },
  { dateLabel: "6.06", valueKg: 46.5 },
  { dateLabel: "7.06", valueKg: 46.2 },
  { dateLabel: "8.06", valueKg: 46.0 },
  { dateLabel: "9.06", valueKg: 47.1 },
  { dateLabel: "10.06", valueKg: 48.0 },
  { dateLabel: "11.06", valueKg: 48.5 },
  { dateLabel: "12.06", valueKg: 49.3 },
];

const monthSeries: ProgressPoint[] = [
  { dateLabel: "1.06", valueKg: 45.8 },
  { dateLabel: "5.06", valueKg: 46.2 },
  { dateLabel: "9.06", valueKg: 46.8 },
  { dateLabel: "13.06", valueKg: 47.4 },
  { dateLabel: "17.06", valueKg: 48.0 },
  { dateLabel: "21.06", valueKg: 48.6 },
  { dateLabel: "25.06", valueKg: 49.1 },
  { dateLabel: "29.06", valueKg: 49.5 },
];

const yearSeries: ProgressPoint[] = [
  { dateLabel: "Янв", valueKg: 44.0 },
  { dateLabel: "Фев", valueKg: 44.5 },
  { dateLabel: "Мар", valueKg: 45.0 },
  { dateLabel: "Апр", valueKg: 45.4 },
  { dateLabel: "Май", valueKg: 45.8 },
  { dateLabel: "Июн", valueKg: 46.2 },
  { dateLabel: "Июл", valueKg: 46.8 },
  { dateLabel: "Авг", valueKg: 47.2 },
  { dateLabel: "Сен", valueKg: 47.6 },
  { dateLabel: "Окт", valueKg: 48.0 },
  { dateLabel: "Ноя", valueKg: 48.5 },
  { dateLabel: "Дек", valueKg: 49.3 },
];

const seriesByPeriod: Record<PeriodFilter, ProgressPoint[]> = {
  week: weekSeries,
  month: monthSeries,
  year: yearSeries,
};

export function getProgressSeries(
  _exerciseId: string,
  _load: LoadFilter,
  period: PeriodFilter,
): ProgressPoint[] {
  return seriesByPeriod[period];
}
