import { DELETE_PARTICLE_MS } from "./deleteAnimationTiming";

export type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  bornAt: number;
  lifeMs: number;
  swayPhase: number;
  swayAmp: number;
};

const BLEED_X = 36;
const BLEED_Y = 96;
const THUMB_SAMPLE_SIZE = 72;
const THUMB_GRID_STEP = 1;
const BODY_GRID_STEP = 2;

/**
 * Ветер сносит пыль вверх и чуть влево (как в Telegram).
 * Меняй знаки тут, чтобы развернуть направление.
 */
const WIND_X = -0.42;
const WIND_Y = -0.72;

/** Длительность волны распада по карточке */
const SWEEP_MS = 540;
/** Случайный разброс рождения частицы */
const SPAWN_JITTER_MS = 130;

const windLen = Math.hypot(WIND_X, WIND_Y) || 1;
const WIND_DIR_X = WIND_X / windLen;
const WIND_DIR_Y = WIND_Y / windLen;

/** Дальность сноса ветром за полную жизнь крупинки (px) */
const WIND_TRAVEL = 96;
/** Начальный разлёт от центра (px) */
const SPREAD_TRAVEL = 30;
/** Амплитуда бокового покачивания (px) */
const SWAY_TRAVEL = 7;

function parseRgba(
  value: string,
): { r: number; g: number; b: number; a: number } | null {
  const match = value.match(
    /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/,
  );
  if (!match) return null;
  return {
    r: Math.round(Number(match[1])),
    g: Math.round(Number(match[2])),
    b: Math.round(Number(match[3])),
    a: match[4] === undefined ? 1 : Number(match[4]),
  };
}

/** Фон карточки — основа для «пыли» тела. */
function resolveBaseColor(container: HTMLElement): [number, number, number] {
  let node: Element | null = container.querySelector("article") ?? container;
  while (node) {
    const bg = parseRgba(getComputedStyle(node).backgroundColor);
    if (bg && bg.a > 0.6) return [bg.r, bg.g, bg.b];
    node = node.parentElement;
  }
  return [44, 44, 46];
}

