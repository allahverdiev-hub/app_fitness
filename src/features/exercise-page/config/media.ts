/** Пути к графике из `public/images/exercises/` */
const thumb = (name: string) =>
  `/images/exercises/thumbnails/${name}` as const;

const sharedHero = "/images/exercises/hero/exercise-hero.png" as const;

const heroVideo =
  "/videos/exercises/00301201-Barbell-Close-Grip-Bench-Press_Upper-Arms-FIX_.mp4" as const;

export const exerciseImages = {
  thumbnails: {
    shoulderPress: thumb("01.png"),
    lateralRaise: thumb("02.png"),
    barbellRow: thumb("03.png"),
    cableRow: thumb("04.png"),
    shoulderPress2: thumb("05.png"),
    lateralRaise2: thumb("06.png"),
    barbellRow2: thumb("07.png"),
    cableRow2: thumb("08.png"),
  },
  /** Одна hero-иллюстрация для всех упражнений (poster для видео) */
  hero: sharedHero,
  heroVideo,
} as const;
