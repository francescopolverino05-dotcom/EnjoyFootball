import type { Localized } from '../i18n/translations';

/** Short bilingual bullet for scout / reflection lists. */
export interface ScoutNote {
  id: string;
  text: Localized;
}

/** Opposition scout prep — what they do well vs what to attack. */
export interface StrengthsWeaknesses {
  strengths: ScoutNote[];
  weaknesses: ScoutNote[];
}

/** Post-match reflection — WWB/EBI (EN) · CAB/AMS (IT). */
export interface MatchReflection {
  wentWell: ScoutNote[];
  evenBetterIf: ScoutNote[];
}

export const EMPTY_STRENGTHS_WEAKNESSES: StrengthsWeaknesses = {
  strengths: [],
  weaknesses: [],
};

export const EMPTY_MATCH_REFLECTION: MatchReflection = {
  wentWell: [],
  evenBetterIf: [],
};
