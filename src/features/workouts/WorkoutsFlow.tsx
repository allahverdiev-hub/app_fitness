import { useCallback, useEffect, useMemo, useState } from "react";
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
  type WorkoutSessionExerciseDef,
} from "@/features/workouts/mocks/workoutSession";
import { applyExerciseDeletion } from "@/features/workouts/utils/deleteExercise";
import { applyExerciseReplacement } from "@/features/workouts/utils/replaceExercise";
import { WorkoutsHubPage } from "@/features/workouts-hub/WorkoutsHubPage";
import { getProgramOverviewById } from "@/features/workouts-hub/utils/programRegistry";
import {
  defaultProgramWorkoutId,
  mockProgramOverview,
} from "@/features/program-weeks/mocks/programWeeksMock";
import { ProgramWeeksPage } from "@/features/program-weeks/ProgramWeeksPage";
import { getProgramWorkoutTitleById } from "@/features/program-weeks/utils/programWorkoutLookup";
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
  const [exerciseDefs, setExerciseDefs] = useState<WorkoutSessionExerciseDef[]>(
    cloneWorkoutSessionExercises,
  );
  const [completedSetsById, setCompletedSetsById] = useState(() =>
    buildInitialCompletedSets(toExerciseItems(cloneWorkoutSessionExercises())),
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

  const handleStartWorkout = useCallback(
    (pageId: string) => {
      start();
      setWorkoutActive(true);
      openExercise(pageId);
    },
    [openExercise, start],
  );

  const handleFinishWorkout = useCallback(() => {
    reset();
    setWorkoutActive(false);
    setScreen("list");
  }, [reset]);

  const handleReplaceExercise = useCallback(
    (targetId: string, suggestionId: string) => {
      setExerciseDefs((prev) =>
        applyExerciseReplacement(prev, targetId, suggestionId),
      );
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
      setExerciseDefs((prev) => {
        const byId = Object.fromEntries(prev.map((def) => [def.id, def]));
        return items.flatMap((item) => {
          const def = byId[item.id];
          if (!def) return [];

          const next: WorkoutSessionExerciseDef = { ...def };
          if (item.section !== undefined) {
            next.listSection = item.section;
          } else {
            delete next.listSection;
          }
          return [next];
        });
      });
    },
    [],
  );

  useEffect(() => {
    onScreenChange?.(screen);
  }, [screen, onScreenChange]);

  useTabPopSignal(popSignal, popWorkoutsScreen, setScreen);

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

  if (screen === "exercise") {
    return (
      <ExercisePage
        initialExerciseId={exerciseId}
        sessionExercises={sessionExercises}
        sessionTimer={sessionTimer}
        completedSetsById={completedSetsById}
        onCompletedSetsChange={setCompletedSetsById}
        onReplaceExercise={handleReplaceExercise}
      />
    );
  }

  if (screen === "hub") {
    return (
      <WorkoutsHubPage
        sessionProgress={{
          sessionExerciseIds,
          completedSetsById,
          setsByExerciseId: workoutExerciseSetsById,
        }}
        onOpenProgram={openProgram}
        onOpenWorkout={openProgramWorkout}
      />
    );
  }

  if (screen === "program") {
    return (
      <ProgramWeeksPage
        programOverview={activeProgramOverview}
        onOpenWorkout={openWorkoutList}
        sessionExerciseIds={sessionExerciseIds}
        completedSetsById={completedSetsById}
        setsByExerciseId={workoutExerciseSetsById}
      />
    );
  }

  return (
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
      onFinishWorkout={handleFinishWorkout}
      onToggleWorkoutPause={toggleRunning}
      onOpenExercise={openExercise}
      onReplaceExercise={handleReplaceExercise}
      onDeleteExercise={handleDeleteExercise}
    />
  );
}
