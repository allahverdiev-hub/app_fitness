import { useEffect, useRef } from "react";
import { ProgramCard } from "@/features/workouts-hub/components/ProgramCard";
import type { HubProgramCard } from "@/features/workouts-hub/types/workoutsHub";
import styles from "./ProgramCardsCarousel.module.css";

export type ProgramCarouselItem = {
  program: HubProgramCard;
  title: string;
};

type ProgramCardsCarouselProps = {
  items: readonly ProgramCarouselItem[];
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  onOpenProgram?: (programId: string) => void;
};

function resolveActiveIndex(root: HTMLDivElement, slides: readonly (HTMLLIElement | null)[]) {
  const center = root.scrollLeft + root.clientWidth / 2;
  let bestIndex = 0;
  let bestDistance = Number.POSITIVE_INFINITY;

  slides.forEach((slide, index) => {
    if (!slide) return;
    const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
    const distance = Math.abs(center - slideCenter);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  });

  return bestIndex;
}

export function ProgramCardsCarousel({
  items,
  activeIndex,
  onActiveIndexChange,
  onOpenProgram,
}: ProgramCardsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLLIElement | null)[]>([]);
  const activeIndexRef = useRef(activeIndex);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    slideRefs.current = slideRefs.current.slice(0, items.length);
  }, [items.length]);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root || items.length <= 1) return undefined;

    const syncActiveIndex = () => {
      const nextIndex = resolveActiveIndex(root, slideRefs.current);
      if (nextIndex !== activeIndexRef.current) {
        onActiveIndexChange(nextIndex);
      }
    };

    root.addEventListener("scroll", syncActiveIndex, { passive: true });
    root.addEventListener("scrollend", syncActiveIndex);

    return () => {
      root.removeEventListener("scroll", syncActiveIndex);
      root.removeEventListener("scrollend", syncActiveIndex);
    };
  }, [items.length, onActiveIndexChange]);

  if (items.length === 0) return null;

  return (
    <div
      ref={scrollRef}
      className={styles.viewport}
      aria-roledescription="carousel"
      aria-label="Мои программы"
    >
      <ul className={styles.track}>
        {items.map((item, index) => (
          <li
            key={item.program.id}
            ref={(node) => {
              slideRefs.current[index] = node;
            }}
            className={styles.slide}
            aria-hidden={index !== activeIndex}
          >
            <ProgramCard
              program={item.program}
              title={item.title}
              onOpen={onOpenProgram}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
