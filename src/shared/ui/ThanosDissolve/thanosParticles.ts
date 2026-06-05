import { DELETE_PARTICLE_MS } from "./deleteAnimationTiming";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  decay: number;
  bornAt: number;
  fadeMs: number;
};

const BLEED_X = 20;
const BLEED_Y = 64;
const THUMB_SAMPLE_SIZE = 56;
const THUMB_GRID_STEP = 2;
const BODY_GRID_STEP = 3;
const SPAWN_SPREAD_MS = 420;

/** Лёгкий ветер справа — частицы уносят влево */
const WIND_X = -0.34;
const WIND_Y = -0.05;

function randomGrayTone(): string {
  const tones = [
    "rgba(255, 255, 255, 0.9)",
    "rgba(200, 200, 205, 0.78)",
    "rgba(142, 142, 147, 0.72)",
    "rgba(36, 36, 36, 0.84)",
    "rgba(50, 50, 52, 0.8)",
  ];
  return tones[Math.floor(Math.random() * tones.length)];
}

function spawnParticle(
  x: number,
  y: number,
  color: string,
  centerX: number,
  centerY: number,
  bornAt: number,
): Particle {
  const angle =
    Math.atan2(y - centerY, x - centerX) + (Math.random() - 0.5) * 1.1;
  const speed = 0.18 + Math.random() * 0.95;

  return {
    x,
    y,
    vx: Math.cos(angle) * speed + WIND_X * 0.22,
    vy: Math.sin(angle) * speed - Math.random() * 0.18,
    size: 0.35 + Math.random() * 0.75,
    color,
    life: 0.98 + Math.random() * 0.02,
    decay: 0.0013 + Math.random() * 0.0022,
    bornAt,
    fadeMs: 780 + Math.random() * 180,
  };
}

function particleAlpha(particle: Particle, particleElapsed: number): number {
  if (particleElapsed <= 0) return 0;

  const lifeAlpha = Math.max(0, particle.life * particle.life * particle.life);
  const fadeT = Math.min(particleElapsed / particle.fadeMs, 1);
  const envelope = 1 - fadeT * fadeT * fadeT;

  return lifeAlpha * envelope;
}

function sampleThumbParticles(
  container: HTMLElement,
  bleedX: number,
  bleedY: number,
  _width: number,
  _height: number,
  centerX: number,
  centerY: number,
): Particle[] {
  const img = container.querySelector("img");
  if (!img || !img.complete || img.naturalWidth === 0) return [];

  const containerRect = container.getBoundingClientRect();
  const imgRect = img.getBoundingClientRect();
  const offsetX = imgRect.left - containerRect.left + bleedX;
  const offsetY = imgRect.top - containerRect.top + bleedY;

  const sampleCanvas = document.createElement("canvas");
  sampleCanvas.width = THUMB_SAMPLE_SIZE;
  sampleCanvas.height = THUMB_SAMPLE_SIZE;
  const ctx = sampleCanvas.getContext("2d");
  if (!ctx) return [];

  ctx.drawImage(img, 0, 0, THUMB_SAMPLE_SIZE, THUMB_SAMPLE_SIZE);
  const { data } = ctx.getImageData(0, 0, THUMB_SAMPLE_SIZE, THUMB_SAMPLE_SIZE);
  const particles: Particle[] = [];

  for (let py = 0; py < THUMB_SAMPLE_SIZE; py += THUMB_GRID_STEP) {
    for (let px = 0; px < THUMB_SAMPLE_SIZE; px += THUMB_GRID_STEP) {
      const idx = (py * THUMB_SAMPLE_SIZE + px) * 4;
      const alpha = data[idx + 3];
      if (alpha < 32) continue;

      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const x =
        offsetX +
        (px / THUMB_SAMPLE_SIZE) * imgRect.width +
        (Math.random() - 0.5) * 1.2;
      const y =
        offsetY +
        (py / THUMB_SAMPLE_SIZE) * imgRect.height +
        (Math.random() - 0.5) * 1.2;

      particles.push(
        spawnParticle(
          x,
          y,
          `rgba(${r}, ${g}, ${b}, ${alpha / 255})`,
          centerX,
          centerY,
          Math.random() * SPAWN_SPREAD_MS,
        ),
      );
    }
  }

  return particles;
}

