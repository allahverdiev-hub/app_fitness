import type { DiarySession } from "@/features/exercise-page/mocks/diary";
import { formatSetLine } from "@/features/exercise-page/mocks/diary";
import type {
  PeriodFilter,
  ProgressPoint,
} from "@/features/exercise-page/mocks/progress-chart";
import { maxWeightByDay } from "@/features/exercise-page/utils/buildProgressSeriesFromDiary";

export { formatSetLine };

const MONTH_NOMINATIVE = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
] as const;

const MONTH_GENITIVE = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
] as const;

function parseDateISO(dateISO: string): Date {
  const [year, month, day] = dateISO.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatChartPopupDayTitle(
  dateISO: string,
  referenceDate: Date = new Date(),
): string {
  const todayISO = toDateISO(referenceDate);
  if (dateISO === todayISO) return "Сегодня";

  const date = parseDateISO(dateISO);
  return `${date.getDate()} ${MONTH_GENITIVE[date.getMonth()]}`;
}

export function formatChartPopupDayShort(dateISO: string): string {
  const date = parseDateISO(dateISO);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}.${month}`;
}

function toDateISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export type ChartPointDayBreakdown = {
  dateISO: string;
  dateLabel: string;
  maxWeightKg: number;
  sessions: DiarySession[];
};

export type ChartPointDetail = {
  title: string;
  maxWeightKg: number;
  sessions: DiarySession[];
  dayBreakdown?: ChartPointDayBreakdown[];
};

function sessionsForDay(
  sessions: DiarySession[],
  dateISO: string,
): DiarySession[] {
  return sessions.filter((session) => session.dateISO === dateISO);
}

function buildDayBreakdownForMonth(
  sessions: DiarySession[],
  year: number,
  month: number,
): ChartPointDayBreakdown[] {
  const byDay = maxWeightByDay(sessions);

  return [...byDay.entries()]
    .filter(([dateISO]) => {
      const date = parseDateISO(dateISO);
      return date.getFullYear() === year && date.getMonth() === month;
    })
    .sort(([left], [right]) => right.localeCompare(left))
    .map(([dateISO, maxWeightKg]) => ({
      dateISO,
      dateLabel: formatChartPopupDayShort(dateISO),
      maxWeightKg,
      sessions: sessionsForDay(sessions, dateISO),
    }));
}

export function buildChartPointDetail(
  point: ProgressPoint,
  period: PeriodFilter,
  sessions: DiarySession[],
  referenceDate: Date = new Date(),
): ChartPointDetail | null {
  if (period === "year" && point.yearMonth) {
    const { year, month } = point.yearMonth;
    const dayBreakdown = buildDayBreakdownForMonth(sessions, year, month);

    return {
      title: `${MONTH_NOMINATIVE[month]} ${year}`,
      maxWeightKg: point.valueKg,
      sessions: [],
      dayBreakdown,
    };
  }

  if (!point.dateISO) return null;

  const daySessions = sessionsForDay(sessions, point.dateISO);

  return {
    title: formatChartPopupDayTitle(point.dateISO, referenceDate),
    maxWeightKg: point.valueKg,
    sessions: daySessions,
  };
}
