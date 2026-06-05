import { useMemo } from "react";
import { IconMore, IconSignalBars } from "@/shared/icons";
import type { LoadFilter } from "@/features/exercise-page/mocks/progress-chart";
import {
  buildExerciseDiarySessions,
  diaryLoadMeta,
  formatSetLine,
  type DiaryLoad,
} from "@/features/exercise-page/mocks/diary";
import type { LoggedSet } from "@/features/exercise-page/types/set";
import styles from "./ExerciseDiary.module.css";

type ExerciseDiaryProps = {
  exerciseId: string;
  loadFilter: LoadFilter;
  workoutSets?: LoggedSet[];
  workoutSessionLoad?: DiaryLoad;
};

export function ExerciseDiary({
  exerciseId,
  loadFilter,
  workoutSets = [],
  workoutSessionLoad,
}: ExerciseDiaryProps) {
  const sessions = useMemo(
    () =>
      buildExerciseDiarySessions(
        exerciseId,
        loadFilter,
        workoutSets,
        workoutSessionLoad,
      ),
    [exerciseId, loadFilter, workoutSets, workoutSessionLoad],
  );

  return (
    <section className={styles.section} aria-label="История подходов">
      <div className={styles.sessions}>
        {sessions.map((session) => {
          const loadMeta = diaryLoadMeta[session.load];

          return (
            <article key={session.id} aria-labelledby={`${session.id}-date`}>
              <div className={styles.sessionHeader}>
                <span id={`${session.id}-date`} className={styles.sessionDate}>
                  {session.dateLabel}
                </span>
                <div className={styles.intensity}>
                  <span
                    className={styles.intensityLabel}
                    style={{ color: loadMeta.color }}
                  >
                    {loadMeta.label}
                  </span>
                  <IconSignalBars
                    size={16}
                    activeCount={loadMeta.signalBars}
                    activeColor={loadMeta.color}
                  />
                </div>
              </div>

              <ul className={styles.setList}>
                {session.sets.map((set) => (
                  <li key={`${session.id}-set-${set.setNumber}`}>
                    <div className={styles.setCard}>
                      <div className={styles.setRow}>
                        <span className={styles.setNumber}>{set.setNumber}</span>
                        <span className={styles.setLine}>
                          {formatSetLine(set.weightKg, set.reps)}
                        </span>
                        <button
                          type="button"
                          className={styles.menuBtn}
                          aria-label={`Действия с подходом ${set.setNumber}`}
                          onClick={() =>
                            console.log("diary set menu", session.id, set.setNumber)
                          }
                        >
                          <IconMore size={20} />
                        </button>
                      </div>
                      {set.note ? (
                        <p className={styles.setNote}>{set.note}</p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </section>
  );
}
