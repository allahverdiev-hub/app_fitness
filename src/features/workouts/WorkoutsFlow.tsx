import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SetStateAction } from "react";
import { ExercisePage } from "@/features/exercise-page/ExercisePage";
import { buildInitialCompletedSets } from "@/features/exercise-page/utils/exerciseStatus";
import { useWorkoutTimer } from "@/features/workouts/hooks/useWorkoutTimer";
import {
  cloneWorkoutSessionExercises,
  mockWorkout,
  mockWorkoutOverview,
  toExerciseItems,
  toListExerciseItems,
  buildWorkoutExerciseSetsById,
  workoutSessionExercises,
  type WorkoutSessionExerciseDef,
} from "@/features/workouts/mocks/workoutSession";
import {
  applyExerciseVolumeChange,
  type ExerciseVolumeUpdate,
} from "@/features/workouts/utils/applyExerciseVolumeChange";
import { applyExerciseDeletion } from "@/features/workouts/utils/deleteExercise";
import { applyExerciseReplacement } from "@/features/workouts/utils/replaceExercise";
import { WorkoutsHubPage } from "@/features/workouts-hub/WorkoutsHubPage";
import { FinishWorkoutConfirmSheet } from "@/features/workouts-hub/components/FinishWorkoutConfirmSheet";
import { WorkoutFinishReportSheet } from "@/features/workouts-hub/components/WorkoutFinishReportSheet";
import { mockWorkoutCalendarSessions } from "@/features/workouts-hub/mocks/workoutCalendarMock";
import type { WorkoutCalendarSession } from "@/features/workouts-hub/types/workoutsHub";
import { getProgramOverviewById } from "@/features/workouts-hub/utils/programRegistry";
import {
  buildWorkoutFinishReportDraft,
  createCalendarSessionFromDraft,
  hasLoggedSetsSinceBaseline,
  type WorkoutFinishReportDraft,
} from "@/features/workouts-hub/utils/workoutReport";
import {
  defaultProgramWorkoutId,
  mockProgramOverview,
} from "@/features/program-weeks/mocks/programWeeksMock";
import { ProgramWeeksPage } from "@/features/program-weeks/ProgramWeeksPage";
import {
  findProgramWorkoutWeekDifficulty,
  getProgramWorkoutTitleById,
} from "@/features/program-weeks/utils/programWorkoutLookup";
import { WorkoutListPage } from "@/features/workout-list/WorkoutListPage";
import type { WorkoutListExerciseItem } from "@/features/workout-list/types/workoutOverview";
import {
  formatWorkoutElapsed,
  formatWorkoutElapsedCompact,
} from "@/shared/lib/workoutElapsed";
import { useTabPopSignal } from "@/shared/lib/tabStackNavigation";

export type WorkoutsScreen = "hub" | "program" | "list" | "exercise";

export function popWorkoutsScreen(screen: WorkoutsScreen): WorkoutsScreen {
  if (screen === "exercise") return "list";
  if (screen === "list") return "program";
  if (screen === "program") return "hub";
  return screen;
}

type WorkoutsFlowProps = {
  onScreenChange?: (screen: WorkoutsScreen) => void;
  /** Инкремент — сигнал «вернуться на уровень выше» (повторный тап по табу) */
  popSignal?: number;
};

