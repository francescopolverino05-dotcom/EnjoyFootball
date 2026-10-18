import type { LeagueMatchStats } from '../types/leagueMatchStats';
import type { StatsCompetitionId } from '../types/statsRankings';
import ascoliSpezia from './leagueMatchStats/ascoli-spezia.json';
import bariNapoli from './leagueMatchStats/bari-napoli.json';
import beneventoFrosinone from './leagueMatchStats/benevento-frosinone.json';
import catanzaroLatina from './leagueMatchStats/catanzaro-latina.json';
import monopoliCosenza from './leagueMatchStats/monopoli-cosenza.json';
import napoliPisa from './leagueMatchStats/napoli-pisa.json';
import palermoPescara from './leagueMatchStats/palermo-pescara.json';
import pisaPerugia from './leagueMatchStats/pisa-perugia.json';
import salernitanaBari from './leagueMatchStats/salernitana-bari.json';
import villarrealNapoli from './leagueMatchStats/villarreal-napoli.json';
import {
  getPrimavera2Standings,
  getUefaYouthLeagueStandings,
} from './standings';

const BY_KEY: Record<string, LeagueMatchStats> = {
  'primavera2/ascoli-spezia': ascoliSpezia as LeagueMatchStats,
  'primavera2/benevento-frosinone':
    beneventoFrosinone as LeagueMatchStats,
  'primavera2/catanzaro-latina': catanzaroLatina as LeagueMatchStats,
  'primavera2/monopoli-cosenza': monopoliCosenza as LeagueMatchStats,
  'primavera2/palermo-pescara': palermoPescara as LeagueMatchStats,
  'primavera2/salernitana-bari': salernitanaBari as LeagueMatchStats,
  'primavera2/pisa-perugia': pisaPerugia as LeagueMatchStats,
  'primavera2/napoli-pisa': napoliPisa as LeagueMatchStats,
  'primavera2/bari-napoli': bariNapoli as LeagueMatchStats,
  'uefaYouthLeague/villarreal-napoli':
    villarrealNapoli as LeagueMatchStats,
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
):
  | {
      competitionId: StatsCompetitionId;
      slug: string;
      pack: LeagueMatchStats;
    }
  | undefined {
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

  const uylTable = getUefaYouthLeagueStandings().groupTable;
  if (uylTable) {
    for (const md of uylTable.matchdays) {
      for (const fx of md.fixtures) {
        if (fx.matchSlug === matchSlug && fx.statsSlug) {
          const pack = getLeagueMatchStats('uefaYouthLeague', fx.statsSlug);
          if (pack) {
            return {
              competitionId: 'uefaYouthLeague',
              slug: fx.statsSlug,
              pack,
            };
          }
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
