import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { exerciseImages } from "@/features/exercise-page/config/media";
import type { LoadFilter } from "@/features/exercise-page/mocks/progress-chart";
import type { ExerciseItem } from "@/features/exercise-page/types/exercise";
import { useExercisePageLayout } from "@/features/exercise-page/hooks/useExercisePageLayout";
import { useRestTimer } from "@/features/exercise-page/hooks/useRestTimer";
import {
  isWorkoutComplete,
  mapExercisesWithProgress,
} from "@/features/exercise-page/utils/exerciseStatus";
import { getAddSetDefaults } from "@/features/exercise-page/utils/getAddSetDefaults";
import { parseRestDuration } from "@/shared/lib/parseRestDuration";
import type { DiaryLoad } from "@/features/exercise-page/mocks/diary";
import type { AddSetFormValues, LoggedSet } from "@/features/exercise-page/types/set";
import { HeaderNav } from "@/features/exercise-page/components/chrome/HeaderNav";
import { TimerBar } from "@/features/exercise-page/components/chrome/TimerBar";
import { ExerciseCarousel } from "@/features/exercise-page/components/carousel/ExerciseCarousel";
import { ExerciseHeroStage } from "@/features/exercise-page/components/hero/ExerciseHeroStage";
import { ExerciseTitle } from "@/features/exercise-page/components/details/ExerciseTitle";
import { ActionButtonRow } from "@/features/exercise-page/components/details/ActionButtonRow";
import { ExerciseDiary } from "@/features/exercise-page/components/diary/ExerciseDiary";
import { ExerciseProgressChart } from "@/features/exercise-page/components/chart/ExerciseProgressChart";
import {
  BottomBar,
  type AddSetBarPhase,
} from "@/features/exercise-page/components/bottom-bar/BottomBar";
import { AddSetSheet } from "@/features/exercise-page/components/add-set-sheet/AddSetSheet";
import { TechniqueVideoSheet } from "@/features/exercise-page/components/technique-video-sheet/TechniqueVideoSheet";
import { ReplaceExerciseSheet } from "@/features/exercise-page/components/replace-exercise-sheet/ReplaceExerciseSheet";
import { defaultTechniqueVideoUrl } from "@/features/exercise-page/config/techniqueVideo";
import styles from "./ExercisePage.module.css";

const ADD_SET_LOADER_MS = 700;
const ADD_SET_CHECK_HOLD_MS = 800;

export type WorkoutSessionTimer = {
  elapsed: string;
  isPaused: boolean;
  onTogglePause: () => void;
};

type ExercisePageProps = {
  initialExerciseId?: string;
  sessionExercises: ExerciseItem[];
  sessionTimer: WorkoutSessionTimer;
  completedSetsById: Record<string, number>;
  onCompletedSetsChange: Dispatch<SetStateAction<Record<string, number>>>;
  onReplaceExercise: (targetId: string, suggestionId: string) => void;
  onBack?: () => void;
};

