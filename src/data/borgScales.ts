import type { Localized } from '../i18n/translations';

/** Labeled Borg 6–20 anchors (even mid-points 8–18 are unlabeled on staff charts). */
export interface BorgScaleStep {
  value: number;
  label: Localized;
}

export type BorgScaleKind = 'rpe' | 'tqr';

export interface BorgScaleDef {
  kind: BorgScaleKind;
  /** Staff chart title */
  title: Localized;
  rangeLabel: Localized;
  steps: BorgScaleStep[];
}

/** Official RPE interpretation (Borg 6–20) from staff reference chart. */
export const RPE_BORG_SCALE: BorgScaleDef = {
  kind: 'rpe',
  title: {
    en: 'RPE — Rate of perceived exertion',
    it: 'RPE Percezione dello sforzo',
  },
  rangeLabel: {
    en: 'Borg 6–20',
    it: 'Borg 6–20',
  },
  steps: [
    { value: 6, label: { en: 'No exertion at all', it: 'Nessuno sforzo in assoluto' } },
    { value: 7, label: { en: 'Extremely light', it: 'Estremamente leggero' } },
    { value: 9, label: { en: 'Very light', it: 'Molto leggero' } },
    { value: 11, label: { en: 'Light', it: 'Leggero' } },
    { value: 13, label: { en: 'Fairly light', it: 'Abbastanza leggero' } },
    { value: 15, label: { en: 'Hard (heavy)', it: 'Duro (pesante)' } },
    { value: 17, label: { en: 'Very hard', it: 'Molto duro' } },
    { value: 19, label: { en: 'Extremely hard', it: 'Estremamente duro' } },
    { value: 20, label: { en: 'Maximal exertion', it: 'Massimo sforzo' } },
  ],
};

/** Official TQR interpretation (6–20) from staff reference chart. */
export const TQR_BORG_SCALE: BorgScaleDef = {
  kind: 'tqr',
  title: {
    en: 'Perception of recovery quality',
    it: 'Percezione della qualità del recupero',
  },
  rangeLabel: {
    en: 'TQR 6–20',
    it: 'TQR 6–20',
  },
  steps: [
    {
      value: 6,
      label: {
        en: 'Absolutely no recovery',
        it: 'Assolutamente nessun recupero',
      },
    },
    {
      value: 7,
      label: {
        en: 'Extremely poor recovery',
        it: 'Recupero estremamente scarso',
      },
    },
    {
      value: 9,
      label: { en: 'Very poor recovery', it: 'Recupero molto scarso' },
    },
    { value: 11, label: { en: 'Poor recovery', it: 'Recupero scarso' } },
    {
      value: 13,
      label: { en: 'Reasonable recovery', it: 'Recupero ragionevole' },
    },
    { value: 15, label: { en: 'Good recovery', it: 'Recupero buono' } },
    {
      value: 17,
      label: { en: 'Very good recovery', it: 'Recupero molto buono' },
    },
    {
      value: 19,
      label: {
        en: 'Extremely good recovery',
        it: 'Recupero estremamente buono',
      },
    },
    { value: 20, label: { en: 'Maximal recovery', it: 'Recupero massimo' } },
  ],
};

export function getBorgScale(kind: BorgScaleKind): BorgScaleDef {
  return kind === 'rpe' ? RPE_BORG_SCALE : TQR_BORG_SCALE;
}
