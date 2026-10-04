import type { Localized } from '../i18n/translations';
import type { StatsCompetitionId } from './statsRankings';

export interface LeagueMatchGoal {
  minute: number;
  scorer: string;
  teamId: string;
}

export interface LeagueMatchTeamStatRow {
  stat: string;
  home: string;
  away: string;
}

export interface LeagueMatchPlayerStatRow {
  team: string;
  player: string;
  passes: number;
  passAccPct: number;
  progPasses: number;
  keyPasses: number;
  shots: number;
  onTarget: number;
  goals: number;
  xg: number;
  interceptions: number;
  recoveries: number;
  clearances: number;
  blocks: number;
  duelsWon: number;
  duels: number;
  fouls: number;
  ballsLost: number;
  saves: number;
  yellow: number;
}

export interface LeagueMatchStats {
  id: string;
  competitionId: StatsCompetitionId;
  date: string;
  matchday?: number;
  home: { teamId: string; name: string };
  away: { teamId: string; name: string };
  score: string;
  goals: LeagueMatchGoal[];
  note?: Localized;
  teamStats: LeagueMatchTeamStatRow[];
  playerStats: LeagueMatchPlayerStatRow[];
}
