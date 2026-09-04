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
  /** Away goals scored — UYL league-phase tiebreaker. */
  awayGf?: number;
  /** Away wins — UYL league-phase tiebreaker. */
  awayWins?: number;
  /**
   * Disciplinary points (yellow=1, direct red / double yellow expulsion=3).
   * Lower is better; used only after all league-phase matches are complete.
   */
  disciplinaryPts?: number;
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
  const cup = data.competitions.uefaYouthLeague;
  if (!cup.groupTable) return cup;
  return {
    ...cup,
    groupTable: withRankedUylTable(cup.groupTable),
  };
}

export function teamNameById(
  league: LeagueStandings,
  teamId: string
): string {
  const row = league.rows.find((r) => r.teamId === teamId);
  return row?.shortName ?? teamId;
}

/** Primavera 2 B / UYL qualification bands. */
export type StandingZone =
  | 'champions'
  | 'playoff'
  | 'playout'
  | 'relegated'
  | 'knockout';

export function primavera2Zone(rank: number): StandingZone | null {
  if (rank === 1) return 'champions';
  if (rank >= 2 && rank <= 5) return 'playoff';
  // Primavera 2 B: 15th–16th enter the relegation playoff (not 14th).
  if (rank === 15 || rank === 16) return 'playout';
  return null;
}

/**
 * UEFA Youth League Champions Path — top 22 advance to the round of 32
 * (joined by 10 Domestic Champions Path winners).
 * @see https://en.wikipedia.org/wiki/2026–27_UEFA_Youth_League_league_phase
 */
export function uylZone(rank: number): StandingZone | null {
  if (rank >= 1 && rank <= 22) return 'knockout';
  return null;
}

