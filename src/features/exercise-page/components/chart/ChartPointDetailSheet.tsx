import { useEffect } from "react";
import { IconSignalBars } from "@/shared/icons";
import { ActionPopup } from "@/shared/ui/ActionPopup";
import { diaryLoadMeta } from "@/features/exercise-page/mocks/diary";
import type { ChartPointDetail } from "@/features/exercise-page/utils/chartPointDetail";
import { formatSetLine } from "@/features/exercise-page/utils/chartPointDetail";
import styles from "./ChartPointDetailSheet.module.css";

type ChartPointDetailSheetProps = {
  open: boolean;
  detail: ChartPointDetail | null;
  onClose: () => void;
};

function SessionBlock({
  sessionId,
  load,
  sets,
}: {
  sessionId: string;
  load: keyof typeof diaryLoadMeta;
  sets: { setNumber: number; weightKg: number; reps: number; note?: string }[];
}) {
  const loadMeta = diaryLoadMeta[load];

  return (
    <article className={styles.session}>
      <div className={styles.sessionHeader}>
        <span className={styles.intensityLabel} style={{ color: loadMeta.color }}>
          {loadMeta.label}
        </span>
        <IconSignalBars
          size={16}
          activeCount={loadMeta.signalBars}
          activeColor={loadMeta.color}
        />
      </div>
      <ul className={styles.setList}>
        {sets.map((set) => (
          <li key={`${sessionId}-set-${set.setNumber}`} className={styles.setRow}>
            <span className={styles.setNumber}>{set.setNumber}</span>
            <span className={styles.setLine}>
              {formatSetLine(set.weightKg, set.reps)}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}

export function ChartPointDetailSheet({
  open,
  detail,
  onClose,
}: ChartPointDetailSheetProps) {
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
      open={open && detail !== null}
      title={detail?.title ?? ""}
      onClose={onClose}
    >
      {detail ? (
        <>
          <p className={styles.summary}>
            Макс. вес: <strong>{detail.maxWeightKg} кг</strong>
          </p>

          {detail.dayBreakdown ? (
            <ul className={styles.dayList}>
              {detail.dayBreakdown.map((day) => (
                <li key={day.dateISO} className={styles.dayCard}>
                  <div className={styles.dayHeader}>
                    <span className={styles.dayDate}>{day.dateLabel}</span>
                    <span className={styles.dayMax}>{day.maxWeightKg} кг</span>
                  </div>
                  {day.sessions.map((session) => (
                    <SessionBlock
                      key={session.id}
                      sessionId={session.id}
                      load={session.load}
                      sets={session.sets}
                    />
                  ))}
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.sessions}>
              {detail.sessions.map((session) => (
                <SessionBlock
                  key={session.id}
                  sessionId={session.id}
                  load={session.load}
                  sets={session.sets}
                />
              ))}
            </div>
          )}
        </>
      ) : null}
    </ActionPopup>
  );
}
