import type { LoadFilter } from "@/features/exercise-page/mocks/progress-chart";
import { loadFilterLabels } from "@/features/exercise-page/mocks/progress-chart";
import type { LoggedSet } from "@/features/exercise-page/types/set";
import { weightFromPickers } from "@/features/exercise-page/utils/weightUnits";

export type DiaryLoad = Exclude<LoadFilter, "all">;

export type DiarySetEntry = {
  setNumber: number;
  weightKg: number;
  reps: number;
  note?: string;
};

export type DiarySession = {
  id: string;
  dateLabel: string;
  /** Календарный день для связи с графиком (YYYY-MM-DD) */
  dateISO: string;
  load: DiaryLoad;
  sets: DiarySetEntry[];
};

export const diaryLoadMeta: Record<
  DiaryLoad,
  { label: string; color: string; signalBars: 1 | 2 | 3 }
> = {
  light: { label: loadFilterLabels.light, color: "#d4ff00", signalBars: 3 },
  medium: { label: loadFilterLabels.medium, color: "#ffd60a", signalBars: 2 },
  heavy: { label: loadFilterLabels.heavy, color: "#ff453a", signalBars: 3 },
};

function toDateISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function todayDateISO(referenceDate: Date = new Date()): string {
  return toDateISO(referenceDate);
}

const defaultDiarySessions: DiarySession[] = [
  {
    id: "session-1",
    dateLabel: "15 марта",
    dateISO: "2026-03-15",
    load: "light",
    sets: [
      {
        setNumber: 1,
        weightKg: 80,
        reps: 12,
        note:
          "Перед началом тренировки я размялся, чтобы подготовить мышцы и суставы к нагрузке. Затем я приступил к выполнению жима лёжа. Важно следить за правильной техникой, чтобы избежать травм.",
      },
      { setNumber: 2, weightKg: 80, reps: 12 },
      { setNumber: 3, weightKg: 80, reps: 12 },
    ],
  },
  {
    id: "session-2",
    dateLabel: "15 марта",
    dateISO: "2026-03-15",
    load: "medium",
    sets: [
      { setNumber: 1, weightKg: 82, reps: 10 },
      { setNumber: 2, weightKg: 82, reps: 10 },
      { setNumber: 3, weightKg: 82, reps: 10 },
    ],
  },
  {
    id: "session-3",
    dateLabel: "12 марта",
    dateISO: "2026-03-12",
    load: "heavy",
    sets: [
      { setNumber: 1, weightKg: 85, reps: 8 },
      { setNumber: 2, weightKg: 85, reps: 8 },
      { setNumber: 3, weightKg: 85, reps: 8 },
    ],
  },
  {
    id: "session-4",
    dateLabel: "4 июня",
    dateISO: "2026-06-04",
    load: "light",
    sets: [
      { setNumber: 1, weightKg: 78, reps: 12 },
      { setNumber: 2, weightKg: 78, reps: 12 },
    ],
  },
  {
    id: "session-5",
    dateLabel: "4 июня",
    dateISO: "2026-06-04",
    load: "medium",
    sets: [
      { setNumber: 1, weightKg: 80, reps: 10 },
      { setNumber: 2, weightKg: 80, reps: 10 },
    ],
  },
  {
    id: "session-6",
    dateLabel: "2 июня",
    dateISO: "2026-06-02",
    load: "heavy",
    sets: [
      { setNumber: 1, weightKg: 83, reps: 8 },
      { setNumber: 2, weightKg: 83, reps: 8 },
    ],
  },
  {
    id: "session-7",
    dateLabel: "1 июня",
    dateISO: "2026-06-01",
    load: "light",
    sets: [
      { setNumber: 1, weightKg: 77, reps: 12 },
      { setNumber: 2, weightKg: 77, reps: 12 },
    ],
  },
  {
    id: "session-8",
    dateLabel: "28 мая",
    dateISO: "2026-05-28",
    load: "medium",
    sets: [
      { setNumber: 1, weightKg: 76, reps: 10 },
      { setNumber: 2, weightKg: 76, reps: 10 },
    ],
  },
  {
    id: "session-9",
    dateLabel: "15 мая",
    dateISO: "2026-05-15",
    load: "heavy",
    sets: [
      { setNumber: 1, weightKg: 74, reps: 8 },
      { setNumber: 2, weightKg: 74, reps: 8 },
    ],
  },
  {
    id: "session-10",
    dateLabel: "20 апреля",
    dateISO: "2026-04-20",
    load: "light",
    sets: [
      { setNumber: 1, weightKg: 72, reps: 12 },
      { setNumber: 2, weightKg: 72, reps: 12 },
    ],
  },
  {
    id: "session-11",
    dateLabel: "10 февраля",
    dateISO: "2026-02-10",
    load: "medium",
    sets: [
      { setNumber: 1, weightKg: 68, reps: 10 },
      { setNumber: 2, weightKg: 68, reps: 10 },
    ],
  },
  {
    id: "session-12",
    dateLabel: "18 января",
    dateISO: "2026-01-18",
    load: "light",
    sets: [
      { setNumber: 1, weightKg: 65, reps: 12 },
      { setNumber: 2, weightKg: 65, reps: 12 },
    ],
  },
];

