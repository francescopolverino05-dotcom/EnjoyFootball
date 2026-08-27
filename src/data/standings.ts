import raw from './standings.json';

export type StandingCompetitionId =
  | 'primavera2'
  | 'coppaItalia'
  | 'uefaYouthLeague';

export const STANDING_COMPETITION_ORDER: StandingCompetitionId[] = [
  'primavera2',
  'coppaItalia',
  'uefaYouthLeague',
];

export interface StandingRow {
  pos: number;
  teamId: string;
  shortName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  pts: number;
  us?: boolean;
}

export interface StandingFixture {
  homeId: string;
  awayId: string;
  score?: string | null;
}

export interface StandingMatchday {
  number: number;
  date: string;
  fixtures: StandingFixture[];
}

export interface LeagueStandings {
  id: StandingCompetitionId;
  code: string;
  name: { en: string; it: string };
  kind: 'league';
  matchday: number;
  nextMatchday: number;
  nextMatchdayDate: string;
  rows: StandingRow[];
  matchdays: StandingMatchday[];
}

export interface CupFixture {
  date: string;
  home: string;
  away: string;
  score: string | null;
  ourClub?: string;
  us?: boolean;
}

export interface CupRound {
  id: string;
  name: { en: string; it: string };
  dateFrom: string;
  note?: string;
  fixtures: CupFixture[];
}

export interface CupStandings {
  id: StandingCompetitionId;
  code: string;
  name: { en: string; it: string };
  kind: 'cup';
  ourPath: {
    entryRound: string;
    next: {
      round: string;
      date: string;
      homeId: string;
      awayId: string;
      score: string | null;
    };
  } | null;
  rounds: CupRound[];
  /** Optional group-stage league table (e.g. UEFA Youth League). */
  groupTable?: LeagueStandings;
}

export interface StandingsDataset {
  season: string;
  updatedAt: string;
  sources: {
    primavera2: string | null;
    coppaItalia: string | null;
    uefaYouthLeague: string | null;
  };
  competitions: {
    primavera2: LeagueStandings;
    coppaItalia: CupStandings;
    uefaYouthLeague: CupStandings;
  };
}

const data = raw as StandingsDataset;

export function getStandingsDataset(): StandingsDataset {
  return data;
}

export function getPrimavera2Standings(): LeagueStandings {
  return data.competitions.primavera2;
}

export function getCoppaItaliaStandings(): CupStandings {
  return data.competitions.coppaItalia;
}

export function getUefaYouthLeagueStandings(): CupStandings {
  return data.competitions.uefaYouthLeague;
}

export function teamNameById(
  league: LeagueStandings,
  teamId: string
): string {
  const row = league.rows.find((r) => r.teamId === teamId);
  return row?.shortName ?? teamId;
}

/** Primavera 2 B qualification / relegation bands (16-team group). */
export type StandingZone = 'champions' | 'playoff' | 'playout' | 'relegated';

export function primavera2Zone(rank: number): StandingZone | null {
  if (rank === 1) return 'champions';
  if (rank >= 2 && rank <= 5) return 'playoff';
  // Primavera 2 B: 15th–16th enter the relegation playoff (not 14th).
  if (rank === 15 || rank === 16) return 'playout';
  return null;
}

export function standingRowClassName(
  rank: number,
  us?: boolean,
  options?: { zones?: boolean }
): string | undefined {
  const parts: string[] = [];
  if (options?.zones !== false) {
    const zone = primavera2Zone(rank);
    if (zone) parts.push(`standings-row--${zone}`);
  }
  if (us) parts.push('standings-row--us');
  return parts.length ? parts.join(' ') : undefined;
}

export type StandingFormResult = 'W' | 'D' | 'L';

function parseFixtureScore(
  score: string | null | undefined
): { home: number; away: number } | null {
  if (!score) return null;
  const m = String(score).trim().match(/^(\d+)\s*[-–:]\s*(\d+)$/);
  if (!m) return null;
  return { home: Number(m[1]), away: Number(m[2]) };
}

/** Last N results for a team from scored league matchdays (oldest → newest). */
export function getTeamForm(
  league: LeagueStandings,
  teamId: string,
  lastN = 5
): StandingFormResult[] {
  const results: StandingFormResult[] = [];
  const matchdays = [...league.matchdays].sort((a, b) => a.number - b.number);
  for (const md of matchdays) {
    for (const fx of md.fixtures) {
      if (fx.homeId !== teamId && fx.awayId !== teamId) continue;
      const parsed = parseFixtureScore(fx.score);
      if (!parsed) continue;
      const isHome = fx.homeId === teamId;
      const forGoals = isHome ? parsed.home : parsed.away;
      const againstGoals = isHome ? parsed.away : parsed.home;
      if (forGoals > againstGoals) results.push('W');
      else if (forGoals < againstGoals) results.push('L');
      else results.push('D');
    }
  }
  if (results.length <= lastN) return results;
  return results.slice(-lastN);
}