export function ExercisePage({
  initialExerciseId,
  sessionExercises,
  sessionTimer,
  completedSetsById,
  onCompletedSetsChange,
  onReplaceExercise,
  onBack,
}: ExercisePageProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const contentScrollRef = useRef<HTMLDivElement>(null);
  const contentSheetRef = useRef<HTMLElement>(null);
  const addSetTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [activeId, setActiveId] = useState(
    () => initialExerciseId ?? sessionExercises[0]?.id ?? "",
  );
  const [loadFilter, setLoadFilter] = useState<LoadFilter>("light");
  const [addSetOpen, setAddSetOpen] = useState(false);
  const [techniqueOpen, setTechniqueOpen] = useState(false);
  const [replaceOpen, setReplaceOpen] = useState(false);
  const [addSetBarPhase, setAddSetBarPhase] = useState<AddSetBarPhase>("idle");
  const { elapsed, isPaused, onTogglePause } = sessionTimer;
  const [loggedSetsById, setLoggedSetsById] = useState<
    Record<string, LoggedSet[]>
  >({});
  const [workoutDiaryLoadById, setWorkoutDiaryLoadById] = useState<
    Record<string, DiaryLoad>
  >({});
  const { remaining, startRest, skipRest } = useRestTimer();

  const exercises = useMemo(
    () =>
      mapExercisesWithProgress(
        sessionExercises,
        activeId,
        completedSetsById,
      ),
    [sessionExercises, activeId, completedSetsById],
  );

  const active = exercises.find((e) => e.id === activeId) ?? exercises[0];
  const completedSets = completedSetsById[active.id] ?? 0;
  const workoutSets = loggedSetsById[active.id] ?? [];
  const workoutDiaryLoad = workoutDiaryLoadById[active.id];

  const addSetDefaults = useMemo(
    () =>
      getAddSetDefaults(
        active.id,
        loadFilter,
        active.repsRange,
        loggedSetsById[active.id],
      ),
    [active.id, active.repsRange, loadFilter, loggedSetsById],
  );

  const clearAddSetTimers = useCallback(() => {
    for (const id of addSetTimers.current) clearTimeout(id);
    addSetTimers.current = [];
  }, []);

  const scheduleAddSetTimer = useCallback((fn: () => void, delay: number) => {
    const id = setTimeout(fn, delay);
    addSetTimers.current.push(id);
  }, []);

  useEffect(() => () => clearAddSetTimers(), [clearAddSetTimers]);

  const runAddSetSuccessAnimation = useCallback(() => {
    setAddSetBarPhase("loading");
    clearAddSetTimers();
    scheduleAddSetTimer(() => {
      setAddSetBarPhase("success");
      scheduleAddSetTimer(() => setAddSetBarPhase("idle"), ADD_SET_CHECK_HOLD_MS);
    }, ADD_SET_LOADER_MS);
  }, [clearAddSetTimers, scheduleAddSetTimer]);

  const handleConfirmAddSet = useCallback(
    (values: AddSetFormValues) => {
      const nextCount = completedSets + 1;
      onCompletedSetsChange((prev) => ({ ...prev, [active.id]: nextCount }));
      setLoggedSetsById((prev) => ({
        ...prev,
        [active.id]: [
          ...(prev[active.id] ?? []),
          { ...values, setNumber: nextCount },
        ],
      }));
      setWorkoutDiaryLoadById((prev) => {
        if (prev[active.id]) return prev;
        const load: DiaryLoad =
          loadFilter === "all" ? "medium" : loadFilter;
        return { ...prev, [active.id]: load };
      });
      setAddSetOpen(false);
      runAddSetSuccessAnimation();
      startRest(parseRestDuration(active.restBetweenSets));
    },
    [
      active.id,
      active.restBetweenSets,
      completedSets,
      loadFilter,
      onCompletedSetsChange,
      runAddSetSuccessAnimation,
      startRest,
    ],
  );

  const handleUndoSet = useCallback(() => {
    if (completedSets <= 0) return;
    onCompletedSetsChange((prev) => ({
      ...prev,
      [active.id]: completedSets - 1,
    }));
    setLoggedSetsById((prev) => {
      const next = (prev[active.id] ?? []).slice(0, -1);
      if (next.length === 0) {
        setWorkoutDiaryLoadById((loads) => {
          const { [active.id]: _, ...rest } = loads;
          return rest;
        });
      }
      return { ...prev, [active.id]: next };
    });
    skipRest();
  }, [active.id, completedSets, onCompletedSetsChange, skipRest]);

  const handleOpenAddSet = useCallback(() => {
    if (addSetBarPhase !== "idle") return;
    setTechniqueOpen(false);
    setReplaceOpen(false);
    setAddSetOpen(true);
  }, [addSetBarPhase]);

  const handleOpenTechnique = useCallback(() => {
    setAddSetOpen(false);
    setReplaceOpen(false);
    setTechniqueOpen(true);
  }, []);

  const handleOpenReplace = useCallback(() => {
    setAddSetOpen(false);
    setTechniqueOpen(false);
    setReplaceOpen(true);
  }, []);

  const activeExerciseIndex = exercises.findIndex((e) => e.id === activeId);
  const hasNextExercise =
    activeExerciseIndex >= 0 && activeExerciseIndex < exercises.length - 1;

  const workoutComplete = useMemo(
    () => isWorkoutComplete(sessionExercises, completedSetsById),
    [sessionExercises, completedSetsById],
  );

  const handleFinishWorkout = useCallback(() => {
    console.log("finish workout");
  }, []);

  const handleNextExercise = useCallback(() => {
    if (!hasNextExercise) return;
    const next = exercises[activeExerciseIndex + 1];
    setActiveId(next.id);
    setAddSetOpen(false);
    skipRest();
  }, [activeExerciseIndex, exercises, hasNextExercise, skipRest]);

  useEffect(() => {
    setActiveId(initialExerciseId);
  }, [initialExerciseId]);

  useExercisePageLayout(
    bodyRef,
    contentScrollRef,
    contentSheetRef,
    initialExerciseId,
  );

  useEffect(() => {
    setTechniqueOpen(false);
  }, [activeId]);

  const techniqueVideoUrl =
    active.techniqueVideoUrl ?? defaultTechniqueVideoUrl;

  return (
    <div className={styles.page}>
      <div ref={bodyRef} className={styles.body}>
        <section className={styles.mediaZone} aria-label="Медиа упражнения">
          <div className={styles.mediaContent} data-exercise-media-stack>
            <div className={styles.timerInMedia}>
              <TimerBar
                elapsed={elapsed}
                isPaused={isPaused}
                onStop={onTogglePause}
              />
            </div>
            <div className={styles.mediaHero}>
              <ExerciseHeroStage
                heroSrc={active.heroSrc}
                videoSrc={exerciseImages.heroVideo}
                alt={active.imageAlt}
                restSecondsRemaining={remaining}
                onSkipRest={skipRest}
              />
            </div>
          </div>
        </section>

        <div
          ref={contentScrollRef}
          className={styles.contentScroll}
          aria-label="Контент упражнения"
        >
          <div className={styles.contentScrollSpacer} aria-hidden />
          <section
            key={initialExerciseId}
            ref={contentSheetRef}
            className={styles.contentSheet}
            aria-label="Панель упражнения"
          >
            <div className={styles.contentSheetHandle} aria-hidden />
            <div className={styles.contentSheetBody}>
              <div className={styles.thumbsAboveTitle}>
                <ExerciseCarousel
                  exercises={exercises}
                  activeId={activeId}
                  onSelect={setActiveId}
                />
              </div>
              <ExerciseTitle
                title={active.title}
                muscles={active.muscles}
                sets={active.sets}
                repsRange={active.repsRange}
              />
              <ActionButtonRow
                description={active.description}
                onTechnique={handleOpenTechnique}
                onReplace={handleOpenReplace}
              />
              <ExerciseProgressChart
                exerciseId={active.id}
                loadFilter={loadFilter}
                onLoadFilterChange={setLoadFilter}
              />
              <ExerciseDiary
                exerciseId={active.id}
                loadFilter={loadFilter}
                workoutSets={workoutSets}
                workoutSessionLoad={workoutDiaryLoad}
              />
            </div>
          </section>
        </div>

        <HeaderNav onBack={onBack} />
      </div>
      <BottomBar
        completedSets={completedSets}
        targetSets={active.sets}
        addSetPhase={addSetBarPhase}
        onOpenAddSet={handleOpenAddSet}
        onUndoSet={handleUndoSet}
        showNextExercise={hasNextExercise}
        onNextExercise={handleNextExercise}
        showFinishWorkout={workoutComplete}
        onFinishWorkout={handleFinishWorkout}
      />
      <AddSetSheet
        open={addSetOpen}
        defaults={addSetDefaults}
        onClose={() => setAddSetOpen(false)}
        onConfirm={handleConfirmAddSet}
      />
      <TechniqueVideoSheet
        open={techniqueOpen}
        videoUrl={techniqueVideoUrl}
        title={`Техника · ${active.title}`}
        onClose={() => setTechniqueOpen(false)}
      />
      <ReplaceExerciseSheet
        open={replaceOpen}
        exerciseId={active.id}
        onClose={() => setReplaceOpen(false)}
        onSelect={(suggestionId) =>
          onReplaceExercise(active.id, suggestionId)
        }
        onViewAll={() => console.log("view all exercises", active.id)}
      />
    </div>
  );
}
