import type { LeagueMatchStats } from '../types/leagueMatchStats';
import type { StatsCompetitionId } from '../types/statsRankings';
import pisaPerugia from './leagueMatchStats/pisa-perugia.json';

const BY_KEY: Record<string, LeagueMatchStats> = {
  'primavera2/pisa-perugia': pisaPerugia as LeagueMatchStats,
};

export function getLeagueMatchStats(
  competitionId: string,
  slug: string
): LeagueMatchStats | undefined {
  return BY_KEY[`${competitionId}/${slug}`];
}

export function isLeagueMatchCompetitionId(
  value: string
): value is StatsCompetitionId {
  return (
    value === 'primavera2' ||
    value === 'coppaItalia' ||
    value === 'uefaYouthLeague'
  );
}