/** Тёмная пыль на тёмном фоне не видна — подсвечиваем крупинки. */
function grainTone(base: [number, number, number]): string {
  const lift = 34 + Math.random() * 70;
  const r = Math.min(255, base[0] + lift);
  const g = Math.min(255, base[1] + lift);
  const b = Math.min(255, base[2] + lift + 2);
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

type InkRect = {
  left: number;
  top: number;
  right: number;
  bottom: number;
  color: string;
};

/** Прямоугольники реального текста карточки с их цветом (для цветных крупинок). */
function collectInkRects(
  container: HTMLElement,
  bleedX: number,
  bleedY: number,
): InkRect[] {
  const containerRect = container.getBoundingClientRect();
  const inks: InkRect[] = [];

  for (const el of Array.from(container.querySelectorAll<HTMLElement>("*"))) {
    if (el.tagName === "IMG") continue;

    const hasOwnText = Array.from(el.childNodes).some(
      (n) => n.nodeType === Node.TEXT_NODE && (n.textContent ?? "").trim(),
    );
    if (!hasOwnText) continue;

    const color = parseRgba(getComputedStyle(el).color);
    if (!color || color.a < 0.2) continue;

    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;

    inks.push({
      left: r.left - containerRect.left + bleedX,
      top: r.top - containerRect.top + bleedY,
      right: r.right - containerRect.left + bleedX,
      bottom: r.bottom - containerRect.top + bleedY,
      color: `rgb(${color.r}, ${color.g}, ${color.b})`,
    });
  }

  return inks;
}

type RawParticle = {
  x: number;
  y: number;
  color: string;
  sweep: number;
};

function sampleThumb(
  container: HTMLElement,
  bleedX: number,
  bleedY: number,
  out: RawParticle[],
): DOMRect | null {
  const img = container.querySelector("img");
  if (!img || !img.complete || img.naturalWidth === 0) return null;

  const containerRect = container.getBoundingClientRect();
  const imgRect = img.getBoundingClientRect();
  const offsetX = imgRect.left - containerRect.left + bleedX;
  const offsetY = imgRect.top - containerRect.top + bleedY;

  const sampleCanvas = document.createElement("canvas");
  sampleCanvas.width = THUMB_SAMPLE_SIZE;
  sampleCanvas.height = THUMB_SAMPLE_SIZE;
  const ctx = sampleCanvas.getContext("2d");
  if (!ctx) return imgRect;

  try {
    ctx.drawImage(img, 0, 0, THUMB_SAMPLE_SIZE, THUMB_SAMPLE_SIZE);
    const { data } = ctx.getImageData(
      0,
      0,
      THUMB_SAMPLE_SIZE,
      THUMB_SAMPLE_SIZE,
    );

    for (let py = 0; py < THUMB_SAMPLE_SIZE; py += THUMB_GRID_STEP) {
      for (let px = 0; px < THUMB_SAMPLE_SIZE; px += THUMB_GRID_STEP) {
        const idx = (py * THUMB_SAMPLE_SIZE + px) * 4;
        if (data[idx + 3] < 24) continue;

        out.push({
          x: offsetX + (px / THUMB_SAMPLE_SIZE) * imgRect.width,
          y: offsetY + (py / THUMB_SAMPLE_SIZE) * imgRect.height,
          color: `rgb(${data[idx]}, ${data[idx + 1]}, ${data[idx + 2]})`,
          sweep: 0,
        });
      }
    }
  } catch {
    // tainted canvas — пропускаем превью
  }

  return imgRect;
}

function inCanvasRect(x: number, y: number, rect: InkRect): boolean {
  return (
    x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
  );
}

function thumbContains(
  container: HTMLElement,
  bleedX: number,
  bleedY: number,
  canvasX: number,
  canvasY: number,
  thumbRect: DOMRect | null,
): boolean {
  if (!thumbRect) return false;
  const containerRect = container.getBoundingClientRect();
  const left = thumbRect.left - containerRect.left + bleedX;
  const top = thumbRect.top - containerRect.top + bleedY;
  return (
    canvasX >= left - 1 &&
    canvasX <= left + thumbRect.width + 1 &&
    canvasY >= top - 1 &&
    canvasY <= top + thumbRect.height + 1
  );
}

function sampleBody(
  container: HTMLElement,
  bleedX: number,
  bleedY: number,
  width: number,
  height: number,
  thumbRect: DOMRect | null,
  out: RawParticle[],
): void {
  const baseRGB = resolveBaseColor(container);
  const inks = collectInkRects(container, bleedX, bleedY);

  for (let y = 0; y < height; y += BODY_GRID_STEP) {
    for (let x = 0; x < width; x += BODY_GRID_STEP) {
      const canvasX = bleedX + x;
      const canvasY = bleedY + y;

      if (thumbContains(container, bleedX, bleedY, canvasX, canvasY, thumbRect)) {
        continue;
      }

      let color: string | null = null;
      for (let i = inks.length - 1; i >= 0; i--) {
        if (inCanvasRect(canvasX, canvasY, inks[i])) {
          // Текст — это глифы, а не сплошной блок: часть точек оставляем фоном.
          if (Math.random() < 0.55) color = inks[i].color;
          break;
        }
      }

      out.push({
        x: canvasX,
        y: canvasY,
        color: color ?? grainTone(baseRGB),
        sweep: 0,
      });
    }
  }
}

/** Зелёный «чек» выполненного упражнения — отдельный кружок поверх миниатюры. */
function sampleDoneBadge(
  container: HTMLElement,
  bleedX: number,
  bleedY: number,
  out: RawParticle[],
): void {
  const containerRect = container.getBoundingClientRect();
  let badge: { rect: DOMRect; rgb: [number, number, number] } | null = null;

  for (const el of Array.from(container.querySelectorAll<HTMLElement>("*"))) {
    const bg = parseRgba(getComputedStyle(el).backgroundColor);
    if (!bg || bg.a < 0.5) continue;
    // Акцентный зелёный: зелёный канал заметно доминирует.
    if (!(bg.g > bg.r + 8 && bg.g > bg.b + 30)) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 6 || r.width > 140) continue;
    badge = { rect: r, rgb: [bg.r, bg.g, bg.b] };
    break;
  }

  if (!badge) return;

  const cx = badge.rect.left - containerRect.left + bleedX + badge.rect.width / 2;
  const cy = badge.rect.top - containerRect.top + bleedY + badge.rect.height / 2;
  const radius = Math.min(badge.rect.width, badge.rect.height) / 2;
  const r2 = radius * radius;

  for (let dy = -radius; dy <= radius; dy += 1) {
    for (let dx = -radius; dx <= radius; dx += 1) {
      if (dx * dx + dy * dy > r2) continue;
      const lift = -22 + Math.random() * 44;
      out.push({
        x: cx + dx,
        y: cy + dy,
        color: `rgb(${Math.max(0, Math.min(255, Math.round(badge.rgb[0] + lift)))}, ${Math.max(0, Math.min(255, Math.round(badge.rgb[1] + lift)))}, ${Math.max(0, Math.min(255, Math.round(badge.rgb[2] + lift * 0.5)))})`,
        sweep: 0,
      });
    }
  }
}

