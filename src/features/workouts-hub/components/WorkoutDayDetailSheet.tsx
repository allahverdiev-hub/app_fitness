import { useCallback, useEffect, useState } from "react";

import type { WorkoutCalendarSession } from "@/features/workouts-hub/types/workoutsHub";

import {

  formatDuration,

  formatSessionDateLabel,

} from "@/features/workouts-hub/utils/workoutCalendar";

import { CalendarReportDifficultyValue } from "@/features/workouts-hub/components/CalendarReportDifficultyValue";

import { DeleteReportConfirmSheet } from "@/features/workouts-hub/components/DeleteReportConfirmSheet";

import { DeleteAnimatedListItem } from "@/features/workout-list/components/DeleteAnimatedListItem";

import { IconTrash } from "@/shared/icons";

import { ActionPopup } from "@/shared/ui/ActionPopup";

import { Level2ActionButton } from "@/shared/ui/ActionButton";

import { DELETE_COLLAPSE_DELAY_MS, ThanosDissolve } from "@/shared/ui/ThanosDissolve";

import styles from "./WorkoutDayDetailSheet.module.css";



type WorkoutDayDetailSheetProps = {

  open: boolean;

  sessions: readonly WorkoutCalendarSession[];

  onClose: () => void;

  onDeleteSession?: (sessionId: string) => void;

};



export function WorkoutDayDetailSheet({

  open,

  sessions,

  onClose,

  onDeleteSession,

}: WorkoutDayDetailSheetProps) {

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const [dissolvingId, setDissolvingId] = useState<string | null>(null);

  const [collapsingId, setCollapsingId] = useState<string | null>(null);



  useEffect(() => {

    if (!open) return undefined;

    const onKey = (event: KeyboardEvent) => {

      if (event.key === "Escape" && deleteTargetId === null) onClose();

    };

    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);

  }, [open, onClose, deleteTargetId]);



  useEffect(() => {

    if (!open) {

      setDeleteTargetId(null);

      setDissolvingId(null);

      setCollapsingId(null);

    }

  }, [open]);



  useEffect(() => {

    if (!dissolvingId) return undefined;

    const timer = window.setTimeout(() => {

      setCollapsingId(dissolvingId);

    }, DELETE_COLLAPSE_DELAY_MS);

    return () => window.clearTimeout(timer);

  }, [dissolvingId]);



  const handleConfirmDelete = useCallback(() => {

    if (!deleteTargetId) return;

    setDissolvingId(deleteTargetId);

    setDeleteTargetId(null);

  }, [deleteTargetId]);



  const handleDissolveComplete = useCallback(

    (sessionId: string) => {

      onDeleteSession?.(sessionId);

      setDissolvingId((current) => (current === sessionId ? null : current));

      setCollapsingId((current) => (current === sessionId ? null : current));

    },

    [onDeleteSession],

  );



  const title =

    sessions.length > 0

      ? formatSessionDateLabel(sessions[0].date)

      : "Тренировка";



  return (

    <>

      <ActionPopup open={open && sessions.length > 0} title={title} onClose={onClose}>

        <ul className={styles.list}>

          {sessions.map((session) => {

            const isDeleting =

              dissolvingId === session.id || collapsingId === session.id;



            return (

              <DeleteAnimatedListItem

                key={session.id}

                itemKey={session.id}

                isCollapsing={collapsingId === session.id}

                className={`${styles.listItem} ${

                  dissolvingId === session.id ? styles.listItemDissolving : ""

                }`}

                onCollapseComplete={() => undefined}

              >

                <ThanosDissolve

                  active={dissolvingId === session.id}

                  onComplete={() => handleDissolveComplete(session.id)}

                >

                  <div className={styles.card}>

                    <h3 className={styles.workoutTitle}>{session.workoutTitle}</h3>

                    <dl className={styles.detailList}>

                      <div className={styles.row}>

                        <dt className={styles.term}>Программа</dt>

                        <dd className={styles.value}>{session.programTitle}</dd>

                      </div>

                      <div className={styles.row}>

                        <dt className={styles.term}>Сложность недели</dt>

                        <dd className={styles.value}>

                          <CalendarReportDifficultyValue

                            difficulty={session.weekDifficulty}

                          />

                        </dd>

                      </div>

                      <div className={styles.row}>

                        <dt className={styles.term}>Окончание</dt>

                        <dd className={styles.value}>{session.endedAt}</dd>

                      </div>

                      <div className={styles.row}>

                        <dt className={styles.term}>Длительность</dt>

                        <dd className={styles.value}>

                          {formatDuration(session.durationMinutes)}

                        </dd>

                      </div>

                    </dl>

                    {onDeleteSession ? (

                      <Level2ActionButton

                        block

                        danger

                        className={styles.deleteBtn}

                        icon={<IconTrash size={16} aria-hidden />}

                        disabled={isDeleting}

                        onClick={() => setDeleteTargetId(session.id)}

                      >

                        Удалить отчёт

                      </Level2ActionButton>

                    ) : null}

                  </div>

                </ThanosDissolve>

              </DeleteAnimatedListItem>

            );

          })}

        </ul>

      </ActionPopup>

      <DeleteReportConfirmSheet

        open={deleteTargetId !== null}

        onCancel={() => setDeleteTargetId(null)}

        onConfirm={handleConfirmDelete}

      />

    </>

  );

}

