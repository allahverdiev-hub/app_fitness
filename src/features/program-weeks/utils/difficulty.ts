import type { ProgramDifficulty } from "@/features/program-weeks/types/programWeeks";

export type DifficultyStyle = {
  label: string;
  color: string;
  activeBars: 1 | 2 | 3;
};

const DIFFICULTY_STYLES: Record<ProgramDifficulty, DifficultyStyle> = {
  light: {
    label: "ЛЕГКАЯ",
    color: "var(--program-week-difficulty-color-light)",
    activeBars: 1,
  },
  medium: {
    label: "СРЕДНЯЯ",
    color: "var(--program-week-difficulty-color-medium)",
    activeBars: 2,
  },
  heavy: {
    label: "ТЯЖЕЛАЯ",
    color: "var(--program-week-difficulty-color-heavy)",
    activeBars: 3,
  },
};

export function getDifficultyStyle(
  difficulty: ProgramDifficulty,
): DifficultyStyle {
  return DIFFICULTY_STYLES[difficulty];
}