export function WorkoutsFlow({
  onScreenChange,
  popSignal = 0,
}: WorkoutsFlowProps = {}) {
  const [screen, setScreen] = useState<WorkoutsScreen>("hub");
  const [activeProgramId, setActiveProgramId] = useState(mockProgramOverview.id);
  const [activeWorkoutId, setActiveWorkoutId] = useState(defaultProgramWorkoutId);
  const [exerciseId, setExerciseId] = useState(mockWorkout.activeExerciseId);
  const [workoutActive, setWorkoutActive] = useState(false);
  const workoutActiveRef = useRef(workoutActive);
  workoutActiveRef.current = workoutActive;
  const [calendarSessions, setCalendarSessions] = useState<
    WorkoutCalendarSession[]
  >(() => [...mockWorkoutCalendarSessions]);
  const [finishConfirmOpen, setFinishConfirmOpen] = useState(false);
  const [finishReportDraft, setFinishReportDraft] =
    useState<WorkoutFinishReportDraft | null>(null);
  const [calendarDayToOpen, setCalendarDayToOpen] = useState<string | null>(
    null,
  );
  const [exerciseDefs, setExerciseDefs] = useState<WorkoutSessionExerciseDef[]>(
    cloneWorkoutSessionExercises,
  );
  const [completedSetsById, setCompletedSetsById] = useState(() =>
    buildInitialCompletedSets(toExerciseItems(cloneWorkoutSessionExercises())),
  );
  const completedSetsRef = useRef(completedSetsById);
  completedSetsRef.current = completedSetsById;
  const workoutSessionBaselineRef = useRef<Record<string, number> | null>(
    null,
  );

  const sessionExercises = useMemo(
    () => toExerciseItems(exerciseDefs),
    [exerciseDefs],
  );
  const listExercises = useMemo(
    () => toListExerciseItems(exerciseDefs),
    [exerciseDefs],
  );
  const workoutExerciseSetsById = useMemo(
    () => buildWorkoutExerciseSetsById(exerciseDefs),
    [exerciseDefs],
  );
  const exerciseVolumeById = useMemo(
    () =>
      Object.fromEntries(
        exerciseDefs.map((def) => [
          def.id,
          {
            sets: def.sets,
            repsRange: def.repsRange,
            isWarmup: def.isWarmup ?? false,
            warmupVolumeType: def.warmupVolumeType,
          },
        ]),
      ),
    [exerciseDefs],
  );
  const sessionExerciseIds = useMemo(
    () => exerciseDefs.map((def) => def.id),
    [exerciseDefs],
  );

  const { elapsedSeconds, isRunning, toggleRunning, reset, start } =
    useWorkoutTimer(0);

  const workoutElapsed = useMemo(
    () => formatWorkoutElapsedCompact(elapsedSeconds),
    [elapsedSeconds],
  );

  const sessionTimer = useMemo(
    () => ({
      elapsed: formatWorkoutElapsed(elapsedSeconds),
      isPaused: !workoutActive || !isRunning,
      onTogglePause: () => {
        if (workoutActive) toggleRunning();
      },
    }),
    [elapsedSeconds, workoutActive, isRunning, toggleRunning],
  );

  const openExercise = useCallback((pageId: string) => {
    setExerciseId(pageId);
    setScreen("exercise");
  }, []);

  const startWorkoutSession = useCallback(
    (setsBaseline?: Record<string, number>) => {
      if (workoutActiveRef.current) return;
      workoutSessionBaselineRef.current = {
        ...(setsBaseline ?? completedSetsRef.current),
      };
      start();
      setWorkoutActive(true);
    },
    [start],
  );

  const hasSessionLoggedSets = useCallback(() => {
    const baseline = workoutSessionBaselineRef.current;
    if (!baseline) return false;
    return hasLoggedSetsSinceBaseline(completedSetsRef.current, baseline);
  }, []);

  const handleStartWorkout = useCallback(
    (pageId: string) => {
      startWorkoutSession();
      openExercise(pageId);
    },
    [openExercise, startWorkoutSession],
  );

  const handleCompletedSetsChange = useCallback(
    (updater: SetStateAction<Record<string, number>>) => {
      let shouldStartWorkout = false;
      let setsBaselineBeforeStart: Record<string, number> | undefined;

      setCompletedSetsById((prev) => {
        const next =
          typeof updater === "function" ? updater(prev) : updater;
        const prevTotal = Object.values(prev).reduce((sum, count) => sum + count, 0);
        const nextTotal = Object.values(next).reduce((sum, count) => sum + count, 0);

        // Новый подход в дневнике при неактивной тренировке (учитывает уже «выполненные» в моке)
        if (!workoutActiveRef.current && nextTotal > prevTotal) {
          shouldStartWorkout = true;
          setsBaselineBeforeStart = prev;
        }

        return next;
      });

      if (shouldStartWorkout) {
        startWorkoutSession(setsBaselineBeforeStart);
      }
    },
    [startWorkoutSession],
  );

  const resetWorkoutSession = useCallback(() => {
    workoutSessionBaselineRef.current = null;
    reset();
    setWorkoutActive(false);
    setScreen("list");
  }, [reset]);

  const activeProgramOverview = useMemo(
    () => getProgramOverviewById(activeProgramId) ?? mockProgramOverview,
    [activeProgramId],
  );

  const activeWorkoutTitle = useMemo(
    () =>
      getProgramWorkoutTitleById(activeProgramOverview, activeWorkoutId) ??
      mockWorkoutOverview.title,
    [activeProgramOverview, activeWorkoutId],
  );

  const activeWeekDifficulty = useMemo(
    () =>
      findProgramWorkoutWeekDifficulty(
        activeProgramOverview,
        activeWorkoutId,
      ) ?? "light",
    [activeProgramOverview, activeWorkoutId],
  );

  const requestFinishWorkout = useCallback(() => {
    if (!hasSessionLoggedSets()) {
      resetWorkoutSession();
      return;
    }
    setFinishConfirmOpen(true);
  }, [hasSessionLoggedSets, resetWorkoutSession]);

  const cancelFinishWorkout = useCallback(() => {
    setFinishConfirmOpen(false);
  }, []);

  const confirmFinishWorkout = useCallback(() => {
    setFinishConfirmOpen(false);
    if (!hasSessionLoggedSets()) {
      resetWorkoutSession();
      return;
    }
    const draft = buildWorkoutFinishReportDraft({
      programId: activeProgramId,
      programTitle: activeProgramOverview.title,
      workoutTitle: activeWorkoutTitle,
      weekDifficulty: activeWeekDifficulty,
      elapsedSeconds,
    });
    setCalendarSessions((prev) => [
      ...prev,
      createCalendarSessionFromDraft(draft),
    ]);
    setFinishReportDraft(draft);
    setCalendarDayToOpen(draft.date);
    resetWorkoutSession();
  }, [
    activeProgramId,
    activeProgramOverview.title,
    activeWorkoutTitle,
    activeWeekDifficulty,
    elapsedSeconds,
    hasSessionLoggedSets,
    resetWorkoutSession,
  ]);

  const dismissFinishReportSheet = useCallback(() => {
    setFinishReportDraft(null);
    setScreen("hub");
  }, []);

  const handleCalendarDayOpened = useCallback(() => {
    setCalendarDayToOpen(null);
  }, []);

  const handleDeleteCalendarSession = useCallback((sessionId: string) => {
    setCalendarSessions((prev) =>
      prev.filter((session) => session.id !== sessionId),
    );
  }, []);

  const handleResetProgramToBaseline = useCallback(() => {
    const baseline = workoutSessionExercises.map((def) => ({ ...def }));
    setExerciseDefs(baseline);
    setCompletedSetsById(
      buildInitialCompletedSets(toExerciseItems(baseline)),
    );
  }, []);

  const handleRefreshProgramProgress = useCallback(() => {
    const keptIds = new Set(exerciseDefs.map((def) => def.id));
    setCompletedSetsById((prev) => {
      const next: Record<string, number> = {};
      for (const [id, count] of Object.entries(prev)) {
        if (keptIds.has(id)) next[id] = count;
      }
      return next;
    });
  }, [exerciseDefs]);

  const handleReplaceExercise = useCallback(
    (targetId: string, suggestionId: string) => {
      setExerciseDefs((prev) =>
        applyExerciseReplacement(prev, targetId, suggestionId),
      );
    },
    [],
  );

  const handleEditExerciseVolume = useCallback(
    (exerciseId: string, update: ExerciseVolumeUpdate) => {
      setExerciseDefs((prev) =>
        prev.map((def) =>
          def.id === exerciseId
            ? applyExerciseVolumeChange(def, update)
            : def,
        ),
      );
      setCompletedSetsById((prev) => {
        const done = prev[exerciseId] ?? 0;
        if (done <= update.sets) return prev;
        return { ...prev, [exerciseId]: update.sets };
      });
    },
    [],
  );

  const handleDeleteExercise = useCallback(
    (targetId: string) => {
      setExerciseDefs((prev) => applyExerciseDeletion(prev, targetId));
      setCompletedSetsById((prev) => {
        const { [targetId]: _removed, ...rest } = prev;
        return rest;
      });

      if (exerciseId === targetId) {
        setScreen("list");
      }
    },
    [exerciseId],
  );

  const handleListExercisesChange = useCallback(
    (items: WorkoutListExerciseItem[]) => {
      const keptIds = new Set(items.map((item) => item.id));

      setExerciseDefs((prev) => {
        const byId = Object.fromEntries(prev.map((def) => [def.id, def]));
        return items.flatMap((item) => {
          const def = byId[item.id];
          if (!def) return [];

          return [{ ...def }];
        });
      });

      setCompletedSetsById((prev) => {
        const next: Record<string, number> = {};
        for (const [id, count] of Object.entries(prev)) {
          if (keptIds.has(id)) next[id] = count;
        }
        return next;
      });
    },
    [],
  );

  useEffect(() => {
    onScreenChange?.(screen);
  }, [screen, onScreenChange]);

  useTabPopSignal(popSignal, popWorkoutsScreen, setScreen);

  const openProgram = useCallback((programId: string) => {
    setActiveProgramId(programId);
    setScreen("program");
  }, []);

  const openWorkoutList = useCallback((workoutId: string) => {
    setActiveWorkoutId(workoutId);
    setScreen("list");
  }, []);

  const openProgramWorkout = useCallback((programId: string, workoutId: string) => {
    setActiveProgramId(programId);
    setActiveWorkoutId(workoutId);
    setScreen("list");
  }, []);

  let screenContent;

  if (screen === "exercise") {
    screenContent = (
      <ExercisePage
        initialExerciseId={exerciseId}
        sessionExercises={sessionExercises}
        sessionTimer={sessionTimer}
        completedSetsById={completedSetsById}
        onCompletedSetsChange={handleCompletedSetsChange}
        onReplaceExercise={handleReplaceExercise}
        onFinishWorkout={requestFinishWorkout}
      />
    );
  } else if (screen === "hub") {
    screenContent = (
      <WorkoutsHubPage
        sessionProgress={{
          sessionExerciseIds,
          completedSetsById,
          setsByExerciseId: workoutExerciseSetsById,
        }}
        calendarSessions={calendarSessions}
        calendarDayToOpen={calendarDayToOpen}
        onCalendarDayOpened={handleCalendarDayOpened}
        onDeleteCalendarSession={handleDeleteCalendarSession}
        onOpenProgram={openProgram}
        onOpenWorkout={openProgramWorkout}
      />
    );
  } else if (screen === "program") {
    screenContent = (
      <ProgramWeeksPage
        programOverview={activeProgramOverview}
        onOpenWorkout={openWorkoutList}
        sessionExerciseIds={sessionExerciseIds}
        completedSetsById={completedSetsById}
        setsByExerciseId={workoutExerciseSetsById}
        onResetProgramToBaseline={handleResetProgramToBaseline}
        onRefreshProgramProgress={handleRefreshProgramProgress}
      />
    );
  } else {
    screenContent = (
      <WorkoutListPage
        workoutTitle={activeWorkoutTitle}
        workoutActive={workoutActive}
        workoutElapsed={workoutElapsed}
        workoutPaused={!isRunning}
        completedSetsById={completedSetsById}
        exercises={listExercises}
        workoutExerciseSetsById={workoutExerciseSetsById}
        onExercisesChange={handleListExercisesChange}
        onStartWorkout={handleStartWorkout}
        onFinishWorkout={requestFinishWorkout}
        onOpenExercise={openExercise}
        onReplaceExercise={handleReplaceExercise}
        onDeleteExercise={handleDeleteExercise}
        exerciseVolumeById={exerciseVolumeById}
        onEditExerciseVolume={handleEditExerciseVolume}
      />
    );
  }

  return (
    <>
      {screenContent}
      <FinishWorkoutConfirmSheet
        open={finishConfirmOpen}
        onCancel={cancelFinishWorkout}
        onConfirm={confirmFinishWorkout}
      />
      <WorkoutFinishReportSheet
        open={finishReportDraft !== null}
        draft={finishReportDraft}
        onClose={dismissFinishReportSheet}
      />
    </>
  );
}
