import type { Localized } from '../i18n/translations';

export type RpeSessionKind = 'training' | 'match';

export interface RpePlayerEntry {
  playerSlug: string;
  excelName: string;
  min: number | null;
  rpe: number;
  sessionLoad: number | null;
}

export interface RpeSession {
  date: string;
  kind: RpeSessionKind;
  trainingSlug: string | null;
  matchSlug: string | null;
  playersPresent: number;
  playersAnswered: number;
  avgMin: number | null;
  avgRpe: number | null;
  avgSessionLoad: number | null;
  players: RpePlayerEntry[];
}

export interface RpeLoadDataset {
  source: string;
  scaleNote: Localized;
  sessions: RpeSession[];
  unmatchedNames: string[];
}
