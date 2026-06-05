import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { mockWorkoutOverview } from "@/features/workouts/mocks/workoutSession";
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
import { ReplaceExerciseSheet } from "@/features/exercise-page/components/replace-exercise-sheet/ReplaceExerciseSheet";
import { DeleteExerciseConfirmSheet } from "@/features/workout-list/components/DeleteExerciseConfirmSheet";

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
  exercises: WorkoutListExerciseItem[];
  workoutExerciseSetsById: Record<string, number>;
  onExercisesChange?: (exercises: WorkoutListExerciseItem[]) => void;
  onReplaceExercise: (targetId: string, suggestionId: string) => void;
  onDeleteExercise: (targetId: string) => void;
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
  exercises: exercisesFromParent,
  workoutExerciseSetsById,
  onExercisesChange,
  onReplaceExercise,
  onDeleteExercise,
}: WorkoutListPageProps) {
  const overview = mockWorkoutOverview;
  const baselineExercisesRef = useRef(exercisesFromParent);

  const [editing, setEditing] = useState(false);
  const [exercises, setExercises] = useState<WorkoutListExerciseItem[]>(
    () => exercisesFromParent,
  );

  useEffect(() => {
    if (editing) return;
    setExercises(exercisesFromParent);
    baselineExercisesRef.current = exercisesFromParent;
  }, [exercisesFromParent, editing]);

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
    [exercises, completedSetsById, workoutExerciseSetsById],
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
    [overview, exercisesWithProgress, completedSetsById, workoutExerciseSetsById],
  );

  const [menuExercise, setMenuExercise] =
    useState<WorkoutListExerciseItem | null>(null);
  const [replaceTargetId, setReplaceTargetId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [dissolvingId, setDissolvingId] = useState<string | null>(null);
  const [collapsingId, setCollapsingId] = useState<string | null>(null);

  const openExercise = (exerciseId: string) => {
    onOpenExercise?.(exerciseId);
  };

  const handleStart = () => {
    const exerciseId = exercises[0]?.id;
    if (exerciseId) onStartWorkout?.(exerciseId);
  };

  const handleMenuAction = (action: ExerciseMenuAction) => {
    if (!menuExercise) return;
    const targetId = menuExercise.id;

    if (action === "replace") {
      setMenuExercise(null);
      setReplaceTargetId(targetId);
      return;
    }

    if (action === "delete") {
      setMenuExercise(null);
      setDeleteTargetId(targetId);
      return;
    }

    console.log(`workout exercise ${action}`, targetId);
  };

  const handleConfirmDelete = useCallback(() => {
    if (!deleteTargetId) return;
    setDissolvingId(deleteTargetId);
    setDeleteTargetId(null);
  }, [deleteTargetId]);

  const handleDissolveComplete = useCallback((targetId: string) => {
    setCollapsingId(targetId);
  }, []);

  const handleCollapseComplete = useCallback(
    (targetId: string) => {
      onDeleteExercise(targetId);
      setDissolvingId((current) => (current === targetId ? null : current));
      setCollapsingId((current) => (current === targetId ? null : current));
    },
    [onDeleteExercise],
  );

  const handleSaveWorkout = useCallback(() => {
    baselineExercisesRef.current = exercises;
    onExercisesChange?.(exercises);
    console.log(
      "workout save order",
      exercises.map((item) => item.id),
    );
  }, [exercises, onExercisesChange]);

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
          dissolvingId={dissolvingId}
          collapsingId={collapsingId}
          onDissolveComplete={handleDissolveComplete}
          onCollapseComplete={handleCollapseComplete}
          onReorder={(next) => {
            setExercises(next);
            if (!editing) onExercisesChange?.(next);
          }}
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
      <ReplaceExerciseSheet
        open={replaceTargetId !== null}
        exerciseId={replaceTargetId ?? ""}
        onClose={() => setReplaceTargetId(null)}
        onSelect={(suggestionId) => {
          if (!replaceTargetId) return;
          onReplaceExercise(replaceTargetId, suggestionId);
        }}
        onViewAll={() => console.log("view all exercises", replaceTargetId)}
      />
      <DeleteExerciseConfirmSheet
        open={deleteTargetId !== null}
        onCancel={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
