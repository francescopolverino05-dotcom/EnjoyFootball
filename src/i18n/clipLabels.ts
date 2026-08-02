import type { Localized } from './translations';

/** Controlled clip categories — keep these consistent across matches. */
export const CLIP_LABEL_IDS = [
  'goal',
  'chance',
  'build-up',
  'pressing',
  'defensive-transition',
  'offensive-transition',
  'set-piece',
  'individual',
  'tactical-pattern',
  'gk-action',
  'other',
] as const;

export type ClipLabelId = (typeof CLIP_LABEL_IDS)[number];

export const CLIP_LABELS: Record<ClipLabelId, Localized> = {
  goal: { en: 'Goal', it: 'Gol' },
  chance: { en: 'Chance', it: 'Occasione' },
  'build-up': { en: 'Build-up', it: 'Costruzione' },
  pressing: { en: 'Pressing', it: 'Pressing' },
  'defensive-transition': {
    en: 'Defensive transition',
    it: 'Transizione difensiva',
  },
  'offensive-transition': {
    en: 'Offensive transition',
    it: 'Transizione offensiva',
  },
  'set-piece': { en: 'Set piece', it: 'Calcio piazzato' },
  individual: { en: 'Individual action', it: 'Azione individuale' },
  'tactical-pattern': { en: 'Tactical pattern', it: 'Schema tattico' },
  'gk-action': { en: 'Goalkeeper action', it: 'Azione portiere' },
  other: { en: 'Other', it: 'Altro' },
};

export function isClipLabelId(value: string): value is ClipLabelId {
  return (CLIP_LABEL_IDS as readonly string[]).includes(value);
}
