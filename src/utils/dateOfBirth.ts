/** ISO YYYY-MM-DD → 26/02/2007. Empty string if missing or not a calendar date. */
export function formatDateOfBirth(iso?: string | null): string {
  if (!iso) return '';
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!m) return '';
  const month = Number(m[2]);
  const day = Number(m[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return '';
  return `${m[3]}/${m[2]}/${m[1]}`;
}

export function squadHasDateOfBirth(
  players: { dateOfBirth?: string | null }[],
): boolean {
  return players.some((p) => formatDateOfBirth(p.dateOfBirth) !== '');
}
