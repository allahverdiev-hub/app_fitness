type SpringConfig = {
  tension: number;
  friction: number;
};

const DEFAULT_SPRING: SpringConfig = {
  tension: 340,
  friction: 30,
};

export function runSpring(
  from: number,
  to: number,
  onUpdate: (value: number) => void,
  onComplete?: () => void,
  config: SpringConfig = DEFAULT_SPRING,
  initialVelocity = 0,
): () => void {
  let value = from;
  let velocity = initialVelocity;
  let lastTime = performance.now();
  let frameId = 0;
  let cancelled = false;

  const step = (now: number) => {
    if (cancelled) return;

    const dt = Math.min((now - lastTime) / 1000, 0.032);
    lastTime = now;

    const displacement = value - to;
    const acceleration =
      -config.tension * displacement - config.friction * velocity;

    velocity += acceleration * dt;
    value += velocity * dt;

    if (Math.abs(velocity) < 0.004 && Math.abs(value - to) < 0.002) {
      onUpdate(to);
      onComplete?.();
      return;
    }

    onUpdate(value);
    frameId = requestAnimationFrame(step);
  };

  frameId = requestAnimationFrame(step);

  return () => {
    cancelled = true;
    cancelAnimationFrame(frameId);
  };
}

export function applyRubberBand(progress: number): number {
  if (progress < 0) {
    return progress * 0.28;
  }
  if (progress > 1) {
    return 1 + (progress - 1) * 0.22;
  }
  return progress;
}
