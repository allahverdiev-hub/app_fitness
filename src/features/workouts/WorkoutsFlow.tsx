import { useCallback, useEffect, useMemo, useState } from "react";
import { ExercisePage } from "@/features/exercise-page/ExercisePage";
import { buildInitialCompletedSets } from "@/features/exercise-page/utils/exerciseStatus";
import { useWorkoutTimer } from "@/features/workouts/hooks/useWorkoutTimer";
import { mockWorkout } from "@/features/workouts/mocks/workoutSession";
import { WorkoutListPage } from "@/features/workout-list/WorkoutListPage";
import {
  formatWorkoutElapsed,
  formatWorkoutElapsedCompact,
} from "@/shared/lib/workoutElapsed";

export type WorkoutsScreen = "list" | "exercise";

type WorkoutsFlowProps = {
  onScreenChange?: (screen: WorkoutsScreen) => void;
};

export function WorkoutsFlow({ onScreenChange }: WorkoutsFlowProps = {}) {
  const [screen, setScreen] = useState<WorkoutsScreen>("list");
  const [exerciseId, setExerciseId] = useState(mockWorkout.activeExerciseId);
  const [workoutActive, setWorkoutActive] = useState(false);
  const [completedSetsById, setCompletedSetsById] = useState(() =>
    buildInitialCompletedSets(mockWorkout.exercises),
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

  useEffect(() => {
    onScreenChange?.(screen);
  }, [screen, onScreenChange]);

  if (screen === "exercise") {
    return (
      <ExercisePage
        initialExerciseId={exerciseId}
        sessionTimer={sessionTimer}
        completedSetsById={completedSetsById}
        onCompletedSetsChange={setCompletedSetsById}
        onBack={() => setScreen("list")}
      />
    );
  }

  return (
    <WorkoutListPage
      onBack={() => console.log("workouts back")}
      workoutActive={workoutActive}
      workoutElapsed={workoutElapsed}
      workoutPaused={!isRunning}
      completedSetsById={completedSetsById}
      onStartWorkout={handleStartWorkout}
      onFinishWorkout={handleFinishWorkout}
      onToggleWorkoutPause={toggleRunning}
      onOpenExercise={openExercise}
    />
  );
}
