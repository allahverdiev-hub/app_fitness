import type { WorkoutCalendarSession } from "@/features/workouts-hub/types/workoutsHub";

const WEEKDAY_SHORT = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"] as const;
const MONTH_NAMES = [
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
const MONTH_NAMES_NOM = [
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

export function parseISODate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function startOfWeekMonday(date: Date): Date {
  const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = copy.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  copy.setDate(copy.getDate() + diff);
  return copy;
}

export function getWeekDays(reference: Date): Date[] {
  const start = startOfWeekMonday(reference);
  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
}

export function getMonthGridCells(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1);
  const startOffset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [];

  for (let i = 0; i < startOffset; i += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(year, month, day));
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}

export function formatWeekdayShort(date: Date): string {
  return WEEKDAY_SHORT[date.getDay()];
}

export function formatDayNumber(date: Date): string {
  return String(date.getDate());
}

export function formatMonthTitle(date: Date): string {
  return `${MONTH_NAMES_NOM[date.getMonth()]} ${date.getFullYear()}`;
}

export function addMonths(date: Date, delta: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}

export function formatSessionDateLabel(iso: string): string {
  const date = parseISODate(iso);
  return `${date.getDate()} ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours <= 0) return `${rest} мин`;
  if (rest <= 0) return `${hours} ч`;
  return `${hours} ч ${rest} мин`;
}

export function groupSessionsByDate(
  sessions: readonly WorkoutCalendarSession[],
): Map<string, WorkoutCalendarSession[]> {
  const map = new Map<string, WorkoutCalendarSession[]>();
  for (const session of sessions) {
    const list = map.get(session.date);
    if (list) {
      list.push(session);
    } else {
      map.set(session.date, [session]);
    }
  }
  return map;
}

export function getSessionsForDate(
  sessions: readonly WorkoutCalendarSession[],
  iso: string,
): WorkoutCalendarSession[] {
  return sessions.filter((session) => session.date === iso);
}

export function getMaxDurationForDates(
  sessionsByDate: Map<string, WorkoutCalendarSession[]>,
  dates: readonly Date[],
): number {
  let max = 0;
  for (const date of dates) {
    const iso = toISODate(date);
    const daySessions = sessionsByDate.get(iso) ?? [];
    for (const session of daySessions) {
      max = Math.max(max, session.durationMinutes);
    }
  }
  return max;
}