function sampleBodyParticles(
  bleedX: number,
  bleedY: number,
  width: number,
  height: number,
  centerX: number,
  centerY: number,
): Particle[] {
  const particles: Particle[] = [];
  const canvasWidth = width + bleedX * 2;

  for (let y = bleedY; y < bleedY + height; y += BODY_GRID_STEP) {
    for (let x = bleedX; x < bleedX + width; x += BODY_GRID_STEP) {
      const jitterX = (Math.random() - 0.5) * 1.4;
      const jitterY = (Math.random() - 0.5) * 1.4;
      particles.push(
        spawnParticle(
          x + jitterX,
          y + jitterY,
          randomGrayTone(),
          centerX,
          centerY,
          Math.random() * SPAWN_SPREAD_MS,
        ),
      );
    }
  }

  const edgeCount = Math.floor(canvasWidth * 0.42);
  for (let i = 0; i < edgeCount; i++) {
    const onTop = Math.random() < 0.5;
    const x = Math.random() * canvasWidth;
    const y = onTop
      ? bleedY * Math.random() * 0.92
      : bleedY + height + Math.random() * bleedY;
    particles.push(
      spawnParticle(
        x,
        y,
        randomGrayTone(),
        centerX,
        centerY,
        Math.random() * SPAWN_SPREAD_MS,
      ),
    );
  }

  return particles;
}

function buildParticles(
  container: HTMLElement,
  bleedX: number,
  bleedY: number,
): Particle[] {
  const rect = container.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;
  const centerX = width / 2 + bleedX;
  const centerY = height / 2 + bleedY;

  return [
    ...sampleThumbParticles(
      container,
      bleedX,
      bleedY,
      width,
      height,
      centerX,
      centerY,
    ),
    ...sampleBodyParticles(bleedX, bleedY, width, height, centerX, centerY),
  ];
}

export function runThanosDissolve(
  container: HTMLElement,
  canvas: HTMLCanvasElement,
  onComplete: () => void,
): () => void {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (reducedMotion) {
    onComplete();
    return () => undefined;
  }

  const rect = container.getBoundingClientRect();
  const canvasWidth = rect.width + BLEED_X * 2;
  const canvasHeight = rect.height + BLEED_Y * 2;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = Math.max(1, Math.floor(canvasWidth * dpr));
  canvas.height = Math.max(1, Math.floor(canvasHeight * dpr));
  canvas.style.position = "absolute";
  canvas.style.left = `${-BLEED_X}px`;
  canvas.style.top = `${-BLEED_Y}px`;
  canvas.style.width = `${canvasWidth}px`;
  canvas.style.height = `${canvasHeight}px`;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    onComplete();
    return () => undefined;
  }

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const particles = buildParticles(container, BLEED_X, BLEED_Y);
  const start = performance.now();
  let rafId = 0;

  const tick = (now: number) => {
    const elapsed = now - start;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    const windRamp = Math.min(elapsed / 520, 1);
    const windStrength = windRamp * windRamp;

    for (const particle of particles) {
      const particleElapsed = elapsed - particle.bornAt;
      if (particleElapsed < 0) continue;
      if (particle.life <= 0) continue;

      const drift = Math.min(particleElapsed / 300, 1);
      const gust = windStrength * drift;

      particle.x += particle.vx * drift + WIND_X * gust;
      particle.y += particle.vy * drift + WIND_Y * gust;
      particle.vy += 0.006 * drift;
      particle.vx += WIND_X * 0.0011 * drift;
      particle.vx *= 0.996;
      particle.vy *= 0.996;
      particle.life -= particle.decay;

      const alpha = particleAlpha(particle, particleElapsed);
      if (alpha <= 0.006) continue;

      const radius = particle.size * (0.45 + alpha * 0.55);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;

    if (elapsed < DELETE_PARTICLE_MS) {
      rafId = requestAnimationFrame(tick);
      return;
    }

    onComplete();
  };

  rafId = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(rafId);
}
