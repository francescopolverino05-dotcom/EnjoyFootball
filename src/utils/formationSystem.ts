/** Show the goalkeeper in the system string: 4-3-3 → 1-4-3-3. */
export function withGoalkeeperInSystem(system: string): string {
  const trimmed = system.trim();
  if (!trimmed) return trimmed;
  if (/^1[-–]/.test(trimmed)) return trimmed;
  return `1-${trimmed}`;
}
