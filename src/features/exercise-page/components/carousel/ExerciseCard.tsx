import { useRef } from "react";
import type { ExerciseStatus } from "@/features/exercise-page/types/exercise";
import { IconCheck } from "@/shared/icons";
import { buildSetRingSegments } from "./setRingSegments";
import { useThumbSizePx } from "./useThumbSizePx";
import styles from "./ExerciseCard.module.css";

type ExerciseCardProps = {
  status: ExerciseStatus;
  thumbnailSrc: string;
  imageAlt: string;
  sets: number;
  completedSets: number;
  selected?: boolean;
  onClick?: () => void;
};

export function ExerciseCard({
  status,
  thumbnailSrc,
  imageAlt,
  sets,
  completedSets,
  selected,
  onClick,
}: ExerciseCardProps) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const thumbSizePx = useThumbSizePx(cardRef);
  const doneCount = Math.min(Math.max(completedSets, 0), sets);
  const allSetsDone = sets > 0 && doneCount >= sets;
  const showSetRing = !allSetsDone;
  const ringSegments = showSetRing
    ? buildSetRingSegments(sets, thumbSizePx)
    : [];

  return (
    <button
      ref={cardRef}
      type="button"
      className={`${styles.card} ${allSetsDone ? styles.cardCompleted : showSetRing ? "" : styles.cardNoRing} ${selected ? styles.active : ""} ${styles[status]}`.trim()}
      onClick={onClick}
      aria-current={selected ? "true" : undefined}
      aria-label={`${imageAlt}, выполнено ${doneCount} из ${sets} подходов`}
    >
      <div className={styles.thumbShell}>
        {ringSegments.length > 0 && (
          <svg
            className={styles.setRing}
            viewBox="0 0 100 100"
            aria-hidden
            focusable="false"
          >
            {ringSegments.map(({ index, d, strokeWidth }) => (
              <path
                key={index}
                d={d}
                strokeWidth={strokeWidth}
                className={
                  index < doneCount ? styles.segmentDone : styles.segmentPending
                }
              />
            ))}
          </svg>
        )}
        <span className={styles.thumbInner}>
          <img
            src={thumbnailSrc}
            alt=""
            className={allSetsDone ? styles.thumbImgDone : styles.thumbImg}
            aria-hidden
          />
        </span>
        {allSetsDone && (
          <span className={styles.doneBadge} aria-hidden>
            <IconCheck className={styles.doneIcon} size={18} />
          </span>
        )}
      </div>
    </button>
  );
}
