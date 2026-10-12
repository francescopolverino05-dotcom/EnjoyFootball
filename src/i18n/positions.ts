import type { Locale } from './translations';

/** English role codes → Italian coaching abbreviations. */
const POSITION_IT: Record<string, string> = {
  GK: 'Por',
  POR: 'Por',
  RB: 'TD',
  LB: 'TS',
  CB: 'DC',
  RCB: 'DCd',
  LCB: 'DCs',
  RWB: 'EDd',
  LWB: 'EDs',
  CM: 'CC',
  RCM: 'CCd',
  LCM: 'CCs',
  CDM: 'Med',
  CAM: 'Trq',
  AM: 'Trq',
  RM: 'ED',
  LM: 'ES',
  RW: 'AD',
  LW: 'AS',
  ST: 'Att',
  CF: 'Att',
  RST: 'Att d',
  LST: 'Att s',
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

/** Localize a role code or compound like "ST / RW". */
export function localizePosition(
  position: string | null | undefined,
  locale: Locale
): string {
  if (position == null || position === '') return '—';
  if (locale !== 'it') return position;
  return position
    .split(/\s*\/\s*/)
    .map((part) => {
      const key = part.trim().toUpperCase();
      return POSITION_IT[key] ?? part.trim();
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
