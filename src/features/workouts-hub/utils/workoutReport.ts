import type { ProgramDifficulty } from "@/features/program-weeks/types/programWeeks";
import type { WorkoutCalendarSession } from "@/features/workouts-hub/types/workoutsHub";
import { toISODate } from "@/features/workouts-hub/utils/workoutCalendar";

/** Демо-«сегодня» — синхрон с календарём на хабе (6 июня 2026) */
export const DEMO_TODAY = new Date(2026, 5, 6);

/** Текущий момент на демо-календарном дне (дата = DEMO_TODAY, время = локальные часы) */
export function getDemoNow(): Date {
  const wall = new Date();
  return new Date(
    DEMO_TODAY.getFullYear(),
    DEMO_TODAY.getMonth(),
    DEMO_TODAY.getDate(),
    wall.getHours(),
    wall.getMinutes(),
    wall.getSeconds(),
  );
}

export type WorkoutFinishReportDraft = {
  programId: string;
  programTitle: string;
  workoutTitle: string;
  weekDifficulty: ProgramDifficulty;
  date: string;
  endedAt: string;
  durationMinutes: number;
};

export function hasAnyLoggedSets(
  completedSetsById: Record<string, number>,
): boolean {
  return Object.values(completedSetsById).some((count) => count > 0);
}

/** Есть ли новые подходы с момента старта текущей тренировочной сессии */
export function hasLoggedSetsSinceBaseline(
  current: Record<string, number>,
  baseline: Record<string, number>,
): boolean {
  const ids = new Set([
    ...Object.keys(current),
    ...Object.keys(baseline),
  ]);
  for (const id of ids) {
    if ((current[id] ?? 0) > (baseline[id] ?? 0)) return true;
  }
  return false;
}

export function formatEndedAtHHmm(date: Date): string {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function buildWorkoutFinishReportDraft(input: {
  programId: string;
  programTitle: string;
  workoutTitle: string;
  weekDifficulty: ProgramDifficulty;
  elapsedSeconds: number;
  referenceDate?: Date;
}): WorkoutFinishReportDraft {
  const now = input.referenceDate ?? getDemoNow();
  const durationMinutes = Math.max(1, Math.round(input.elapsedSeconds / 60));

  return {
    programId: input.programId,
    programTitle: input.programTitle,
    workoutTitle: input.workoutTitle,
    weekDifficulty: input.weekDifficulty,
    date: toISODate(now),
    endedAt: formatEndedAtHHmm(now),
    durationMinutes,
  };
}

let sessionIdCounter = 0;

export function createCalendarSessionFromDraft(
  draft: WorkoutFinishReportDraft,
): WorkoutCalendarSession {
  sessionIdCounter += 1;
  return {
    id: `cal-live-${Date.now()}-${sessionIdCounter}`,
    date: draft.date,
    programId: draft.programId,
    programTitle: draft.programTitle,
    workoutTitle: draft.workoutTitle,
    weekDifficulty: draft.weekDifficulty,
    endedAt: draft.endedAt,
    durationMinutes: draft.durationMinutes,
  };
}
