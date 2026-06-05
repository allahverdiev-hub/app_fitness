import { useCallback, useMemo, useRef, useState } from "react";

import {
  mockWorkoutOverview,
  workoutExerciseSetsById,
} from "@/features/workouts/mocks/workoutSession";
import {
  countFullyCompletedExercises,
  isExerciseFullyComplete,
} from "@/features/exercise-page/utils/exerciseStatus";

import { WorkoutListTopBar } from "@/features/workout-list/components/WorkoutListTopBar";

import { WorkoutOverviewHeader } from "@/features/workout-list/components/WorkoutOverviewHeader";

import { WorkoutExerciseList } from "@/features/workout-list/components/WorkoutExerciseList";

import { WorkoutListActions } from "@/features/workout-list/components/WorkoutListActions";

import {
  ExerciseActionsSheet,
  type ExerciseMenuAction,
} from "@/features/workout-list/components/ExerciseActionsSheet";

import type { WorkoutListExerciseItem } from "@/features/workout-list/types/workoutOverview";

import styles from "./WorkoutListPage.module.css";

type WorkoutListPageProps = {
  onBack?: () => void;
  workoutActive?: boolean;
  workoutElapsed?: string;
  workoutPaused?: boolean;
  onStartWorkout?: (exercisePageId: string) => void;
  onFinishWorkout?: () => void;
  onToggleWorkoutPause?: () => void;
  onOpenExercise?: (exercisePageId: string) => void;
  completedSetsById: Record<string, number>;
};

export function WorkoutListPage({
  onBack,
  workoutActive = false,
  workoutElapsed = "0:00",
  workoutPaused = false,
  onStartWorkout,
  onFinishWorkout,
  onToggleWorkoutPause,
  onOpenExercise,
  completedSetsById,
}: WorkoutListPageProps) {
  const overview = mockWorkoutOverview;
  const baselineExercisesRef = useRef(overview.exercises);

  const [editing, setEditing] = useState(false);
  const [exercises, setExercises] = useState<WorkoutListExerciseItem[]>(
    () => overview.exercises,
  );

  const exercisesWithProgress = useMemo(
    () =>
      exercises.map((item) => {
        const sets = workoutExerciseSetsById[item.id] ?? 0;
        const done = completedSetsById[item.id] ?? 0;
        return {
          ...item,
          completed: isExerciseFullyComplete(sets, done),
        };
      }),
    [exercises, completedSetsById],
  );

  const overviewWithProgress = useMemo(
    () => ({
      ...overview,
      exercises: exercisesWithProgress,
      completedExerciseCount: countFullyCompletedExercises(
        exercisesWithProgress.map((item) => ({
          id: item.id,
          sets: workoutExerciseSetsById[item.id] ?? 0,
        })),
        completedSetsById,
      ),
    }),
    [overview, exercisesWithProgress, completedSetsById],
  );
  const [menuExercise, setMenuExercise] =
    useState<WorkoutListExerciseItem | null>(null);

  const openExercise = (exerciseId: string) => {
    onOpenExercise?.(exerciseId);
  };

  const handleStart = () => {
    const exerciseId = exercises[0]?.id;
    if (exerciseId) onStartWorkout?.(exerciseId);
  };

  const handleMenuAction = (action: ExerciseMenuAction) => {
    if (!menuExercise) return;
    console.log(`workout exercise ${action}`, menuExercise.id);
  };

  const handleSaveWorkout = useCallback(() => {
    baselineExercisesRef.current = exercises;
    console.log(
      "workout save order",
      exercises.map((item) => item.id),
    );
  }, [exercises]);

  const handleEditingChange = useCallback(
    (next: boolean) => {
      if (next) {
        baselineExercisesRef.current = exercises;
      } else {
        setExercises(baselineExercisesRef.current);
      }
      setEditing(next);
    },
    [exercises],
  );

  const handleAddExercise = useCallback(() => {
    console.log("workout add exercise");
  }, []);

  return (
    <div className={styles.page}>
      <WorkoutListTopBar onBack={onBack} />
      <div className={styles.scroll}>
        <WorkoutOverviewHeader overview={overviewWithProgress} />
        <WorkoutExerciseList
          exercises={exercisesWithProgress}
          editing={editing}
          onReorder={setExercises}
          onOpenExercise={openExercise}
          onMenu={setMenuExercise}
          onAddExercise={handleAddExercise}
        />
      </div>
      <div className={styles.actions}>
        <WorkoutListActions
          editing={editing}
          workoutActive={workoutActive}
          workoutElapsed={workoutElapsed}
          workoutPaused={workoutPaused}
          onEditingChange={handleEditingChange}
          onStartWorkout={handleStart}
          onSaveWorkout={handleSaveWorkout}
          onFinishWorkout={onFinishWorkout}
          onToggleWorkoutPause={onToggleWorkoutPause}
        />
      </div>
      <ExerciseActionsSheet
        open={menuExercise !== null}
        exerciseTitle={menuExercise?.title ?? ""}
        onClose={() => setMenuExercise(null)}
        onAction={handleMenuAction}
      />
    </div>
  );
}
