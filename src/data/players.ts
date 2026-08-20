import roster from './players.json';
import type { Player, PlayersRoster } from '../types/player';

const data = roster as PlayersRoster;

export type PlayerPositionGroup =
  | 'gk'
  | 'defenders'
  | 'midfielders'
  | 'forwards'
  | 'tbd';

export const PLAYER_POSITION_GROUP_ORDER: PlayerPositionGroup[] = [
  'gk',
  'defenders',
  'midfielders',
  'forwards',
  'tbd',
];

const GK = new Set(['GK']);
const DEFENDERS = new Set(['CB', 'LB', 'RB', 'LWB', 'RWB', 'DF']);
const MIDFIELDERS = new Set(['CM', 'DM', 'AM', 'RM', 'LM', 'WM', 'MF']);
const FORWARDS = new Set(['CF', 'ST', 'LW', 'RW', 'SS', 'FW']);

/** Preferred order within each category so same roles stay contiguous. */
const POSITION_SHORT_ORDER: Record<PlayerPositionGroup, string[]> = {
  gk: ['GK'],
  defenders: ['CB', 'LB', 'RB', 'LWB', 'RWB', 'DF'],
  midfielders: ['DM', 'CM', 'AM', 'RM', 'LM', 'WM', 'MF'],
  forwards: ['CF', 'ST', 'SS', 'LW', 'RW', 'FW'],
  tbd: [],
};

function positionShortRank(
  group: PlayerPositionGroup,
  positionShort: string | null | undefined
): number {
  const code = (positionShort ?? '').trim().toUpperCase();
  const order = POSITION_SHORT_ORDER[group];
  const idx = order.indexOf(code);
  return idx === -1 ? order.length : idx;
}

export function comparePlayersWithinGroup(a: Player, b: Player): number {
  const groupA = getPlayerPositionGroup(a.positionShort);
  const groupB = getPlayerPositionGroup(b.positionShort);
  if (groupA !== groupB) {
    return (
      PLAYER_POSITION_GROUP_ORDER.indexOf(groupA) -
      PLAYER_POSITION_GROUP_ORDER.indexOf(groupB)
    );
  }
  const rank =
    positionShortRank(groupA, a.positionShort) -
    positionShortRank(groupB, b.positionShort);
  if (rank !== 0) return rank;
  return a.displayName.localeCompare(b.displayName, 'it');
}

export function getPlayerPositionGroup(
  positionShort: string | null | undefined
): PlayerPositionGroup {
  const code = (positionShort ?? '').trim().toUpperCase();
  if (!code) return 'tbd';
  if (GK.has(code)) return 'gk';
  if (DEFENDERS.has(code) || code.startsWith('DF')) return 'defenders';
  if (MIDFIELDERS.has(code)) return 'midfielders';
  if (FORWARDS.has(code)) return 'forwards';
  return 'tbd';
}

export function groupPlayersByPosition(
  players: Player[]
): { group: PlayerPositionGroup; players: Player[] }[] {
  const buckets: Record<PlayerPositionGroup, Player[]> = {
    gk: [],
    defenders: [],
    midfielders: [],
    forwards: [],
    tbd: [],
  };

  for (const player of players) {
    buckets[getPlayerPositionGroup(player.positionShort)].push(player);
  }

  return PLAYER_POSITION_GROUP_ORDER.filter((group) => buckets[group].length > 0).map(
    (group) => ({
      group,
      players: [...buckets[group]].sort(comparePlayersWithinGroup),
    })
  );
}

/** Parse DD/MM/YYYY (also accepts D/M/YYYY). */
export function parseBirthDate(birthDate: string | null | undefined): Date | null {
  if (!birthDate) return null;
  const m = String(birthDate).trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!m) return null;
  const day = Number(m[1]);
  const month = Number(m[2]);
  const year = Number(m[3]);
  const d = new Date(year, month - 1, day);
  if (
    Number.isNaN(d.getTime()) ||
    d.getFullYear() !== year ||
    d.getMonth() !== month - 1 ||
    d.getDate() !== day
  ) {
    return null;
  }
  return d;
}

/** Age in full years on `asOf` (defaults to today). */
export function ageFromBirthDate(
  birthDate: string | null | undefined,
  asOf: Date = new Date()
): number | null {
  const born = parseBirthDate(birthDate);
  if (!born) return null;
  let age = asOf.getFullYear() - born.getFullYear();
  const monthDiff = asOf.getMonth() - born.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && asOf.getDate() < born.getDate())) {
    age -= 1;
  }
  return age >= 0 ? age : null;
}

function withComputedAge(player: Player): Player {
  return {
    ...player,
    age: ageFromBirthDate(player.birthDate) ?? player.age,
  };
}

export function getAllPlayers(): Player[] {
  return data.players
    .map(withComputedAge)
    .sort((a, b) => a.displayName.localeCompare(b.displayName, 'it'));
}

/** Same order as the Players page (GK → DEF → MID → FWD, then name within group). */
export function getPlayersInRosterOrder(): Player[] {
  return groupPlayersByPosition(data.players.map(withComputedAge)).flatMap(
    (g) => g.players
  );
}

export function getAdjacentPlayerSlugs(slug: string): {
  prev: string | null;
  next: string | null;
} {
  const ordered = getPlayersInRosterOrder();
  const idx = ordered.findIndex((p) => p.slug === slug);
  if (idx === -1 || ordered.length === 0) return { prev: null, next: null };
  const prev = ordered[(idx - 1 + ordered.length) % ordered.length];
  const next = ordered[(idx + 1) % ordered.length];
  return { prev: prev.slug, next: next.slug };
}

export function getPlayerBySlug(slug: string): Player | undefined {
  const player = data.players.find((p) => p.slug === slug);
  return player ? withComputedAge(player) : undefined;
}

/** Resolve a public/ asset path with Vite base (e.g. /EnjoyFootball/ on Pages). */
export function playerPhotoUrl(photoPath: string | null | undefined): string | null {
  if (!photoPath) return null;
  if (/^https?:\/\//i.test(photoPath)) return photoPath;
  const cleaned = photoPath.replace(/^\//, '');
  return `${import.meta.env.BASE_URL}${cleaned}`;
}

export function playerInitials(displayName: string): string {
  const parts = displayName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
