import type { ExerciseItem } from "@/features/exercise-page/types/exercise";
import { ExerciseCard } from "@/features/exercise-page/components/carousel/ExerciseCard";
import styles from "./ExerciseCarousel.module.css";

type ExerciseCarouselProps = {
  exercises: ExerciseItem[];
  activeId: string;
  onSelect?: (id: string) => void;
  className?: string;
};

export function ExerciseCarousel({
  exercises,
  activeId,
  onSelect,
  className,
}: ExerciseCarouselProps) {
  return (
    <div
      className={`${styles.wrap} ${className ?? ""}`.trim()}
      role="region"
      aria-label="Упражнения тренировки"
      tabIndex={0}
    >
      <div className={styles.track} role="list">
        {exercises.map((ex) => (
          <ExerciseCard
            key={ex.id}
            status={ex.status}
            thumbnailSrc={ex.thumbnailSrc}
            imageAlt={ex.imageAlt}
            sets={ex.sets}
            completedSets={ex.completedSets ?? 0}
            selected={ex.id === activeId}
            onClick={() => onSelect?.(ex.id)}
          />
        ))}
      </div>
    </div>
  );
}
