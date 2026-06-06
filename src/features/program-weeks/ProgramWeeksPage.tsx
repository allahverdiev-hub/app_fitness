import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ProgramSettingsSheet,
  type ProgramSettingsAction,
} from "@/features/program-weeks/components/ProgramSettingsSheet";
import { mockProgramWeekPicker } from "@/features/program-weeks/mocks/programWeeksMock";
import type { ProgramOverview } from "@/features/program-weeks/types/programWeeks";
import {
  ProgramWeekPicker,
  type ProgramWeekPickerOption,
} from "@/features/program-weeks/components/ProgramWeekPicker";
import { ProgramOverviewHeader } from "@/features/program-weeks/components/ProgramOverviewHeader";
import { ProgramWeekSection } from "@/features/program-weeks/components/ProgramWeekSection";
import {
  computeProgramWorkoutStats,
  enrichProgramOverview,
} from "@/features/program-weeks/utils/workoutProgress";
import styles from "./ProgramWeeksPage.module.css";

const ANCHOR_SCROLL_RELEASE_MS = 900;

type ProgramWeeksPageProps = {
  programOverview: ProgramOverview;
  onOpenWorkout?: (workoutId: string) => void;
  sessionExerciseIds: readonly string[];
  completedSetsById: Record<string, number>;
  setsByExerciseId: Record<string, number>;
  onResetProgramToBaseline?: () => void;
  onRefreshProgramProgress?: () => void;
};

export function ProgramWeeksPage({
  programOverview,
  onOpenWorkout,
  sessionExerciseIds,
  completedSetsById,
  setsByExerciseId,
  onResetProgramToBaseline,
  onRefreshProgramProgress,
}: ProgramWeeksPageProps) {
  const [activeWeekNumber, setActiveWeekNumber] = useState(1);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);
  const pickerStickyRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isAnchorScrollingRef = useRef(false);
  const anchorScrollTimerRef = useRef<number | null>(null);

  const overview = useMemo(
    () =>
      enrichProgramOverview(
        programOverview,
        sessionExerciseIds,
        completedSetsById,
        setsByExerciseId,
      ),
    [programOverview, sessionExerciseIds, completedSetsById, setsByExerciseId],
  );

  const programStats = useMemo(
    () => computeProgramWorkoutStats(overview.weeks),
    [overview.weeks],
  );

  const sortedWeeks = useMemo(
    () => [...overview.weeks].sort((a, b) => a.weekNumber - b.weekNumber),
    [overview.weeks],
  );

  const releaseAnchorScrollLock = useCallback(() => {
    isAnchorScrollingRef.current = false;
    if (anchorScrollTimerRef.current !== null) {
      window.clearTimeout(anchorScrollTimerRef.current);
      anchorScrollTimerRef.current = null;
    }
  }, []);

  const handleAnchorNavigate = useCallback(
    (option: ProgramWeekPickerOption) => {
      const scrollRoot = scrollRef.current;
      const target = document.getElementById(option.anchorId);

      isAnchorScrollingRef.current = true;
      setActiveWeekNumber(option.weekNumber);

      if (anchorScrollTimerRef.current !== null) {
        window.clearTimeout(anchorScrollTimerRef.current);
      }

      target?.scrollIntoView({ behavior: "smooth", block: "start" });

      const onScrollEnd = () => {
        releaseAnchorScrollLock();
        scrollRoot?.removeEventListener("scrollend", onScrollEnd);
      };

      if (scrollRoot && "onscrollend" in scrollRoot) {
        scrollRoot.addEventListener("scrollend", onScrollEnd, { once: true });
      }

      anchorScrollTimerRef.current = window.setTimeout(
        releaseAnchorScrollLock,
        ANCHOR_SCROLL_RELEASE_MS,
      );
    },
    [releaseAnchorScrollLock],
  );

  useEffect(() => {
    const syncHeaderHeight = () => {
      const picker = pickerStickyRef.current;
      const page = pageRef.current;
      if (!picker || !page) return;

      page.style.setProperty(
        "--program-page-header-height",
        `${picker.offsetHeight}px`,
      );
    };

    syncHeaderHeight();
    window.addEventListener("resize", syncHeaderHeight);
    return () => window.removeEventListener("resize", syncHeaderHeight);
  }, []);

  useEffect(() => {
    return () => releaseAnchorScrollLock();
  }, [releaseAnchorScrollLock]);

  useEffect(() => {
    const scrollRoot = scrollRef.current;
    const pickerSticky = pickerStickyRef.current;
    if (!scrollRoot || !pickerSticky) return;

    let frame = 0;

    const updateActiveWeekFromScroll = () => {
      if (isAnchorScrollingRef.current) return;

      const marker = pickerSticky.getBoundingClientRect().bottom + 16;
      let nextActiveWeek = sortedWeeks[0]?.weekNumber ?? 1;

      for (const week of sortedWeeks) {
        const section = document.getElementById(week.id);
        if (!section) continue;

        if (section.getBoundingClientRect().top <= marker) {
          nextActiveWeek = week.weekNumber;
        }
      }

      setActiveWeekNumber((current) =>
        current === nextActiveWeek ? current : nextActiveWeek,
      );
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateActiveWeekFromScroll);
    };

    scrollRoot.addEventListener("scroll", onScroll, { passive: true });
    updateActiveWeekFromScroll();

    return () => {
      scrollRoot.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [sortedWeeks]);

  const handleSettingsAction = useCallback(
    (action: ProgramSettingsAction) => {
      if (action === "reset") {
        onResetProgramToBaseline?.();
      } else {
        onRefreshProgramProgress?.();
      }
    },
    [onRefreshProgramProgress, onResetProgramToBaseline],
  );

  return (
    <div ref={pageRef} className={styles.page}>
      <div ref={scrollRef} className={styles.scroll}>
        <div className={styles.content}>
          <div ref={pickerStickyRef} className={styles.pickerSticky}>
            <ProgramWeekPicker
              options={mockProgramWeekPicker}
              activeWeekNumber={activeWeekNumber}
              onAnchorNavigate={handleAnchorNavigate}
            />
          </div>
          <ProgramOverviewHeader
            title={overview.title}
            completedWorkouts={programStats.completedWorkouts}
            totalWorkouts={programStats.totalWorkouts}
            onSettings={() => setSettingsOpen(true)}
          />
          <div className={styles.weeks}>
            {sortedWeeks.map((week) => (
              <ProgramWeekSection
                key={week.id}
                week={week}
                onOpenWorkout={onOpenWorkout}
              />
            ))}
          </div>
        </div>
      </div>
      <ProgramSettingsSheet
        open={settingsOpen}
        programTitle={overview.title}
        onClose={() => setSettingsOpen(false)}
        onAction={handleSettingsAction}
      />
    </div>
  );
}
