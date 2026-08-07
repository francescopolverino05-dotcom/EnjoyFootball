import type { Localized } from '../i18n/translations';

export type GaconSessionKind = 'training' | 'match';

export interface GaconPlayerEntry {
  playerSlug: string;
  excelName: string;
  /** VAM finale in km/h (Excel value). */
  vamKmh: number;
}

export interface GaconSession {
  date: string;
  kind: GaconSessionKind;
  trainingSlug: string | null;
  matchSlug: string | null;
  /** Excel period label (e.g. agosto). */
  period: string;
  metric: 'vamKmh';
  unit: 'km/h';
  playersTested: number;
  avgVamKmh: number | null;
  players: GaconPlayerEntry[];
}

export interface GaconLoadDataset {
  source: string;
  scaleNote: Localized;
  sessions: GaconSession[];
  unmatchedNames: string[];
  skippedNoVam: string[];
}
