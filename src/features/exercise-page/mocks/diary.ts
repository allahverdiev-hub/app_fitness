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

const defaultDiarySessions: DiarySession[] = [
  {
    id: "session-1",
    dateLabel: "15 марта",
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
    load: "heavy",
    sets: [
      { setNumber: 1, weightKg: 85, reps: 8 },
      { setNumber: 2, weightKg: 85, reps: 8 },
      { setNumber: 3, weightKg: 85, reps: 8 },
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
): DiarySession[] {
  const history = filterHistorySessions(loadFilter).map(withNewestSetsFirst);

  if (workoutSets.length === 0) {
    return history;
  }

  const load =
    workoutSessionLoad ?? (loadFilter === "all" ? "medium" : loadFilter);
  const liveSession: DiarySession = {
    id: `workout-live-${exerciseId}`,
    dateLabel: "Сегодня",
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
