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
  'attacking-corners',
  'defending-corners',
  'attacking-free-kicks',
  'defending-free-kicks',
  'attacking-throw-ins',
  'defending-throw-ins',
  'kickoffs',
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
  'attacking-corners': {
    en: 'Attacking corners',
    it: 'Calci d’angolo offensivi',
  },
  'defending-corners': {
    en: 'Defending corners',
    it: 'Calci d’angolo difensivi',
  },
  'attacking-free-kicks': {
    en: 'Attacking free kicks',
    it: 'Punizioni offensive',
  },
  'defending-free-kicks': {
    en: 'Defending free kicks',
    it: 'Punizioni difensive',
  },
  'attacking-throw-ins': {
    en: 'Attacking throw-ins',
    it: 'Rimesse laterali offensive',
  },
  'defending-throw-ins': {
    en: 'Defending throw-ins',
    it: 'Rimesse laterali difensive',
  },
  kickoffs: { en: 'Kickoffs', it: 'Calci d’inizio' },
  individual: { en: 'Individual action', it: 'Azione individuale' },
  'tactical-pattern': { en: 'Tactical pattern', it: 'Schema tattico' },
  'gk-action': { en: 'Goalkeeper action', it: 'Azione portiere' },
  other: { en: 'Other', it: 'Altro' },
};

/** Sections never shown on the match Clips tab (unless includeOtherSection). */
export const HIDDEN_CLIP_SECTIONS: ReadonlySet<ClipLabelId> = new Set([
  'other',
]);

/**
 * Phase groups for match/training Clips — same UX as Opposition
 * (Attack · Defence · Transition · Set pieces).
 */
export const MATCH_CLIP_GROUP_IDS = [
  'attack',
  'defence',
  'transition',
  'setPieces',
] as const;

export type MatchClipGroupId = (typeof MATCH_CLIP_GROUP_IDS)[number];

export const MATCH_CLIP_GROUPS: Record<MatchClipGroupId, ClipLabelId[]> = {
  attack: ['build-up', 'progress', 'goal'],
  defence: ['high-defence', 'mid-block', 'own-third', 'pressing', 'gk-action'],
  transition: ['offensive-transition', 'defensive-transition'],
  setPieces: [
    'attacking-corners',
    'defending-corners',
    'attacking-free-kicks',
    'defending-free-kicks',
    'attacking-throw-ins',
    'defending-throw-ins',
    'kickoffs',
    'set-piece',
  ],
};

/** Attack extras — only listed when a match actually has clips in that bucket. */
export const MATCH_CLIP_OPTIONAL_SECTIONS: ClipLabelId[] = [
  'final-third',
  'chance',
  'individual',
  'tactical-pattern',
  'pressing',
  'gk-action',
  'goal',
];

/** Preferred display order for Clips sections (within groups). */
export const ANALYSIS_SECTION_ORDER: ClipLabelId[] = [
  ...MATCH_CLIP_GROUPS.attack,
  ...MATCH_CLIP_GROUPS.defence,
  ...MATCH_CLIP_GROUPS.transition,
  ...MATCH_CLIP_GROUPS.setPieces,
];

export const MATCH_CLIP_GROUP_LABEL_KEYS: Record<
  MatchClipGroupId,
  | 'oppositionClipGroupAttack'
  | 'oppositionClipGroupDefence'
  | 'oppositionClipGroupTransition'
  | 'oppositionClipGroupSetPieces'
> = {
  attack: 'oppositionClipGroupAttack',
  defence: 'oppositionClipGroupDefence',
  transition: 'oppositionClipGroupTransition',
  setPieces: 'oppositionClipGroupSetPieces',
};

export function matchClipGroupFor(sectionId: ClipLabelId): MatchClipGroupId {
  for (const groupId of MATCH_CLIP_GROUP_IDS) {
    if (MATCH_CLIP_GROUPS[groupId].includes(sectionId)) return groupId;
  }
  return 'attack';
}

export function isClipLabelId(value: string): value is ClipLabelId {
  return (CLIP_LABEL_IDS as readonly string[]).includes(value);
}
