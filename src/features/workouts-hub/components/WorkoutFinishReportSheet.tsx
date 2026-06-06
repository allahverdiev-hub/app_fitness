import { useEffect } from "react";

import type { WorkoutFinishReportDraft } from "@/features/workouts-hub/utils/workoutReport";

import { CalendarReportDifficultyValue } from "@/features/workouts-hub/components/CalendarReportDifficultyValue";

import { formatDuration } from "@/features/workouts-hub/utils/workoutCalendar";

import { ActionPopup } from "@/shared/ui/ActionPopup";

import { PrimaryActionButton } from "@/shared/ui/ActionButton";

import styles from "./WorkoutFinishReportSheet.module.css";



type WorkoutFinishReportSheetProps = {

  open: boolean;

  draft: WorkoutFinishReportDraft | null;

  onClose: () => void;

};



export function WorkoutFinishReportSheet({

  open,

  draft,

  onClose,

}: WorkoutFinishReportSheetProps) {

  useEffect(() => {

    if (!open) return undefined;

    const onKey = (event: KeyboardEvent) => {

      if (event.key === "Escape") onClose();

    };

    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);

  }, [open, onClose]);



  return (

    <ActionPopup

      open={open && draft !== null}

      title="Отчёт о тренировке"

      onClose={onClose}

    >

      {draft ? (

        <>

          <article className={styles.card}>

            <h3 className={styles.workoutTitle}>{draft.workoutTitle}</h3>

            <dl className={styles.detailList}>

              <div className={styles.row}>

                <dt className={styles.term}>Программа</dt>

                <dd className={styles.value}>{draft.programTitle}</dd>

              </div>

              <div className={styles.row}>

                <dt className={styles.term}>Сложность недели</dt>

                <dd className={styles.value}>

                  <CalendarReportDifficultyValue

                    difficulty={draft.weekDifficulty}

                  />

                </dd>

              </div>

              <div className={styles.row}>

                <dt className={styles.term}>Окончание</dt>

                <dd className={styles.value}>{draft.endedAt}</dd>

              </div>

              <div className={styles.row}>

                <dt className={styles.term}>Длительность</dt>

                <dd className={styles.value}>

                  {formatDuration(draft.durationMinutes)}

                </dd>

              </div>

            </dl>

          </article>

          <PrimaryActionButton className={styles.doneBtn} onClick={onClose}>

            Смотреть отчёт

          </PrimaryActionButton>

        </>

      ) : null}

    </ActionPopup>

  );

}

