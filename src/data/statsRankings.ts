import raw from './stats-rankings.json';
import type {
  StatsCategory,
  StatsCategoryId,
  StatsCompetitionId,
  StatsMetric,
  StatsRankingRow,
  StatsRankingsDataset,
} from '../types/statsRankings';

export const STATS_CATEGORY_ORDER: StatsCategoryId[] = [
  'general',
  'offensive',
  'defensive',
  'possession',
];

/** Same official trio as the Table page. */
export const STATS_COMPETITION_ORDER: StatsCompetitionId[] = [
  'primavera2',
  'coppaItalia',
  'uefaYouthLeague',
];

const data = raw as StatsRankingsDataset;

export function getStatsRankings(): StatsRankingsDataset {
  return data;
}

export function getStatsCategory(
  id: StatsCategoryId
): StatsCategory | undefined {
  return data.categories[id];
}

/** Metrics for a category with rows limited to one competition. */
export function getStatsCategoryForCompetition(
  categoryId: StatsCategoryId,
  competitionId: StatsCompetitionId
): StatsCategory | undefined {
  const category = data.categories[categoryId];
  if (!category) return undefined;
  const metrics = category.metrics
    .map((metric) => ({
      ...metric,
      rows: metric.rows.filter((row) => row.competitionId === competitionId),
    }))
    .filter((metric) => metric.rows.length > 0);
  return { ...category, metrics };
}

/** Sort rows for a ranking table (best first); Napoli breaks ties upward. */
export function sortMetricRows(
  rows: StatsRankingRow[],
  higherIsBetter: boolean
): StatsRankingRow[] {
  return [...rows].sort((a, b) => {
    const diff = higherIsBetter ? b.value - a.value : a.value - b.value;
    if (diff !== 0) return diff;
    if (a.isUs !== b.isUs) return a.isUs ? -1 : 1;
    return a.team.localeCompare(b.team);
  });
}

/** Napoli’s value in a metric (for the highlight strip). */
export function metricUsValue(metric: StatsMetric): number | null {
  const us = metric.rows.find((row) => row.isUs);
  return us ? us.value : null;
}

export function formatStatsValue(
  value: number,
  unit?: string,
  digits = 2
): string {
  const rounded =
    Number.isInteger(value) || Math.abs(value - Math.round(value)) < 1e-9
      ? String(Math.round(value))
      : value.toFixed(digits).replace(/\.?0+$/, '');
  if (unit === '%') return `${rounded}%`;
  return rounded;
}

export function isStatsCategoryId(value: string): value is StatsCategoryId {
  return (STATS_CATEGORY_ORDER as string[]).includes(value);
}

export function isStatsCompetitionId(
  value: string
): value is StatsCompetitionId {
  return (STATS_COMPETITION_ORDER as string[]).includes(value);
}
