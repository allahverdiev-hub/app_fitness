import { useEffect } from "react";
import type { WorkoutCalendarSession } from "@/features/workouts-hub/types/workoutsHub";
import {
  formatDuration,
  formatSessionDateLabel,
} from "@/features/workouts-hub/utils/workoutCalendar";
import { ActionPopup } from "@/shared/ui/ActionPopup";
import styles from "./WorkoutDayDetailSheet.module.css";

type WorkoutDayDetailSheetProps = {
  open: boolean;
  sessions: readonly WorkoutCalendarSession[];
  onClose: () => void;
};

export function WorkoutDayDetailSheet({
  open,
  sessions,
  onClose,
}: WorkoutDayDetailSheetProps) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const title =
    sessions.length > 0
      ? formatSessionDateLabel(sessions[0].date)
      : "Тренировка";

  return (
    <ActionPopup open={open && sessions.length > 0} title={title} onClose={onClose}>
      <ul className={styles.list}>
        {sessions.map((session) => (
          <li key={session.id} className={styles.card}>
            <dl className={styles.detailList}>
              <div className={styles.row}>
                <dt className={styles.term}>Дата</dt>
                <dd className={styles.value}>
                  {formatSessionDateLabel(session.date)}
                </dd>
              </div>
              <div className={styles.row}>
                <dt className={styles.term}>Программа</dt>
                <dd className={styles.value}>{session.programTitle}</dd>
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
          </li>
        ))}
      </ul>
    </ActionPopup>
  );
}
