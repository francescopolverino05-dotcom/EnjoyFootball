import type { LeagueMatchStats } from '../types/leagueMatchStats';
import type { StatsCompetitionId } from '../types/statsRankings';
import napoliPisa from './leagueMatchStats/napoli-pisa.json';
import pisaPerugia from './leagueMatchStats/pisa-perugia.json';
import { getPrimavera2Standings } from './standings';

const BY_KEY: Record<string, LeagueMatchStats> = {
  'primavera2/pisa-perugia': pisaPerugia as LeagueMatchStats,
  'primavera2/napoli-pisa': napoliPisa as LeagueMatchStats,
};

export function getLeagueMatchStats(
  competitionId: string,
  slug: string
): LeagueMatchStats | undefined {
  return BY_KEY[`${competitionId}/${slug}`];
}

/** Resolve tagged league sheet for a Napoli match report slug (via standings fixture). */
export function getLeagueMatchStatsForMatchSlug(
  matchSlug: string
): { competitionId: 'primavera2'; slug: string; pack: LeagueMatchStats } | undefined {
  for (const md of getPrimavera2Standings().matchdays) {
    for (const fx of md.fixtures) {
      if (fx.matchSlug === matchSlug && fx.statsSlug) {
        const pack = getLeagueMatchStats('primavera2', fx.statsSlug);
        if (pack) {
          return { competitionId: 'primavera2', slug: fx.statsSlug, pack };
        }
      }
    }
  }
  return undefined;
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
