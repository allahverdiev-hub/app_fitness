/** Парсит строки вида «90 сек», «2 мин» в секунды. */
export function parseRestDuration(restLabel: string): number {
  const normalized = restLabel.trim().toLowerCase();
  let total = 0;

  const minMatch = normalized.match(/(\d+)\s*мин/);
  if (minMatch) total += Number(minMatch[1]) * 60;

  const secMatch = normalized.match(/(\d+)\s*сек/);
  if (secMatch) total += Number(secMatch[1]);

  return total > 0 ? total : 90;
}
