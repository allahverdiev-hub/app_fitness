import { useCallback, useEffect, useMemo, useState } from "react";
import { DEMO_TODAY } from "@/features/workouts-hub/utils/workoutReport";
import {
  ProgramCardsCarousel,
  type ProgramCarouselItem,
} from "@/features/workouts-hub/components/ProgramCardsCarousel";
import { ProgramNextWorkoutsSection } from "@/features/workouts-hub/components/ProgramNextWorkoutsSection";
import { ProgramsTabPicker } from "@/features/workouts-hub/components/ProgramsTabPicker";
import { WorkoutCalendarWidget } from "@/features/workouts-hub/components/WorkoutCalendarWidget";
import { WorkoutDayDetailSheet } from "@/features/workouts-hub/components/WorkoutDayDetailSheet";
import { mockHubPrograms } from "@/features/workouts-hub/mocks/workoutsHubMock";
import { getHubProgramActiveWeekBlock } from "@/features/workouts-hub/utils/programNextStep";
import type { ProgramSessionProgress } from "@/features/workouts-hub/utils/programNextStep";
import { getProgramOverviewById } from "@/features/workouts-hub/utils/programRegistry";
import { getSessionsForDate } from "@/features/workouts-hub/utils/workoutCalendar";
import type {
  HubProgramsTab,
  WorkoutCalendarSession,
} from "@/features/workouts-hub/types/workoutsHub";
import { PageTitle } from "@/shared/ui/PageTitle/PageTitle";
import styles from "./WorkoutsHubPage.module.css";

type WorkoutsHubPageProps = {
  sessionProgress: ProgramSessionProgress;
  calendarSessions: readonly WorkoutCalendarSession[];
  /** Открыть день в календаре после сохранения отчёта */
  calendarDayToOpen?: string | null;
  onCalendarDayOpened?: () => void;
  onDeleteCalendarSession?: (sessionId: string) => void;
  onOpenProgram?: (programId: string) => void;
  onOpenWorkout?: (programId: string, workoutId: string) => void;
};

export function WorkoutsHubPage({
  sessionProgress,
  calendarSessions,
  calendarDayToOpen = null,
  onCalendarDayOpened,
  onDeleteCalendarSession,
  onOpenProgram,
  onOpenWorkout,
}: WorkoutsHubPageProps) {
  const [activeTab, setActiveTab] = useState<HubProgramsTab>("mine");
  const [calendarDay, setCalendarDay] = useState<string | null>(null);
  const [activeProgramIndex, setActiveProgramIndex] = useState(0);

  useEffect(() => {
    if (!calendarDayToOpen) return;
    const daySessions = getSessionsForDate(calendarSessions, calendarDayToOpen);
    if (daySessions.length === 0) return;
    setActiveTab("mine");
    setCalendarDay(calendarDayToOpen);
    onCalendarDayOpened?.();
  }, [calendarDayToOpen, calendarSessions, onCalendarDayOpened]);

  const calendarDaySessions = useMemo(
    () =>
      calendarDay
        ? getSessionsForDate(calendarSessions, calendarDay)
        : [],
    [calendarDay, calendarSessions],
  );

  const handleDeleteSession = useCallback(
    (sessionId: string) => {
      onDeleteCalendarSession?.(sessionId);
      if (calendarDay) {
        const remaining = getSessionsForDate(calendarSessions, calendarDay).filter(
          (session) => session.id !== sessionId,
        );
        if (remaining.length === 0) {
          setCalendarDay(null);
        }
      }
    },
    [calendarDay, calendarSessions, onDeleteCalendarSession],
  );

  const programCarouselItems = useMemo((): ProgramCarouselItem[] => {
    return mockHubPrograms.map((program) => ({
      program,
      title:
        getProgramOverviewById(program.programId)?.title ?? program.programId,
    }));
  }, []);

  const activeProgramWeek = useMemo(() => {
    const program = mockHubPrograms[activeProgramIndex];
    if (!program) return null;

    const overview = getProgramOverviewById(program.programId);
    if (!overview) return null;

    const week = getHubProgramActiveWeekBlock(overview, sessionProgress);
    if (!week) return null;

    return {
      programId: program.programId,
      week,
    };
  }, [activeProgramIndex, sessionProgress]);

  return (
    <div className={styles.page}>
      <div className={styles.scroll}>
        <div className={styles.content}>
          <section className={styles.programsSection}>
            <PageTitle className={styles.sectionTitle}>Программы</PageTitle>
            <ProgramsTabPicker
              active={activeTab}
              mineCount={mockHubPrograms.length}
              onChange={(tab) => {
                setActiveTab(tab);
                if (tab === "catalog") setCalendarDay(null);
              }}
            />
            {activeTab === "mine" ? (
              <ProgramCardsCarousel
                items={programCarouselItems}
                activeIndex={activeProgramIndex}
                onActiveIndexChange={setActiveProgramIndex}
                onOpenProgram={onOpenProgram}
              />
            ) : (
              <p className={styles.catalogPlaceholder}>
                Каталог программ скоро появится здесь
              </p>
            )}
          </section>
          {activeTab === "mine" && activeProgramWeek ? (
            <ProgramNextWorkoutsSection
              programId={activeProgramWeek.programId}
              week={activeProgramWeek.week}
              onOpenWorkout={onOpenWorkout}
            />
          ) : null}
          {activeTab === "mine" ? (
            <WorkoutCalendarWidget
              sessions={calendarSessions}
              referenceDate={DEMO_TODAY}
              focusDate={calendarDayToOpen}
              onDayOpen={setCalendarDay}
            />
          ) : null}
        </div>
      </div>
      <WorkoutDayDetailSheet
        open={calendarDay !== null}
        sessions={calendarDaySessions}
        onClose={() => setCalendarDay(null)}
        onDeleteSession={onDeleteCalendarSession ? handleDeleteSession : undefined}
      />
    </div>
  );
}
