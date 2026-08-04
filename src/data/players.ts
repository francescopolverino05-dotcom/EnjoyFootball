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

export function getAllPlayers(): Player[] {
  return [...data.players].sort((a, b) =>
    a.displayName.localeCompare(b.displayName, 'it')
  );
}

export function getPlayerBySlug(slug: string): Player | undefined {
  return data.players.find((p) => p.slug === slug);
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
