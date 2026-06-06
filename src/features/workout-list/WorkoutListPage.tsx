import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { mockWorkoutOverview } from "@/features/workouts/mocks/workoutSession";
import {
  countFullyCompletedExercises,
  isExerciseFullyComplete,
} from "@/features/exercise-page/utils/exerciseStatus";

import pageScrollLayoutStyles from "@/shared/styles/pageScrollLayout.module.css";
import { WorkoutOverviewHeader } from "@/features/workout-list/components/WorkoutOverviewHeader";
import { WorkoutExerciseList } from "@/features/workout-list/components/WorkoutExerciseList";
import { WorkoutListActions } from "@/features/workout-list/components/WorkoutListActions";
import {
  ExerciseActionsSheet,
  type ExerciseMenuAction,
} from "@/features/workout-list/components/ExerciseActionsSheet";
import { ReplaceExerciseSheet } from "@/features/exercise-page/components/replace-exercise-sheet/ReplaceExerciseSheet";
import { ReplaceExerciseCatalogPage } from "@/features/exercise-page/components/replace-exercise-catalog/ReplaceExerciseCatalogPage";
import { DeleteExerciseConfirmSheet } from "@/features/workout-list/components/DeleteExerciseConfirmSheet";
import {
  EditExerciseVolumeSheet,
  type ExerciseVolumeSnapshot,
} from "@/features/workout-list/components/EditExerciseVolumeSheet";
import { DELETE_COLLAPSE_DELAY_MS } from "@/shared/ui/ThanosDissolve";
import { ExerciseReplacedNotice } from "@/shared/ui/ExerciseReplacedNotice";
import type { ExerciseVolumeUpdate } from "@/features/workouts/utils/applyExerciseVolumeChange";
import { formatExerciseListVolume } from "@/features/workouts/utils/formatExerciseListVolume";

import type { WorkoutListExerciseItem } from "@/features/workout-list/types/workoutOverview";

import styles from "./WorkoutListPage.module.css";

type WorkoutListPageProps = {
  workoutTitle: string;
  workoutActive?: boolean;
  workoutElapsed?: string;
  workoutPaused?: boolean;
  onStartWorkout?: (exercisePageId: string) => void;
  onFinishWorkout?: () => void;
  onOpenExercise?: (exercisePageId: string) => void;
  completedSetsById: Record<string, number>;
  exercises: WorkoutListExerciseItem[];
  workoutExerciseSetsById: Record<string, number>;
  onExercisesChange?: (exercises: WorkoutListExerciseItem[]) => void;
  onReplaceExercise: (targetId: string, suggestionId: string) => void;
  onDeleteExercise: (targetId: string) => void;
  exerciseVolumeById: Record<string, ExerciseVolumeSnapshot>;
  onEditExerciseVolume?: (exerciseId: string, update: ExerciseVolumeUpdate) => void;
};

