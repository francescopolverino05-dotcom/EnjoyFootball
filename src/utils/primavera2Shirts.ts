import type { PitchPlayer } from '../types/match';

/**
 * Francesco's Primavera 2 pitch map: shirt number by position, not by
 * a player's personal/match-day shirt. Positions not in this map stay blank.
 */
export const PRIMAVERA2_POSITION_SHIRT: Record<string, number> = {
  GK: 1,
  RB: 2,
  LB: 3,
  CDM: 4,
  RCB: 5,
  LCB: 6,
  LW: 7,
  LCM: 8,
  ST: 9,
  RCM: 10,
  RW: 11,
};

/** Names that are themselves position codes (empty placeholder XIs). */
const POSITION_CODE = new Set([
  ...Object.keys(PRIMAVERA2_POSITION_SHIRT),
  'CAM',
  'CB',
  'CM',
  'RWB',
  'LWB',
  'RS',
  'LS',
  'RST',
  'LST',
  'RM',
  'LM',
  'LDM',
  'RDM',
  'CF',
  'SS',
  'AM',
  'DM',
  'WB',
  'RWB',
]);

function asRole(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const code = value.trim().toUpperCase();
  return code || undefined;
}

/** Role used to look up a P2 pitch number. */
export function roleForPrimavera2Shirt(
  player: Pick<PitchPlayer, 'role' | 'isGk' | 'name'>
): string | undefined {
  if (player.isGk) return 'GK';
  const fromRole = asRole(player.role);
  if (fromRole) return fromRole;
  const fromName = asRole(player.name);
  if (fromName && POSITION_CODE.has(fromName)) return fromName;
  return undefined;
}

/**
 * Shirt for a P2 pitch/depth slot. `null` when the role is not in the map
 * (shown as a blank token; PitchPlayer.number uses 0 for the same).
 */
export function shirtNumberForPrimavera2Role(
  role: string | undefined | null
): number | null {
  if (!role) return null;
  return PRIMAVERA2_POSITION_SHIRT[role.trim().toUpperCase()] ?? null;
}

/** Replace XI/starter numbers with the P2 position map (0 = unmapped / blank). */
export function applyPrimavera2PitchNumbers(players: PitchPlayer[]): PitchPlayer[] {
  return players.map((player) => {
    const role = roleForPrimavera2Shirt(player);
    const number = shirtNumberForPrimavera2Role(role) ?? 0;
    return { ...player, number };
  });
}
