import type { Localized } from '../i18n/translations';
import type { MatchCompetitionId } from './match';

export type StatsCategoryId =
  | 'general'
  | 'offensive'
  | 'defensive'
  | 'possession';

/** Competitions shown on the Stats page (same trio as Table). */
export type StatsCompetitionId =
  | Extract<
      MatchCompetitionId,
      'primavera2' | 'coppaItalia' | 'uefaYouthLeague'
    >;

/** One club’s season value within a competition ranking. */
export interface StatsRankingRow {
  teamId: string;
  /** Display name (e.g. Napoli, Avellino). */
  team: string;
  /** Highlight Napoli in the table. */
  isUs: boolean;
  value: number;
  /** Matches contributing to this average. */
  played: number;
  competitionId: StatsCompetitionId;
}

export interface StatsMetric {
  id: string;
  label: Localized;
  unit?: string;
  higherIsBetter: boolean;
  rows: StatsRankingRow[];
}

export interface StatsCategory {
  id: StatsCategoryId;
  label: Localized;
  metrics: StatsMetric[];
}

export interface StatsRankingsDataset {
  season: string;
  updatedAt: string;
  scope: Localized;
  categories: Record<StatsCategoryId, StatsCategory>;
}
