import type { Localized } from './translations';

/** Opposition clip phases — separate from match clip labels. */
export const OPPOSITION_CLIP_SECTION_IDS = [
  'build-up',
  'middle-third',
  'last-30m',
  'high-defence',
  'mid-block',
  'low-block',
  'attacking-transition',
  'defensive-transition',
  'attacking-corners',
  'defending-corners',
  'attacking-free-kicks',
  'defending-free-kicks',
  'attacking-throw-ins',
  'defending-throw-ins',
  'kickoffs',
] as const;

export type OppositionClipSectionId =
  (typeof OPPOSITION_CLIP_SECTION_IDS)[number];

export const OPPOSITION_CLIP_GROUP_IDS = [
  'attack',
  'defence',
  'transition',
  'setPieces',
] as const;

export type OppositionClipGroupId = (typeof OPPOSITION_CLIP_GROUP_IDS)[number];

export const OPPOSITION_CLIP_GROUPS: Record<
  OppositionClipGroupId,
  OppositionClipSectionId[]
> = {
  attack: ['build-up', 'middle-third', 'last-30m'],
  defence: ['high-defence', 'mid-block', 'low-block'],
  transition: ['attacking-transition', 'defensive-transition'],
  setPieces: [
    'attacking-corners',
    'defending-corners',
    'attacking-free-kicks',
    'defending-free-kicks',
    'attacking-throw-ins',
    'defending-throw-ins',
    'kickoffs',
  ],
};

/** GK coach phases live on the team Clips tab — not duplicated here. */
export const OPPOSITION_CLIP_SECTION_ORDER: OppositionClipSectionId[] = [
  ...OPPOSITION_CLIP_GROUPS.attack,
  ...OPPOSITION_CLIP_GROUPS.defence,
  ...OPPOSITION_CLIP_GROUPS.transition,
  ...OPPOSITION_CLIP_GROUPS.setPieces,
];

export const OPPOSITION_CLIP_SECTION_LABELS: Record<
  OppositionClipSectionId,
  Localized
> = {
  'build-up': { en: 'Build-up', it: 'Costruzione' },
  'middle-third': {
    en: 'Middle third progression',
    it: 'Progressione nel terzo mediano',
  },
  'last-30m': { en: 'Last 30 metres', it: 'Ultimi 30 metri' },
  'high-defence': { en: 'High defence', it: 'Difesa alta' },
  'mid-block': { en: 'Mid block', it: 'Blocco medio' },
  'low-block': { en: 'Low block', it: 'Blocco basso' },
  'attacking-transition': {
    en: 'Attacking transition',
    it: 'Transizione offensiva',
  },
  'defensive-transition': {
    en: 'Defensive transition',
    it: 'Transizione difensiva',
  },
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
};

export const OPPOSITION_CLIP_GROUP_LABEL_KEYS: Record<
  OppositionClipGroupId,
  'oppositionClipGroupAttack' | 'oppositionClipGroupDefence' | 'oppositionClipGroupTransition' | 'oppositionClipGroupSetPieces'
> = {
  attack: 'oppositionClipGroupAttack',
  defence: 'oppositionClipGroupDefence',
  transition: 'oppositionClipGroupTransition',
  setPieces: 'oppositionClipGroupSetPieces',
};

export function oppositionClipGroupFor(
  sectionId: OppositionClipSectionId
): OppositionClipGroupId {
  for (const groupId of OPPOSITION_CLIP_GROUP_IDS) {
    if (OPPOSITION_CLIP_GROUPS[groupId].includes(sectionId)) return groupId;
  }
  return 'attack';
}
