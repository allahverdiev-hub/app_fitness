import { useCallback, useEffect, useMemo, useState } from "react";
import { ExercisePage } from "@/features/exercise-page/ExercisePage";
import { buildInitialCompletedSets } from "@/features/exercise-page/utils/exerciseStatus";
import { useWorkoutTimer } from "@/features/workouts/hooks/useWorkoutTimer";
import {
  cloneWorkoutSessionExercises,
  mockWorkout,
  toExerciseItems,
  toListExerciseItems,
  buildWorkoutExerciseSetsById,
  type WorkoutSessionExerciseDef,
} from "@/features/workouts/mocks/workoutSession";
import { applyExerciseDeletion } from "@/features/workouts/utils/deleteExercise";
import { applyExerciseReplacement } from "@/features/workouts/utils/replaceExercise";
import { ProgramWeeksPage } from "@/features/program-weeks/ProgramWeeksPage";
import { WorkoutListPage } from "@/features/workout-list/WorkoutListPage";
import type { WorkoutListExerciseItem } from "@/features/workout-list/types/workoutOverview";
import {
  formatWorkoutElapsed,
  formatWorkoutElapsedCompact,
} from "@/shared/lib/workoutElapsed";

export type WorkoutsScreen = "program" | "list" | "exercise";

type WorkoutsFlowProps = {
  onScreenChange?: (screen: WorkoutsScreen) => void;
};

export function WorkoutsFlow({ onScreenChange }: WorkoutsFlowProps = {}) {
  const [screen, setScreen] = useState<WorkoutsScreen>("program");
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
        return items
          .map((item) => {
            const def = byId[item.id];
            if (!def) return null;
            return {
              ...def,
              listSection: item.section,
            };
          })
          .filter((def): def is WorkoutSessionExerciseDef => def != null);
      });
    },
    [],
  );

  useEffect(() => {
    onScreenChange?.(screen);
  }, [screen, onScreenChange]);

  const openWorkoutList = useCallback(() => {
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
        onBack={() => setScreen("list")}
      />
    );
  }

  if (screen === "program") {
    return (
      <ProgramWeeksPage
        onOpenWorkout={openWorkoutList}
        sessionExerciseIds={sessionExerciseIds}
        completedSetsById={completedSetsById}
        setsByExerciseId={workoutExerciseSetsById}
      />
    );
  }

  return (
    <WorkoutListPage
      onBack={() => setScreen("program")}
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
