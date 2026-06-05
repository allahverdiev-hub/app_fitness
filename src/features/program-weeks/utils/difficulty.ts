import type { ProgramDifficulty } from "@/features/program-weeks/types/programWeeks";

export type DifficultyStyle = {
  label: string;
  color: string;
  borderColor: string;
  activeBars: 1 | 2 | 3;
};

const DIFFICULTY_STYLES: Record<ProgramDifficulty, DifficultyStyle> = {
  light: {
    label: "ЛЕГКАЯ",
    color: "var(--program-week-difficulty-color-light)",
    borderColor: "rgba(110, 133, 0, 0.6)",
    activeBars: 1,
  },
  medium: {
    label: "СРЕДНЯЯ",
    color: "var(--program-week-difficulty-color-medium)",
    borderColor: "rgba(133, 126, 0, 0.6)",
    activeBars: 2,
  },
  heavy: {
    label: "ТЯЖЕЛАЯ",
    color: "var(--program-week-difficulty-color-heavy)",
    borderColor: "rgba(133, 72, 0, 0.6)",
    activeBars: 3,
  },
};

export function getDifficultyStyle(
  difficulty: ProgramDifficulty,
): DifficultyStyle {
  return DIFFICULTY_STYLES[difficulty];
}
