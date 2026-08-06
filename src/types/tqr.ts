import type { Localized } from '../i18n/translations';

export type TqrSessionKind = 'training' | 'match';

export interface TqrPlayerEntry {
  playerSlug: string;
  excelName: string;
  tqr: number;
}

export interface TqrSession {
  date: string;
  kind: TqrSessionKind;
  trainingSlug: string | null;
  matchSlug: string | null;
  playersAnswered: number;
  avgTqr: number | null;
  players: TqrPlayerEntry[];
}

export interface TqrLoadDataset {
  source: string;
  scaleNote: Localized;
  sessions: TqrSession[];
  unmatchedNames: string[];
  unmatchedDates: string[];
}
