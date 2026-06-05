/** «10-12» → 11, «8» → 8 */
export function getDefaultRepsFromRange(repsRange: string): number {
  const parts = repsRange.split("-").map((p) => Number.parseInt(p.trim(), 10));
  if (parts.length === 2 && parts.every((n) => !Number.isNaN(n))) {
    return Math.round((parts[0] + parts[1]) / 2);
  }
  const single = Number.parseInt(repsRange, 10);
  return Number.isNaN(single) ? 10 : single;
}
