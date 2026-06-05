import { useEffect, useRef, useState } from "react";
import { formatCountdown } from "@/shared/lib/formatDuration";
import styles from "./RestTimerOverlay.module.css";

const ENTER_MS = 520;
const EXIT_MS = 420;

type OverlayPhase = "hidden" | "enter" | "shown" | "exit";

type RestTimerOverlayProps = {
  secondsRemaining: number | null;
  onSkip: () => void;
};

function isRestActive(seconds: number | null): seconds is number {
  return seconds !== null && seconds > 0;
}

export function RestTimerOverlay({
  secondsRemaining,
  onSkip,
}: RestTimerOverlayProps) {
  const active = isRestActive(secondsRemaining);
  const [phase, setPhase] = useState<OverlayPhase>(() =>
    active ? "enter" : "hidden",
  );
  const [displaySeconds, setDisplaySeconds] = useState(
    active ? secondsRemaining : 0,
  );
  const phaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearPhaseTimer = () => {
    if (phaseTimerRef.current !== null) {
      clearTimeout(phaseTimerRef.current);
      phaseTimerRef.current = null;
    }
  };

  useEffect(() => {
    if (active) {
      setDisplaySeconds(secondsRemaining);
      setPhase((prev) =>
        prev === "hidden" || prev === "exit" ? "enter" : "shown",
      );
      return;
    }

    setPhase((prev) =>
      prev === "enter" || prev === "shown" ? "exit" : prev,
    );
  }, [active, secondsRemaining]);

  useEffect(() => {
    clearPhaseTimer();

    if (phase === "enter") {
      phaseTimerRef.current = setTimeout(() => {
        setPhase("shown");
      }, ENTER_MS);
    } else if (phase === "exit") {
      phaseTimerRef.current = setTimeout(() => {
        setPhase("hidden");
      }, EXIT_MS);
    }

    return clearPhaseTimer;
  }, [phase]);

  useEffect(() => () => clearPhaseTimer(), []);

  if (phase === "hidden") {
    return null;
  }

  const label = formatCountdown(displaySeconds);
  const phaseClass =
    phase === "enter"
      ? styles.phaseEnter
      : phase === "exit"
        ? styles.phaseExit
        : styles.phaseShown;

  return (
    <button
      type="button"
      className={`${styles.overlay} ${phaseClass}`}
      onClick={onSkip}
      aria-label={`Отдых ${label}. Нажмите, чтобы пропустить`}
      aria-hidden={phase === "exit"}
    >
      <span className={styles.content} aria-hidden>
        <span className={styles.glow} />
        <span className={styles.time}>{label}</span>
      </span>
    </button>
  );
}
