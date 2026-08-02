import type { Localized } from './translations';

/** Controlled clip / analysis section categories — keep consistent across matches. */
export const CLIP_LABEL_IDS = [
  'build-up',
  'progress',
  'offensive-transition',
  'mid-block',
  'high-defence',
  'final-third',
  'own-third',
  'defensive-transition',
  'goal',
  'chance',
  'pressing',
  'set-piece',
  'individual',
  'tactical-pattern',
  'gk-action',
  'other',
] as const;

export type ClipLabelId = (typeof CLIP_LABEL_IDS)[number];

export const CLIP_LABELS: Record<ClipLabelId, Localized> = {
  'build-up': { en: 'Build-up', it: 'Costruzione' },
  progress: { en: 'Progression', it: 'Progressione' },
  'offensive-transition': {
    en: 'Transition to attack',
    it: 'Transizione offensiva',
  },
  'mid-block': { en: 'Mid block', it: 'Blocco medio' },
  'high-defence': { en: 'High defence', it: 'Difesa alta' },
  'final-third': { en: 'Final third', it: 'Ultimo terzo' },
  'own-third': { en: 'Own third', it: 'Proprio terzo' },
  'defensive-transition': {
    en: 'Transition to defence',
    it: 'Transizione difensiva',
  },
  goal: { en: 'Goal', it: 'Gol' },
  chance: { en: 'Chance', it: 'Occasione' },
  pressing: { en: 'Pressing', it: 'Pressing' },
  'set-piece': { en: 'Set piece', it: 'Calcio piazzato' },
  individual: { en: 'Individual action', it: 'Azione individuale' },
  'tactical-pattern': { en: 'Tactical pattern', it: 'Schema tattico' },
  'gk-action': { en: 'Goalkeeper action', it: 'Azione portiere' },
  other: { en: 'Other', it: 'Altro' },
};

/** Sections never shown on the Clips tab (any match). */
export const HIDDEN_CLIP_SECTIONS: ReadonlySet<ClipLabelId> = new Set([
  'goal',
  'other',
]);

/** Preferred display order for Clips sections. */
export const ANALYSIS_SECTION_ORDER: ClipLabelId[] = [
  'build-up',
  'progress',
  'offensive-transition',
  'mid-block',
  'high-defence',
  'final-third',
  'own-third',
  'defensive-transition',
  'chance',
  'pressing',
  'set-piece',
  'individual',
  'tactical-pattern',
  'gk-action',
];

export function isClipLabelId(value: string): value is ClipLabelId {
  return (CLIP_LABEL_IDS as readonly string[]).includes(value);
}
