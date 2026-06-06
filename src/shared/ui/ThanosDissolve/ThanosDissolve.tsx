import { useEffect, useRef, useState, type ReactNode } from "react";

import { DELETE_BLUR_MS, DELETE_DISSOLVE_MS } from "./deleteAnimationTiming";
import {
  buildParticles,
  runThanosDissolve,
  type Particle,
} from "./thanosParticles";

import styles from "./ThanosDissolve.module.css";

type ThanosDissolveProps = {
  active: boolean;
  onComplete: () => void;
  children: ReactNode;
};

type DissolvePhase = "idle" | "blur" | "dissolve";

export function ThanosDissolve({
  active,
  onComplete,
  children,
}: ThanosDissolveProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const onCompleteRef = useRef(onComplete);
  const [phase, setPhase] = useState<DissolvePhase>("idle");

  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!active) return undefined;

    setPhase("idle");
    particlesRef.current = [];

    // Снимаем частицы с чёткой видимой карточки, до блюра и до появления canvas.
    const captureFrame = requestAnimationFrame(() => {
      if (wrapRef.current) {
        particlesRef.current = buildParticles(wrapRef.current);
      }
      setPhase("blur");
    });

    const dissolveTimer = window.setTimeout(
      () => setPhase("dissolve"),
      DELETE_BLUR_MS,
    );

    return () => {
      cancelAnimationFrame(captureFrame);
      window.clearTimeout(dissolveTimer);
      setPhase("idle");
    };
  }, [active]);

  useEffect(() => {
    if (phase !== "dissolve") return undefined;

    const wrap = wrapRef.current;
    if (!wrap) return undefined;

    let cancelAnim: (() => void) | undefined;
    const frameId = requestAnimationFrame(() => {
      cancelAnim = runThanosDissolve(wrap, particlesRef.current, () =>
        onCompleteRef.current(),
      );
    });

    return () => {
      cancelAnimationFrame(frameId);
      cancelAnim?.();
    };
  }, [phase]);

  const contentClass = [
    styles.content,
    phase === "blur" ? styles.phaseBlur : "",
    phase === "dissolve" ? styles.phaseDissolve : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={wrapRef} className={styles.wrap}>
      <div
        className={contentClass}
        style={
          phase === "dissolve"
            ? { transitionDuration: `${DELETE_DISSOLVE_MS}ms` }
            : undefined
        }
      >
        {children}
      </div>
    </div>
  );
}