export function buildParticles(
  container: HTMLElement,
  bleedX = BLEED_X,
  bleedY = BLEED_Y,
): Particle[] {
  const rect = container.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;

  const raw: RawParticle[] = [];
  const thumbRect = sampleThumb(container, bleedX, bleedY, raw);
  sampleBody(container, bleedX, bleedY, width, height, thumbRect, raw);
  sampleDoneBadge(container, bleedX, bleedY, raw);

  if (raw.length === 0) return [];

  let minSweep = Infinity;
  let maxSweep = -Infinity;
  for (const p of raw) {
    const xn = (p.x - bleedX) / Math.max(width, 1);
    const yn = (p.y - bleedY) / Math.max(height, 1);
    p.sweep = xn * WIND_DIR_X + yn * WIND_DIR_Y;
    if (p.sweep < minSweep) minSweep = p.sweep;
    if (p.sweep > maxSweep) maxSweep = p.sweep;
  }
  const sweepRange = Math.max(maxSweep - minSweep, 0.0001);

  return raw.map((p) => {
    // Кромка по направлению ветра распадается первой.
    const sweepNorm = (maxSweep - p.sweep) / sweepRange;
    const bornAt = sweepNorm * SWEEP_MS + Math.random() * SPAWN_JITTER_MS;

    const spread = 0.2 + Math.random() * 0.8;
    const angle = Math.random() * Math.PI * 2;

    return {
      x: p.x + (Math.random() - 0.5) * 1.2,
      y: p.y + (Math.random() - 0.5) * 1.2,
      vx: Math.cos(angle) * spread,
      vy: Math.sin(angle) * spread,
      size: 1,
      color: p.color,
      bornAt,
      lifeMs: 560 + Math.random() * 420,
      swayPhase: Math.random() * Math.PI * 2,
      swayAmp: 0.4 + Math.random() * 0.6,
    };
  });
}

export function runThanosDissolve(
  container: HTMLElement,
  particles: Particle[],
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

  // Canvas живёт на body (fixed), чтобы схлопывание строки его не обрезало.
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.floor(canvasWidth * dpr));
  canvas.height = Math.max(1, Math.floor(canvasHeight * dpr));
  canvas.style.position = "fixed";
  canvas.style.left = `${rect.left - BLEED_X}px`;
  canvas.style.top = `${rect.top - BLEED_Y}px`;
  canvas.style.width = `${canvasWidth}px`;
  canvas.style.height = `${canvasHeight}px`;
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "90";
  document.body.appendChild(canvas);

  let finished = false;
  const cleanup = () => {
    if (finished) return;
    finished = true;
    canvas.remove();
  };

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    cleanup();
    onComplete();
    return () => undefined;
  }

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = false;

  const start = performance.now();
  let rafId = 0;

  const tick = (now: number) => {
    const elapsed = now - start;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    for (const p of particles) {
      const local = elapsed - p.bornAt;
      if (local < 0) continue;

      const lifeT = local / p.lifeMs;
      if (lifeT >= 1) continue;

      // Аналитическое движение: позиция — чистая функция времени жизни.
      const windF = Math.pow(lifeT, 1.55);
      const spreadF = 1 - (1 - lifeT) * (1 - lifeT);
      const sway =
        Math.sin(p.swayPhase + lifeT * Math.PI * 3) *
        p.swayAmp *
        (1 - lifeT) *
        SWAY_TRAVEL;

      const x =
        p.x +
        WIND_DIR_X * windF * WIND_TRAVEL +
        p.vx * spreadF * SPREAD_TRAVEL +
        -WIND_DIR_Y * sway;
      const y =
        p.y +
        WIND_DIR_Y * windF * WIND_TRAVEL +
        p.vy * spreadF * SPREAD_TRAVEL +
        WIND_DIR_X * sway;

      // Появление быстрое, угасание плавное к концу жизни.
      const fadeIn = Math.min(local / 50, 1);
      const fadeOut = lifeT < 0.55 ? 1 : 1 - (lifeT - 0.55) / 0.45;
      const alpha = fadeIn * fadeOut;
      if (alpha <= 0.02) continue;

      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
    }

    ctx.globalAlpha = 1;

    if (elapsed < DELETE_PARTICLE_MS) {
      rafId = requestAnimationFrame(tick);
      return;
    }

    cleanup();
    onComplete();
  };

  rafId = requestAnimationFrame(tick);
  return () => {
    cancelAnimationFrame(rafId);
    cleanup();
  };
}