export function standingRowClassName(
  rank: number,
  us?: boolean,
  options?: {
    zones?: boolean;
    /** Override zone resolver (defaults to Primavera 2 bands). */
    zoneForRank?: (rank: number) => StandingZone | null;
  }
): string | undefined {
  const parts: string[] = [];
  if (options?.zones !== false) {
    const resolve = options?.zoneForRank ?? primavera2Zone;
    const zone = resolve(rank);
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

type UylComputed = StandingRow & {
  awayGf: number;
  awayWins: number;
  disciplinaryPts: number;
  opponentIds: Set<string>;
};

/**
 * Recompute W/D/L/GF/GA/Pts (+ away GF/wins) from scored league-phase fixtures.
 * Teams with no scored fixtures keep their existing row totals (useful pre-season).
 */
function computeUylStatsFromFixtures(
  league: LeagueStandings
): Map<string, UylComputed> {
  const byId = new Map<string, UylComputed>();
  for (const row of league.rows) {
    byId.set(row.teamId, {
      ...row,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      gf: 0,
      ga: 0,
      gd: 0,
      pts: 0,
      awayGf: 0,
      awayWins: 0,
      disciplinaryPts: row.disciplinaryPts ?? 0,
      opponentIds: new Set(),
    });
  }

  let scoredCount = 0;
  for (const md of league.matchdays) {
    for (const fx of md.fixtures) {
      const parsed = parseFixtureScore(fx.score);
      if (!parsed) continue;
      scoredCount += 1;
      const home = byId.get(fx.homeId);
      const away = byId.get(fx.awayId);
      if (!home || !away) continue;

      home.played += 1;
      away.played += 1;
      home.gf += parsed.home;
      home.ga += parsed.away;
      away.gf += parsed.away;
      away.ga += parsed.home;
      away.awayGf += parsed.away;
      home.opponentIds.add(fx.awayId);
      away.opponentIds.add(fx.homeId);

      if (parsed.home > parsed.away) {
        home.won += 1;
        home.pts += 3;
        away.lost += 1;
      } else if (parsed.home < parsed.away) {
        away.won += 1;
        away.pts += 3;
        away.awayWins += 1;
        home.lost += 1;
      } else {
        home.drawn += 1;
        away.drawn += 1;
        home.pts += 1;
        away.pts += 1;
      }
    }
  }

  // No results yet — keep JSON rows as-is (zeros / seeded order).
  if (scoredCount === 0) {
    const fallback = new Map<string, UylComputed>();
    for (const row of league.rows) {
      fallback.set(row.teamId, {
        ...row,
        awayGf: row.awayGf ?? 0,
        awayWins: row.awayWins ?? 0,
        disciplinaryPts: row.disciplinaryPts ?? 0,
        opponentIds: new Set(),
      });
    }
    return fallback;
  }

  for (const row of byId.values()) {
    row.gd = row.gf - row.ga;
  }
  return byId;
}

function leaguePhaseComplete(league: LeagueStandings): boolean {
  if (league.matchdays.length === 0) return false;
  for (const md of league.matchdays) {
    for (const fx of md.fixtures) {
      if (!parseFixtureScore(fx.score)) return false;
    }
  }
  return true;
}

/**
 * UEFA Youth League league-phase ranking (Article 16 / Wikipedia Tiebreakers).
 *
 * During the league phase (criteria 1–5): points, GD, GF, away GF, wins, away wins;
 * remaining ties → alphabetical by club name.
 *
 * After all matches (criteria 6–10): also opponent points, opponent GD, opponent GF,
 * lower disciplinary points, then drawing of lots (stable name order as proxy).
 *
 * @see https://en.wikipedia.org/wiki/2026–27_UEFA_Youth_League_league_phase#Tiebreakers
 */
export function compareUylRows(
  a: StandingRow & {
    awayGf?: number;
    awayWins?: number;
    disciplinaryPts?: number;
    opponentPts?: number;
    opponentGd?: number;
    opponentGf?: number;
  },
  b: typeof a,
  options?: { leagueComplete?: boolean }
): number {
  const cmp =
    b.pts - a.pts ||
    b.gd - a.gd ||
    b.gf - a.gf ||
    (b.awayGf ?? 0) - (a.awayGf ?? 0) ||
    b.won - a.won ||
    (b.awayWins ?? 0) - (a.awayWins ?? 0);

  if (cmp !== 0) return cmp;

  if (options?.leagueComplete) {
    const late =
      (b.opponentPts ?? 0) - (a.opponentPts ?? 0) ||
      (b.opponentGd ?? 0) - (a.opponentGd ?? 0) ||
      (b.opponentGf ?? 0) - (a.opponentGf ?? 0) ||
      (a.disciplinaryPts ?? 0) - (b.disciplinaryPts ?? 0);
    if (late !== 0) return late;
  }

  // Alphabetical (during phase for remaining ties; lots proxy when complete).
  return a.shortName.localeCompare(b.shortName, 'en');
}

/** Rank UYL rows with official tiebreakers; returns a new league table object. */
export function withRankedUylTable(league: LeagueStandings): LeagueStandings {
  const stats = computeUylStatsFromFixtures(league);
  const complete = leaguePhaseComplete(league);

  const enriched = [...stats.values()].map((row) => {
    let opponentPts = 0;
    let opponentGd = 0;
    let opponentGf = 0;
    for (const oppId of row.opponentIds) {
      const opp = stats.get(oppId);
      if (!opp) continue;
      opponentPts += opp.pts;
      opponentGd += opp.gd;
      opponentGf += opp.gf;
    }
    return { ...row, opponentPts, opponentGd, opponentGf };
  });

  enriched.sort((a, b) => compareUylRows(a, b, { leagueComplete: complete }));

  const rows: StandingRow[] = enriched.map((row, index) => ({
    pos: index + 1,
    teamId: row.teamId,
    shortName: row.shortName,
    played: row.played,
    won: row.won,
    drawn: row.drawn,
    lost: row.lost,
    gf: row.gf,
    ga: row.ga,
    gd: row.gd,
    pts: row.pts,
    awayGf: row.awayGf,
    awayWins: row.awayWins,
    disciplinaryPts: row.disciplinaryPts,
    ...(row.us ? { us: true } : {}),
  }));

  return { ...league, rows };
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
