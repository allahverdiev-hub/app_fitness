import type { DiarySession } from "@/features/exercise-page/mocks/diary";
import type { PeriodFilter, ProgressPoint } from "@/features/exercise-page/mocks/progress-chart";

const MONTH_LABELS = [
  "Янв",
  "Фев",
  "Мар",
  "Апр",
  "Май",
  "Июн",
  "Июл",
  "Авг",
  "Сен",
  "Окт",
  "Ноя",
  "Дек",
] as const;

function parseDateISO(dateISO: string): Date {
  const [year, month, day] = dateISO.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function formatDayLabel(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}.${month}`;
}

/** Максимальный вес по каждому календарному дню из всех подходов дневника */
export function maxWeightByDay(sessions: DiarySession[]): Map<string, number> {
  const byDay = new Map<string, number>();

  for (const session of sessions) {
    for (const set of session.sets) {
      const prev = byDay.get(session.dateISO) ?? 0;
      byDay.set(session.dateISO, Math.max(prev, set.weightKg));
    }
  }

  return byDay;
}

export function buildProgressSeriesFromDiary(
  sessions: DiarySession[],
  period: PeriodFilter,
  referenceDate: Date = new Date(),
): ProgressPoint[] {
  const today = startOfDay(referenceDate);
  const byDay = maxWeightByDay(sessions);

  if (byDay.size === 0) {
    return [];
  }

  if (period === "year") {
    const monthBuckets = new Map<
      string,
      { maxKg: number; month: number; year: number }
    >();

    for (const [dateISO, maxKg] of byDay) {
      const date = parseDateISO(dateISO);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const bucket = monthBuckets.get(key);

      if (!bucket || maxKg > bucket.maxKg) {
        monthBuckets.set(key, {
          maxKg,
          month: date.getMonth(),
          year: date.getFullYear(),
        });
      }
    }

    const cutoff = new Date(today.getFullYear(), today.getMonth() - 11, 1);

    return [...monthBuckets.values()]
      .filter(({ year, month }) => {
        const monthStart = new Date(year, month, 1);
        return monthStart >= cutoff && monthStart <= today;
      })
      .sort((a, b) =>
        a.year !== b.year ? a.year - b.year : a.month - b.month,
      )
      .map(({ maxKg, month, year }) => ({
        dateLabel: MONTH_LABELS[month]!,
        valueKg: maxKg,
        yearMonth: { year, month },
      }));
  }

  const daySpan = period === "month" ? 29 : 6;
  const cutoff = new Date(today);
  cutoff.setDate(cutoff.getDate() - daySpan);

  return [...byDay.entries()]
    .filter(([dateISO]) => {
      const date = parseDateISO(dateISO);
      return date >= cutoff && date <= today;
    })
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([dateISO, maxKg]) => ({
      dateLabel: formatDayLabel(parseDateISO(dateISO)),
      valueKg: maxKg,
      dateISO,
    }));
}