export function WorkoutListPage({
  workoutTitle,
  workoutActive = false,
  workoutElapsed = "0:00",
  workoutPaused = false,
  onStartWorkout,
  onFinishWorkout,
  onOpenExercise,
  completedSetsById,
  exercises: exercisesFromParent,
  workoutExerciseSetsById,
  onExercisesChange,
  onReplaceExercise,
  onDeleteExercise,
  exerciseVolumeById,
  onEditExerciseVolume,
}: WorkoutListPageProps) {
  const overview = useMemo(
    () => ({ ...mockWorkoutOverview, title: workoutTitle }),
    [workoutTitle],
  );
  const savedExercisesRef = useRef(exercisesFromParent);

  const [editing, setEditing] = useState(false);
  const [exercises, setExercises] = useState<WorkoutListExerciseItem[]>(
    () => exercisesFromParent,
  );

  useEffect(() => {
    if (editing) return;
    setExercises(exercisesFromParent);
    savedExercisesRef.current = exercisesFromParent;
  }, [exercisesFromParent, editing]);

  useEffect(() => {
    return () => {
      setEditing(false);
    };
  }, []);

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
  const [editTargetId, setEditTargetId] = useState<string | null>(null);
  const [replaceTargetId, setReplaceTargetId] = useState<string | null>(null);
  const [replaceCatalogOpen, setReplaceCatalogOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [dissolvingId, setDissolvingId] = useState<string | null>(null);
  const [collapsingId, setCollapsingId] = useState<string | null>(null);
  const [replaceRevealId, setReplaceRevealId] = useState<string | null>(null);
  const [replaceNoticeOpen, setReplaceNoticeOpen] = useState(false);

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
      setReplaceCatalogOpen(false);
      setReplaceTargetId(targetId);
      return;
    }

    if (action === "delete") {
      setMenuExercise(null);
      setDeleteTargetId(targetId);
      return;
    }

    if (action === "edit") {
      setEditTargetId(targetId);
    }
  };

  const editTargetExercise = useMemo(
    () => exercises.find((item) => item.id === editTargetId) ?? null,
    [exercises, editTargetId],
  );

  const handleConfirmEditVolume = useCallback(
    (update: ExerciseVolumeUpdate) => {
      if (!editTargetId) return;
      const volume = exerciseVolumeById[editTargetId];
      onEditExerciseVolume?.(editTargetId, update);
      setExercises((prev) =>
        prev.map((item) =>
          item.id === editTargetId
            ? {
                ...item,
                subtitle: formatExerciseListVolume({
                  sets: update.sets,
                  repsRange: update.repsRange,
                  isWarmup: volume?.isWarmup ?? false,
                  warmupVolumeType:
                    update.warmupVolumeType ?? volume?.warmupVolumeType,
                }),
              }
            : item,
        ),
      );
      setEditTargetId(null);
    },
    [editTargetId, exerciseVolumeById, onEditExerciseVolume],
  );

  const handleConfirmDelete = useCallback(() => {
    if (!deleteTargetId) return;
    setDissolvingId(deleteTargetId);
    setDeleteTargetId(null);
  }, [deleteTargetId]);

  // Строка начинает схлопываться, пока пыль ещё в воздухе.
  useEffect(() => {
    if (!dissolvingId) return undefined;
    const timer = window.setTimeout(() => {
      setCollapsingId(dissolvingId);
    }, DELETE_COLLAPSE_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [dissolvingId]);

  // Удаляем из данных только когда пыль полностью осела.
  const handleDissolveComplete = useCallback(
    (targetId: string) => {
      onDeleteExercise(targetId);
      setDissolvingId((current) => (current === targetId ? null : current));
      setCollapsingId((current) => (current === targetId ? null : current));
    },
    [onDeleteExercise],
  );

  const handleCollapseComplete = useCallback(() => undefined, []);

  const handleReplaceExercise = useCallback(
    (targetId: string, suggestionId: string) => {
      onReplaceExercise(targetId, suggestionId);
      setReplaceRevealId(targetId);
      setReplaceNoticeOpen(true);
      setReplaceCatalogOpen(false);
      setReplaceTargetId(null);
    },
    [onReplaceExercise],
  );

  const handleReplaceRevealComplete = useCallback((targetId: string) => {
    setReplaceRevealId((current) => (current === targetId ? null : current));
  }, []);

  const handleSaveWorkout = useCallback(() => {
    savedExercisesRef.current = exercises;
    onExercisesChange?.(exercises);
  }, [exercises, onExercisesChange]);

  const handleEditingChange = useCallback(
    (next: boolean) => {
      if (!next) {
        setExercises(savedExercisesRef.current);
      }
      setEditing(next);
    },
    [],
  );

  const handleAddExercise = useCallback(() => {}, []);

  return (
    <div className={styles.page}>
      <div className={styles.scroll}>
        <div className={pageScrollLayoutStyles.scrollInset}>
          <WorkoutOverviewHeader overview={overviewWithProgress} />
          <WorkoutExerciseList
            exercises={exercisesWithProgress}
            editing={editing}
            dissolvingId={dissolvingId}
            collapsingId={collapsingId}
            replaceRevealId={replaceRevealId}
            onDissolveComplete={handleDissolveComplete}
            onCollapseComplete={handleCollapseComplete}
            onReplaceRevealComplete={handleReplaceRevealComplete}
            onReorder={(next) => {
              setExercises(next);
              if (!editing) onExercisesChange?.(next);
            }}
            onOpenExercise={openExercise}
            onMenu={setMenuExercise}
            onAddExercise={handleAddExercise}
          />
        </div>
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
        />
      </div>
      <ExerciseActionsSheet
        open={menuExercise !== null}
        exerciseTitle={menuExercise?.title ?? ""}
        onClose={() => setMenuExercise(null)}
        onAction={handleMenuAction}
      />
      <ReplaceExerciseSheet
        open={replaceTargetId !== null && !replaceCatalogOpen}
        exerciseId={replaceTargetId ?? ""}
        onClose={() => {
          setReplaceCatalogOpen(false);
          setReplaceTargetId(null);
        }}
        onSelect={(suggestionId) => {
          if (!replaceTargetId) return;
          handleReplaceExercise(replaceTargetId, suggestionId);
        }}
        onViewAll={() => setReplaceCatalogOpen(true)}
      />
      {replaceCatalogOpen && replaceTargetId ? (
        <ReplaceExerciseCatalogPage
          exerciseId={replaceTargetId}
          onBack={() => setReplaceCatalogOpen(false)}
          onConfirm={(suggestionId) => {
            handleReplaceExercise(replaceTargetId, suggestionId);
          }}
        />
      ) : null}
      <EditExerciseVolumeSheet
        open={editTargetId !== null}
        exerciseTitle={editTargetExercise?.title ?? ""}
        volume={editTargetId ? exerciseVolumeById[editTargetId] ?? null : null}
        onClose={() => setEditTargetId(null)}
        onConfirm={handleConfirmEditVolume}
      />
      <DeleteExerciseConfirmSheet
        open={deleteTargetId !== null}
        onCancel={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
      />
      <ExerciseReplacedNotice
        open={replaceNoticeOpen}
        onClose={() => setReplaceNoticeOpen(false)}
      />
    </div>
  );
}
