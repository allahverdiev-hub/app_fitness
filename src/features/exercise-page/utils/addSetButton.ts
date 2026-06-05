export const addSetButtonLabel = "ДОБАВИТЬ ПОДХОД";

export function getAddSetButtonAriaLabel(
  completedSets: number,
  targetSets: number,
): string {
  if (targetSets <= 0) return addSetButtonLabel;
  return `${addSetButtonLabel}, ${completedSets} из ${targetSets} подходов выполнено`;
}