function loggedSetToDiaryEntry(set: LoggedSet): DiarySetEntry {
  const note = set.note.trim();
  return {
    setNumber: set.setNumber,
    weightKg: weightFromPickers(set.weightKg, set.weightGrams),
    reps: set.reps,
    ...(note ? { note } : {}),
  };
}

/** В UI: последний добавленный подход сверху */
function sortSetsNewestFirst(sets: DiarySetEntry[]): DiarySetEntry[] {
  return [...sets].reverse();
}

function withNewestSetsFirst(session: DiarySession): DiarySession {
  return { ...session, sets: sortSetsNewestFirst(session.sets) };
}

/** Сессии: от более свежей даты к более старой */
function sortSessionsNewestFirst(sessions: DiarySession[]): DiarySession[] {
  return [...sessions].sort((left, right) => {
    const byDate = right.dateISO.localeCompare(left.dateISO);
    if (byDate !== 0) return byDate;
    return left.id.localeCompare(right.id);
  });
}

function filterHistorySessions(loadFilter: LoadFilter): DiarySession[] {
  if (loadFilter === "all") {
    return defaultDiarySessions;
  }
  return defaultDiarySessions.filter((session) => session.load === loadFilter);
}

/** Мок-история + подходы текущей тренировки (блок «Сегодня» сверху) */
export function buildExerciseDiarySessions(
  exerciseId: string,
  loadFilter: LoadFilter,
  workoutSets: LoggedSet[] = [],
  workoutSessionLoad?: DiaryLoad,
  referenceDate: Date = new Date(),
): DiarySession[] {
  const history = sortSessionsNewestFirst(
    filterHistorySessions(loadFilter).map(withNewestSetsFirst),
  );

  if (workoutSets.length === 0) {
    return history;
  }

  const load =
    workoutSessionLoad ?? (loadFilter === "all" ? "medium" : loadFilter);
  const liveSession: DiarySession = {
    id: `workout-live-${exerciseId}`,
    dateLabel: "Сегодня",
    dateISO: todayDateISO(referenceDate),
    load,
    sets: sortSetsNewestFirst(workoutSets.map(loggedSetToDiaryEntry)),
  };

  return [liveSession, ...history];
}

export function getExerciseDiary(
  exerciseId: string,
  loadFilter: LoadFilter,
): DiarySession[] {
  return buildExerciseDiarySessions(exerciseId, loadFilter);
}

export function formatSetLine(weightKg: number, reps: number): string {
  return `${weightKg} кг x ${reps} повт`;
}

/** Последний подход из дневника (первая сессия в списке — самая свежая) */
export function getLastDiarySetEntry(
  exerciseId: string,
  loadFilter: LoadFilter,
  workoutSets: LoggedSet[] = [],
): DiarySetEntry | null {
  if (workoutSets.length > 0) {
    return loggedSetToDiaryEntry(workoutSets[workoutSets.length - 1]!);
  }

  const sessions = getExerciseDiary(exerciseId, loadFilter);
  if (sessions.length === 0) return null;
  const latestSession = sessions[0];
  if (latestSession.sets.length === 0) return null;
  return latestSession.sets[0] ?? null;
}
