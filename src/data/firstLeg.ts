import { getLeagueMatchStatsForMatchSlug } from './leagueMatchStats';
import type { Localized } from '../i18n/translations';
import type {
  MatchData,
  PlayerAppearance,
  TeamStat,
} from '../types/match';
import type { LeagueMatchPlayerStatRow } from '../types/leagueMatchStats';

export interface FirstLegStatRow {
  id: string;
  label: Localized;
  home: Localized;
  away: Localized;
}

export interface FirstLegPlayerRow {
  id: string;
  name: string;
  team: string;
  goals: number | null;
  shots: number | null;
  onTarget: number | null;
  keyPasses: number | null;
  xg: number | null;
  note?: string;
}

export interface FirstLegView {
  stats: FirstLegStatRow[];
  players: FirstLegPlayerRow[];
  formation?: { home: string; away: string };
  leagueStatsHref?: string;
}

const MATCH_STAT_NAMES = [
  'Goals / xG',
  'Possession %',
  'Shots (On Target / Accuracy %)',
  'Passes (Accurate / Accuracy %)',
  'Passes (Completed / Accuracy %)',
  'Duels Total (Won / Win %)',
  'Corners (With Shot / %)',
];

const LEAGUE_STAT_SLOTS: { id: string; names: string[] }[] = [
  { id: 'goals', names: ['Goals'] },
  {
    id: 'xg',
    names: ['xG (estimated)', 'xG (estimated, distance/angle model)'],
  },
  { id: 'shots', names: ['Shots (full match)'] },
  { id: 'sot', names: ['Shots on target'] },
  {
    id: 'possession',
    names: ['Possession % (full match)', 'Possession %'],
  },
  { id: 'passes', names: ['Passes'] },
  { id: 'pass-acc', names: ['Pass accuracy % (full match)'] },
];

function statName(stat: TeamStat): string {
  return typeof stat.name === 'string' ? stat.name : stat.name.en;
}

function asText(value: Localized): string {
  return typeof value === 'string' ? value : value.en;
}

function teamShortName(match: MatchData, teamId: string): string {
  if (teamId === match.homeTeam.id) return match.homeTeam.shortName;
  if (teamId === match.awayTeam.id) return match.awayTeam.shortName;
  return teamId;
}

function statsFromMatch(match: MatchData): FirstLegStatRow[] {
  const rows: FirstLegStatRow[] = [];
  for (const name of MATCH_STAT_NAMES) {
    const stat = match.teamStats.find((row) => statName(row) === name);
    if (!stat) continue;
    rows.push({
      id: name,
      label: stat.name,
      home: stat.home,
      away: stat.away,
    });
  }
  return rows;
}

function statsFromLeague(match: MatchData): FirstLegStatRow[] {
  const sheet = getLeagueMatchStatsForMatchSlug(match.slug);
  if (!sheet) return [];
  const rows: FirstLegStatRow[] = [];
  for (const slot of LEAGUE_STAT_SLOTS) {
    const stat = sheet.pack.teamStats.find((row) =>
      slot.names.includes(row.stat)
    );
    if (!stat) continue;
    rows.push({
      id: slot.id,
      label: stat.stat,
      home: stat.home,
      away: stat.away,
    });
  }
  return rows;
}

function formationFromMatch(
  match: MatchData
): { home: string; away: string } | undefined {
  const stat = match.teamStats.find((row) => statName(row) === 'Formation');
  if (!stat) return undefined;
  const home = asText(stat.home).trim();
  const away = asText(stat.away).trim();
  if (!home && !away) return undefined;
  return { home, away };
}

function appearanceNote(player: PlayerAppearance, assistLabel: string): string {
  const bits: string[] = [];
  if (player.goals?.length) {
    bits.push(player.goals.map((minute) => `${minute}'`).join(', '));
  }
  if (player.assists?.length) {
    bits.push(
      `${assistLabel} ${player.assists.map((minute) => `${minute}'`).join(', ')}`
    );
  }
  return bits.join(' · ');
}

function playersFromAppearances(
  match: MatchData,
  assistLabel: string
): FirstLegPlayerRow[] {
  const rows = [
    ...(match.appearances?.home ?? []),
    ...(match.appearances?.away ?? []),
  ];
  return rows
    .filter(
      (player) =>
        (player.goals?.length ?? 0) > 0 || (player.assists?.length ?? 0) > 0
    )
    .map((player) => ({
      id: `${player.teamId}-${player.number ?? ''}-${player.name}`,
      name: player.number != null ? `${player.number} ${player.name}` : player.name,
      team: teamShortName(match, player.teamId),
      goals: player.goals?.length ?? null,
      shots: null,
      onTarget: null,
      keyPasses: null,
      xg: null,
      note: appearanceNote(player, assistLabel),
    }));
}

function isNotable(row: LeagueMatchPlayerStatRow): boolean {
  return (
    row.goals > 0 ||
    row.onTarget > 0 ||
    row.keyPasses > 0 ||
    row.saves > 0 ||
    row.shots >= 2
  );
}

function playersFromLeague(match: MatchData): FirstLegPlayerRow[] {
  const sheet = getLeagueMatchStatsForMatchSlug(match.slug);
  const players = sheet?.pack.playerStats ?? [];
  const notable = players.filter(isNotable);
  const source = (notable.length > 0 ? notable : players).slice().sort((a, b) => {
    return (
      b.goals - a.goals ||
      b.xg - a.xg ||
      b.shots - a.shots ||
      b.keyPasses - a.keyPasses ||
      b.saves - a.saves
    );
  });
  return source.slice(0, 8).map((row) => ({
    id: `${row.team}-${row.player}`,
    name: row.player,
    team: row.team,
    goals: row.goals,
    shots: row.shots,
    onTarget: row.onTarget,
    keyPasses: row.keyPasses,
    xg: row.xg,
  }));
}

/** Key figures for a first-leg report. Reads the original match and its league sheet. */
export function buildFirstLegView(
  match: MatchData,
  assistLabel: string
): FirstLegView {
  const fromReport = statsFromMatch(match);
  const stats = fromReport.length >= 3 ? fromReport : statsFromLeague(match);
  const leaguePlayers = playersFromLeague(match);
  const players =
    leaguePlayers.length > 0
      ? leaguePlayers
      : playersFromAppearances(match, assistLabel);
  const sheet = getLeagueMatchStatsForMatchSlug(match.slug);
  return {
    stats,
    players,
    formation: formationFromMatch(match),
    leagueStatsHref: sheet
      ? `/stats/${sheet.competitionId}/${sheet.slug}`
      : undefined,
  };
}
