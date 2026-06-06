export const SETS_OPTIONS = Array.from({ length: 6 }, (_, index) => index + 1);

export const REP_RANGE_OPTIONS = [
  "6-8",
  "8-10",
  "10-12",
  "12-15",
  "15-20",
  "20-25",
] as const;

export const REP_RANGE_INDEX_OPTIONS = REP_RANGE_OPTIONS.map((_, index) => index);

export const WARMUP_MINUTES_OPTIONS = Array.from({ length: 30 }, (_, index) => index + 1);

export const WARMUP_REPS_OPTIONS = Array.from({ length: 46 }, (_, index) => index + 5);
