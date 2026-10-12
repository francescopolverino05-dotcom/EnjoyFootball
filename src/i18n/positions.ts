import type { Locale } from './translations';

/** Collapse side-specific centres to a generic line role. */
const POSITION_CANONICAL: Record<string, string> = {
  RCB: 'CB',
  LCB: 'CB',
  RCM: 'CM',
  LCM: 'CM',
  RST: 'ST',
  LST: 'ST',
};

/** Depth order: Por (0) → Att (highest). */
const POSITION_DEPTH_RANK: Record<string, number> = {
  GK: 0,
  POR: 0,
  CB: 10,
  RB: 20,
  LB: 21,
  RWB: 22,
  LWB: 23,
  CDM: 30,
  MED: 30,
  CM: 40,
  RM: 50,
  LM: 51,
  CAM: 60,
  AM: 60,
  RW: 70,
  LW: 71,
  ST: 80,
  CF: 80,
};

/** English role codes → Italian coaching abbreviations (after canonical collapse). */
const POSITION_IT: Record<string, string> = {
  GK: 'Por',
  POR: 'Por',
  RB: 'TD',
  LB: 'TS',
  CB: 'DC',
  RWB: 'EDd',
  LWB: 'EDs',
  CM: 'CC',
  CDM: 'Med',
  CAM: 'Trq',
  AM: 'Trq',
  RM: 'ED',
  LM: 'ES',
  RW: 'AD',
  LW: 'AS',
  ST: 'Att',
  CF: 'Att',
};

const FOOT_IT: Record<string, string> = {
  right: 'Destro',
  left: 'Sinistro',
  both: 'Ambidestro',
  destro: 'Destro',
  sinistro: 'Sinistro',
  ambidestro: 'Ambidestro',
};

const FOOT_EN: Record<string, string> = {
  destro: 'Right',
  sinistro: 'Left',
  ambidestro: 'Both',
  right: 'Right',
  left: 'Left',
  both: 'Both',
};

/** Sort key: deepest (Por) first → highest (Att) last. */
export function oppositionPositionDepthRank(
  position: string | null | undefined
): number {
  if (position == null || position === '') return 999;
  const parts = position.split(/\s*\/\s*/).map((p) => {
    const raw = p.trim().toUpperCase();
    const code = POSITION_CANONICAL[raw] ?? raw;
    return POSITION_DEPTH_RANK[code] ?? 90;
  });
  // Compound roles: use the deepest (lowest) part for grouping order.
  return Math.min(...parts);
}

export function compareOppositionSquadByDepth(
  a: { position?: string | null; name: string; number?: number | null },
  b: { position?: string | null; name: string; number?: number | null }
): number {
  const rank =
    oppositionPositionDepthRank(a.position) -
    oppositionPositionDepthRank(b.position);
  if (rank !== 0) return rank;
  const numA = a.number ?? 999;
  const numB = b.number ?? 999;
  if (numA !== numB) return numA - numB;
  return a.name.localeCompare(b.name, 'it');
}

export function sortOppositionSquadByDepth<
  T extends { position?: string | null; name: string; number?: number | null },
>(players: T[]): T[] {
  return [...players].sort(compareOppositionSquadByDepth);
}

/** Localize a role code or compound like "ST / RW" (DCd/CCd → DC/CC). */
export function localizePosition(
  position: string | null | undefined,
  locale: Locale
): string {
  if (position == null || position === '') return '—';
  return position
    .split(/\s*\/\s*/)
    .map((part) => {
      const raw = part.trim().toUpperCase();
      const code = POSITION_CANONICAL[raw] ?? raw;
      if (locale === 'it') return POSITION_IT[code] ?? part.trim();
      return code;
    })
    .join(' / ');
}

/** Preferred foot for PDF (data is often already Italian). */
export function localizePreferredFoot(
  foot: string | null | undefined,
  locale: Locale
): string {
  if (foot == null || foot === '') return '—';
  const key = foot.trim().toLowerCase();
  if (locale === 'it') return FOOT_IT[key] ?? foot;
  return FOOT_EN[key] ?? foot;
}
