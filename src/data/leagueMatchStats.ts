import type { LeagueMatchStats } from '../types/leagueMatchStats';
import type { StatsCompetitionId } from '../types/statsRankings';
import ascoliSpezia from './leagueMatchStats/ascoli-spezia.json';
import avellinoCatanzaro from './leagueMatchStats/avellino-catanzaro.json';
import avellinoLatina from './leagueMatchStats/avellino-latina.json';
import bariAscoli from './leagueMatchStats/bari-ascoli.json';
import bariNapoli from './leagueMatchStats/bari-napoli.json';
import beneventoCosenza from './leagueMatchStats/benevento-cosenza.json';
import beneventoFrosinone from './leagueMatchStats/benevento-frosinone.json';
import catanzaroFrosinone from './leagueMatchStats/catanzaro-frosinone.json';
import catanzaroLatina from './leagueMatchStats/catanzaro-latina.json';
import cosenzaAvellino from './leagueMatchStats/cosenza-avellino.json';
import cosenzaCatanzaro from './leagueMatchStats/cosenza-catanzaro.json';
import frosinonePalermo from './leagueMatchStats/frosinone-palermo.json';
import latinaBari from './leagueMatchStats/latina-bari.json';
import latinaSalernitana from './leagueMatchStats/latina-salernitana.json';
import monopoliBenevento from './leagueMatchStats/monopoli-benevento.json';
import monopoliCosenza from './leagueMatchStats/monopoli-cosenza.json';
import monopoliPescara from './leagueMatchStats/monopoli-pescara.json';
import napoliPisa from './leagueMatchStats/napoli-pisa.json';
import palermoBari from './leagueMatchStats/palermo-bari.json';
import palermoPescara from './leagueMatchStats/palermo-pescara.json';
import perugiaAvellino from './leagueMatchStats/perugia-avellino.json';
import perugiaMonopoli from './leagueMatchStats/perugia-monopoli.json';
import pescaraAscoli from './leagueMatchStats/pescara-ascoli.json';
import pescaraBenevento from './leagueMatchStats/pescara-benevento.json';
import pescaraSalernitana from './leagueMatchStats/pescara-salernitana.json';
import pisaAscoli from './leagueMatchStats/pisa-ascoli.json';
import pisaPerugia from './leagueMatchStats/pisa-perugia.json';
import pisaSpezia from './leagueMatchStats/pisa-spezia.json';
import salernitanaBari from './leagueMatchStats/salernitana-bari.json';
import salernitanaBenevento from './leagueMatchStats/salernitana-benevento.json';
import salernitanaPerugia from './leagueMatchStats/salernitana-perugia.json';
import speziaMonopoli from './leagueMatchStats/spezia-monopoli.json';
import speziaPalermo from './leagueMatchStats/spezia-palermo.json';
import villarrealNapoli from './leagueMatchStats/villarreal-napoli.json';
import {
  getPrimavera2Standings,
  getUefaYouthLeagueStandings,
} from './standings';

const BY_KEY: Record<string, LeagueMatchStats> = {
  'primavera2/ascoli-spezia': ascoliSpezia as LeagueMatchStats,
  'primavera2/avellino-catanzaro': avellinoCatanzaro as LeagueMatchStats,
  'primavera2/avellino-latina': avellinoLatina as LeagueMatchStats,
  'primavera2/bari-ascoli': bariAscoli as LeagueMatchStats,
  'primavera2/bari-napoli': bariNapoli as LeagueMatchStats,
  'primavera2/benevento-cosenza': beneventoCosenza as LeagueMatchStats,
  'primavera2/benevento-frosinone': beneventoFrosinone as LeagueMatchStats,
  'primavera2/catanzaro-frosinone': catanzaroFrosinone as LeagueMatchStats,
  'primavera2/catanzaro-latina': catanzaroLatina as LeagueMatchStats,
  'primavera2/cosenza-avellino': cosenzaAvellino as LeagueMatchStats,
  'primavera2/cosenza-catanzaro': cosenzaCatanzaro as LeagueMatchStats,
  'primavera2/frosinone-palermo': frosinonePalermo as LeagueMatchStats,
  'primavera2/latina-bari': latinaBari as LeagueMatchStats,
  'primavera2/latina-salernitana': latinaSalernitana as LeagueMatchStats,
  'primavera2/monopoli-benevento': monopoliBenevento as LeagueMatchStats,
  'primavera2/monopoli-cosenza': monopoliCosenza as LeagueMatchStats,
  'primavera2/monopoli-pescara': monopoliPescara as LeagueMatchStats,
  'primavera2/napoli-pisa': napoliPisa as LeagueMatchStats,
  'primavera2/palermo-bari': palermoBari as LeagueMatchStats,
  'primavera2/palermo-pescara': palermoPescara as LeagueMatchStats,
  'primavera2/perugia-avellino': perugiaAvellino as LeagueMatchStats,
  'primavera2/perugia-monopoli': perugiaMonopoli as LeagueMatchStats,
  'primavera2/pescara-ascoli': pescaraAscoli as LeagueMatchStats,
  'primavera2/pescara-benevento': pescaraBenevento as LeagueMatchStats,
  'primavera2/pescara-salernitana': pescaraSalernitana as LeagueMatchStats,
  'primavera2/pisa-ascoli': pisaAscoli as LeagueMatchStats,
  'primavera2/pisa-perugia': pisaPerugia as LeagueMatchStats,
  'primavera2/pisa-spezia': pisaSpezia as LeagueMatchStats,
  'primavera2/salernitana-bari': salernitanaBari as LeagueMatchStats,
  'primavera2/salernitana-benevento': salernitanaBenevento as LeagueMatchStats,
  'primavera2/salernitana-perugia': salernitanaPerugia as LeagueMatchStats,
  'primavera2/spezia-monopoli': speziaMonopoli as LeagueMatchStats,
  'primavera2/spezia-palermo': speziaPalermo as LeagueMatchStats,
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
