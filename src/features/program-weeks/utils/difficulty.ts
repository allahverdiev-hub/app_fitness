import type { ProgramDifficulty } from "@/features/program-weeks/types/programWeeks";

export type DifficultyStyle = {
  label: string;
  color: string;
  activeBars: 1 | 2 | 3;
};

const DIFFICULTY_STYLES: Record<ProgramDifficulty, DifficultyStyle> = {
  light: {
    label: "ЛЕГКАЯ",
    color: "var(--program-accent, var(--color-accent))",
    activeBars: 1,
  },
  medium: {
    label: "СРЕДНЯЯ",
    color: "var(--color-difficulty-medium)",
    activeBars: 2,
  },
  heavy: {
    label: "ТЯЖЕЛАЯ",
    color: "var(--color-difficulty-heavy)",
    activeBars: 3,
  },
};

export function getDifficultyStyle(
  difficulty: ProgramDifficulty,
): DifficultyStyle {
  return DIFFICULTY_STYLES[difficulty];
}

export function getProgressRingColor(
  difficulty: ProgramDifficulty,
  progressPercent: number,
): string {
  if (progressPercent < 25) {
    return difficulty === "light"
      ? "var(--color-difficulty-heavy)"
      : getDifficultyStyle(difficulty).color;
  }
  if (progressPercent < 100) {
    return difficulty === "light"
      ? "var(--color-difficulty-medium)"
      : getDifficultyStyle(difficulty).color;
  }
  return getDifficultyStyle(difficulty).color;
}
