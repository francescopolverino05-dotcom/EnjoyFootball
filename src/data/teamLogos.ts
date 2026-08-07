import type { TeamInfo } from '../types/match';

const BASE = import.meta.env.BASE_URL;

function isNapoliCrest(logo?: string): boolean {
  if (!logo) return true;
  return logo === 'napoli-logo.png' || logo === 'napoli-logo-white.png';
}

/** Resolve a team crest for dark (scoreboard) or light (match card) backgrounds. */
export function teamCrestUrl(
  team: Pick<TeamInfo, 'logo'> | { logo?: string },
  surface: 'onDark' | 'onLight' = 'onDark'
): string {
  if (isNapoliCrest(team.logo)) {
    return `${BASE}${surface === 'onDark' ? 'napoli-logo-white.png' : 'napoli-logo.png'}`;
  }
  return `${BASE}${team.logo}`;
}
