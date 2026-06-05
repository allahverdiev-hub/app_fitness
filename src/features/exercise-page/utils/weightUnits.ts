import {
  REPS_OPTIONS,
  WEIGHT_GRAM_OPTIONS,
  WEIGHT_KG_OPTIONS,
} from "@/features/exercise-page/components/add-set-sheet/pickerData";

export function splitWeightKgToPickers(weightKg: number) {
  const totalGrams = Math.round(weightKg * 1000);
  let kg = Math.floor(totalGrams / 1000);
  let grams = totalGrams % 1000;
  grams = Math.round(grams / 100) * 100;
  if (grams >= 1000) {
    kg += 1;
    grams = 0;
  }
  return {
    weightKg: clampToOptions(kg, WEIGHT_KG_OPTIONS),
    weightGrams: clampToOptions(grams, WEIGHT_GRAM_OPTIONS),
  };
}

export function weightFromPickers(weightKg: number, weightGrams: number) {
  return weightKg + weightGrams / 1000;
}

function clampToOptions(value: number, options: readonly number[]) {
  if (options.includes(value)) return value;
  const nearest = options.reduce((best, option) =>
    Math.abs(option - value) < Math.abs(best - value) ? option : best,
  );
  return nearest;
}

export function clampReps(value: number) {
  return clampToOptions(Math.max(1, value), REPS_OPTIONS);
}
