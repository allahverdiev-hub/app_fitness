import { ExerciseHero } from "@/features/exercise-page/components/hero/ExerciseHero";
import { RestTimerOverlay } from "@/features/exercise-page/components/hero/RestTimerOverlay";
import styles from "./ExerciseHeroStage.module.css";

type ExerciseHeroStageProps = {
  heroSrc: string;
  videoSrc?: string;
  alt?: string;
  restSecondsRemaining?: number | null;
  onSkipRest?: () => void;
};

export function ExerciseHeroStage({
  heroSrc,
  videoSrc,
  alt,
  restSecondsRemaining = null,
  onSkipRest,
}: ExerciseHeroStageProps) {
  return (
    <div className={styles.stage}>
      <ExerciseHero
        className={styles.hero}
        fill
        imageSrc={heroSrc}
        videoSrc={videoSrc}
        alt={alt}
      />
      {onSkipRest ? (
        <RestTimerOverlay
          secondsRemaining={restSecondsRemaining ?? null}
          onSkip={onSkipRest}
        />
      ) : null}
    </div>
  );
}
